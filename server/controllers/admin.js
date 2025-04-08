// //
import jwt from 'jsonwebtoken'
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/features.js"



const adminLogin = TryCatch(async (req, res, next) => {

    const { secretKey } = req.body

    const adminSecretKey = process.env.ADMIN_SECRET_KEY || "299792458m/S"

    const isMatched = secretKey === adminSecretKey

    if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401))

    const token = jwt.sign(secretKey, process.env.JWT_SECRET)

    return res.status(200)
        .cookie("admin-token", token, { ...cookieOptions, maxAge: 1000 * 60 * 60 })
        .json({ success: true, message: "Authenticated successfully, Welcome Admin" })
})


const adminLogout = TryCatch(async (req, res, next) => {
    return res.status(200)
        .cookie("admin-token", "", { ...cookieOptions, maxAge: 0 })
        .json({ success: true, message: "Admin Logout successfully" })
})


const getAdminData = TryCatch(async (req, res, next) => {
    return res.status(200).json({ admin: true })
})


const allUsers = TryCatch(async (req, res, next) => {

    const users = await User.find({})

    const transformedUsres = await Promise.all(users.map(async ({ name, username, avatar, _id }) => {

        const [groups, friends] = await Promise.all([
            Chat.countDocuments({ groupChat: true, members: _id }),
            Chat.countDocuments({ groupChat: false, members: _id }),
        ])

        return { name, username, avatar: avatar.url, _id, groups, friends }
    }))

    return res.status(200).json({ status: "success", data: transformedUsres })

})


const allChats = TryCatch(async (req, res, next) => {

    const chats = await Chat.find({}).populate('members', 'name avatar').populate('creator', 'name avatar')

    const transformedChats = await Promise.all(chats.map(async ({ members, _id, groupChat, name, creator }) => {

        const totalMessages = await Message.countDocuments({ chat: _id })

        return {
            _id,
            groupChat,
            name,
            avatar: members.slice(0, 3).map((m) => m.avatar.url),
            members: members.map(({ _id, name, avatar }) => (_id, name, avatar)),
            creator: { name: creator?.name || "None", avatar: creator?.avatar.url || "", },
            totalMembers: members.length,
            totalMessages,
        }
    }))

    return res.status(200).json({ status: "success", data: transformedChats })

})


const allMessages = TryCatch(async (req, res, next) => {

    const messages = await Message.find({}).populate('sender', 'name avatar').populate('chat', 'groupChat')

    const transformedMessages = messages.map(({ _id, content, sender, attachments, chat, createdAt, }) => ({
        _id,
        attachments,
        content,
        createdAt,
        chat: chat.groupChat,
        groupChat: chat.groupChat,
        sender: { _id: sender._id, name: sender.name, avatar: sender.avatar.url, }
    }))

    return res.status(200).json({ success: true, messages: transformedMessages })

})


// const getDashboardStats = TryCatch(async (req, res, next) => {

//     const [groupsCount, usersCount, messagesCount, totalChatsCount] = await Promise.all([
//         Chat.countDocuments({ groupChat: true }), User.countDocuments(), Message.countDocuments(), Chat.countDocuments()
//     ])

//     const today = new Date()
//     const last7Days = new Date()
//     last7Days.setDate(last7Days.getDate() - 7)

//     const last7DaysMessages = await Message.find({ createdAt: { $gte: last7Days, $lte: today } }).select('createdAt')

//     const messages = new Array(7).fill(0)
//     const dayInMilliSeconds = 1000 * 60 * 60 * 24

//     last7DaysMessages.forEach((msg) => {
//         const indexApprox = (today.getTime() - msg.createdAt.getTime()) / dayInMilliSeconds
//         const index = Math.floor(indexApprox)
//         messages[6 - index]++
//     })

//     const stats = { groupsCount, usersCount, messagesCount, totalChatsCount, messagesChart: messages }

//     return res.status(200).json({ success: true, stats })
// })

const getDashboardStats = TryCatch(async (req, res) => {
    const [groupsCount, usersCount, messagesCount, totalChatsCount] =
        await Promise.all([
            Chat.countDocuments({ groupChat: true }),
            User.countDocuments(),
            Message.countDocuments(),
            Chat.countDocuments(),
        ]);

    const today = new Date();

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7Days,
            $lte: today,
        },
    }).select("createdAt");

    const messages = new Array(7).fill(0);
    const dayInMiliseconds = 1000 * 60 * 60 * 24;

    last7DaysMessages.forEach((message) => {
        const indexApprox =
            (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;
        const index = Math.floor(indexApprox);

        messages[6 - index]++;
    });

    const stats = {
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart: messages,
    };

    return res.status(200).json({
        success: true,
        stats,
    });
});


export { adminLogin, adminLogout, getAdminData, allUsers, allChats, allMessages, getDashboardStats, }