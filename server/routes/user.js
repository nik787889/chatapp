// //
import express from 'express'
import { newUser, login, getMyProfile, logout, searchUser, sendFriendRequest, acceptFriendRequest, getAllNotifications, getMyFriends } from '../controllers/user.js';
import { singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { registerValidator, loginValidator, sendRequestValidator, acceptRequestValidator, validateHandler } from '../lib/validators.js';

const app = express.Router()

app.post('/new', singleAvatar, registerValidator(), validateHandler, newUser)
app.post('/login', loginValidator(), validateHandler, login)

app.use(isAuthenticated)
app.get('/me', getMyProfile)
app.get('/logout', logout)
app.get('/search', searchUser)
app.put('/send_request', sendRequestValidator(), validateHandler, sendFriendRequest)
app.put('/accept_request', acceptRequestValidator(), validateHandler, acceptFriendRequest)
app.get('/notifications', getAllNotifications)
app.get('/friends', getMyFriends)

export default app;