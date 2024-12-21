// //
// import mongoose from "mongoose"
import { compare } from "bcrypt"
import { User } from "../models/user.js"
import { Chat } from "../models/chat.js"
import { Request } from "../models/request.js"
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from "../utils/features.js"
import { TryCatch } from "../middlewares/error.js"
import { ErrorHandler } from "../utils/utility.js"
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js"
import { getOtherMember } from "../lib/helper.js"

const newUser = TryCatch(async (req, res, next) => {

    const { name, username, password, bio } = req.body

    const file = req.file

    if(!file) return next(new ErrorHandler("Please upload avatar", 400))

    const result = await uploadFilesToCloudinary([file])

    const avatar = { public_id: result[0].public_id, url: result[0].url }

    const user = await User.create({ name, username, password, bio, avatar })

    sendToken(res, user, 201, "User Created")

})



const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body

    const user = await User.findOne({ username }).select("+password")
    if (!user) return next(new ErrorHandler("Invalid credentials", 404))

    const isMatch = await compare(password, user.password)
    if (!isMatch) return next(new ErrorHandler("Invalid credentials", 404))

    sendToken(res, user, 200, `welcome back ${user.name}`)
})



const getMyProfile = TryCatch(async (req, res) => {

    const user = await User.findById(req.user)

    res.status(200).json({ success: true, data: user })
})


const logout = TryCatch(async (req, res) => {

    return res.status(200)
        .cookie("user-token", "", { ...cookieOptions, maxAge: 0 })
        .json({ success: true, message: "Logout successfully !" })

})



const searchUser = TryCatch(async (req, res) => {
    const { name = "" } = req.query;

    const myChats = await Chat.find({ groupChat: false, members: req.user });

    const allUsersFromMyChat = myChats.flatMap((chat) => chat.members);
    
    // If the name is empty, don't filter by name, return all users
    const filter = name ? { name: { $regex: name, $options: 'i' } } : {};

    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: [...allUsersFromMyChat, req.user] },
        ...filter,
    });

    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
    }));

    return res.status(200).json({ success: true, users });
});



const sendFriendRequest = TryCatch(async (req, res, next) => {

    const { userId } = req.body

    const request = await Request.findOne({
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, receiver: req.user },
        ],
    })

    if (request) return next(new ErrorHandler("Request already sent", 400))

    await Request.create({ sender: req.user, receiver: userId })

    emitEvent(req, NEW_REQUEST, [userId],)

    return res.status(200).json({ success: true, message: "Friend request sent successfully !" })

})


const acceptFriendRequest = TryCatch(async (req, res, next) => {

    const { requestId, accept } = req.body

    const request = await Request.findById(requestId).populate('sender', 'name').populate('receiver', 'name')

    if (!request) return next(new ErrorHandler("Request not found", 400))
    if (request.receiver._id.toString() !== req.user.toString()) return next(new ErrorHandler("you are not authorized to accept this request", 401))

    if (!accept) {
        await request.deleteOne()
        return res.status(200).json({ success: true, message: "Friend Request Rejected!" })
    }


    const members = [request.sender._id, request.receiver._id]
    await Promise.all([
        Chat.create({ members, name: `${request.sender.name}-${request.receiver.name}`, }),
        request.deleteOne(),
    ])

    emitEvent(req, REFETCH_CHATS, members)

    return res.status(200).json({ success: true, message: "Friend request accepted !", senderId: request.sender._id, })

})


const getAllNotifications = TryCatch( async(req, res, next) => {

    const requests = await Request.find({receiver:req.user}).populate('sender', 'name avatar')

    const allRequests = requests.map(({_id, sender})=>({
     _id, 
     sender: { _id: sender._id, name:sender.name, avatar:sender.avatar.url, }
    }))
   
    return res.status(200).json({ success: true, request: allRequests, })
})


const getMyFriends = TryCatch( async(req, res, next) => {

    const chatId = req.query.chatId

    const chats = await Chat.find({ members: req.user, groupChat: false }).populate('members', 'name avatar')

    const friends = chats.map(({members})=>{
        const otherUsers = getOtherMember(members, req.user)
        return{ 
            _id: otherUsers._id, name:otherUsers.name, avatar: otherUsers.avatar.url
        }
    })

    if (chatId) {

        const chat = await Chat.findById(chatId)
        const availableFriends = friends.filter( (f) => !chat.members.includes(f._id))
        return res.status(200).json({ success: true, friends: availableFriends, })

    } else {
        return res.status(200).json({ success: true, friends, })
    }
   
})


export { newUser, login, getMyProfile, logout, searchUser, sendFriendRequest, acceptFriendRequest, getAllNotifications, getMyFriends, }