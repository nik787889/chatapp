// //
import { v2 as cloudinary } from 'cloudinary'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuid } from 'uuid'
import { corsOptions } from './constants/config.js'
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from './constants/events.js'
import { getSockets } from './lib/helper.js'
import { socketAuthentication } from './middlewares/auth.js'
import { errorMiddleware } from "./middlewares/error.js"
import { Message } from './models/message.js'
import adminRoute from "./routes/admin.js"
import chatRoute from "./routes/chat.js"
import userRoute from "./routes/user.js"
import { connectDB } from "./utils/features.js"

dotenv.config({ path: './.env' })

const port = 3000
const mongoURI = process.env.MONGO_URI
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION"
const userSocketIDs = new Map()
const onlineUsers = new Set()

connectDB(mongoURI)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: corsOptions })

app.set("io", io)

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.use('/api/v1/user', userRoute)
app.use('/api/v1/chat', chatRoute)
app.use('/api/v1/admin', adminRoute)

app.get('/', (req, res) => {
  res.send("This is Home Page")
})

app.use(errorMiddleware)


io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthentication(err, socket, next)
  )
})

io.on('connection', (socket) => {
  const user = socket.user
  userSocketIDs.set(user._id.toString(), socket.id)

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {

    const msgForRealTime = {
      _id: uuid(),
      content: message,
      chat: chatId,
      sender: { _id: user._id, name: user.name },
      createdAt: new Date().toISOString()
    }

    console.log("emitting message for real time:", msgForRealTime);


    const msgForDB = {
      content: message,
      sender: user._id,
      chat: chatId
    }

    const membersSocket = getSockets(members)
    io.to(membersSocket).emit(NEW_MESSAGE, { chatId, message: msgForRealTime })
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId })

    console.log("users data :-->>", msgForRealTime);
    try {
      await Message.create(msgForDB)
    } catch (error) {
      console.log("error:::", error);
    }
  })

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members)
    socket.to(membersSockets).emit(START_TYPING, { chatId })
  })

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members)
    socket.to(membersSockets).emit(STOP_TYPING, { chatId })
  })

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString())
    const membersSocket = getSockets(members)
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers))
  })

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString())
    const membersSocket = getSockets(members)
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers))
  })

  socket.on('disconnect', () => {
    userSocketIDs.delete(user._id.toString())
    onlineUsers.delete(user._id.toString())
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers))
  })
})


server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} Mode!`);
});


export { envMode, userSocketIDs }
