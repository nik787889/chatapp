import { TryCatch } from "../middlewares/error.js"
import { Chat } from "../models/chat.js"
import { User } from "../models/user.js"
import { Message } from "../models/message.js"
import { ErrorHandler } from "../utils/utility.js"
import { ALERT, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js"
import { deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from "../utils/features.js"
import { getOtherMember } from "../lib/helper.js"
import { Types } from "mongoose"
// //
const newGroupChat = TryCatch(async (req, res, next) => {
    const { name, members } = req.body

    if (members.length < 2) return next(new ErrorHandler("Group chat must have at least 3 members", 400))

    const allMembers = [...members, req.user]

    await Chat.create({
        name, groupChat: true, creator: req.user, members: allMembers
    })

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`)
    emitEvent(req, REFETCH_CHATS, members)

    return res.status(201).json({ success: true, message: "Group Created" })
})



const getMyChats = TryCatch(async (req, res, next) => {

    const userId = req.user

    // // Using Aggregation Pipeline
    // const chats = await Chat.aggregate([
    //     {
    //         $match: { members: new Types.ObjectId(userId) }
    //     },
    //     {
    //         $lookup: { from: 'users', localField: 'members', foreignField: '_id', as: 'members' }
    //     },
    //     {
    //         $project: {
    //             _id: 1,
    //             groupChat: 1,
    //             name: 1,
    //             members: { $filter: { input: '$members', as: 'member', cond: { $ne: ["$$member._id", new Types.ObjectId(userId)] } } },
    //             avatar: { $slice: [{ $map: { input: "$members", as: "member", in: "$$member.avatar" } }, 3] }
    //         }
    //     }
    // ])

    // const transformedChats = chats.map(chat => ({
    //     _id: chat._id,
    //     groupChat: chat.groupChat,
    //     avatar: chat.groupChat ? chat.avatar.map(member => member.url) : [chat.members[0].avatar.url],
    //     name: chat.groupChat ? chat.name : chat.members[0].name,
    //     members: chat.members.map(member => member._id)
    // }));


    // // Without uisng Aggregation Pipeline
    const chats = await Chat.find({ members: userId }).populate('members', 'avatar name')

    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {

        const otherMember = getOtherMember(members, userId)

        return {
            _id,
            groupChat,
            avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => avatar.url) : [otherMember.avatar.url],
            name: groupChat ? name : otherMember.name,
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== userId.toString()) {
                    prev.push(curr._id)
                }
                return prev
            }, []),
        }

    })

    return res.status(200).json({ success: true, chat: transformedChats })
})



const getMyGroup = TryCatch(async (req, res, next) => {
    const userId = req.user

    const chats = await Chat.find({ members: userId, groupChat: true, creator: userId }).populate('members', 'avatar name')

    const groups = chats.map(({ _id, name, groupChat, members }) => ({
        _id,
        name,
        groupChat,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }))

    return res.status(200).json({ success: true, Chats: chats, Groups: groups })

})



const addMembers = TryCatch(async (req, res, next) => {

    const { chatId, members } = req.body

    if (!members || members.length < 1) return next(new ErrorHandler("Please provide members", 400))

    const chat = await Chat.findById(chatId)
    if (!chat) return next(new ErrorHandler("Chat not found", 404))
    if (!chat.groupChat) return next(new ErrorHandler("This is not a Group chat", 400))
    if (chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler("You are not allowed to add members", 403))

    const allNewMembersPromise = members.map((i) => User.findById(i, 'name'))

    const allNewMembers = await Promise.all(allNewMembersPromise)

    const uniqueMembers = allNewMembers.filter((i) => !chat.members.includes(i._id.toString())).map((i) => i._id)

    chat.members.push(...uniqueMembers)

    if (chat.members.length > 100) return next(new ErrorHandler("Group members max limit reached", 400))

    await chat.save()

    const allUsersName = allNewMembers.map((i) => i.name).join(",")

    emitEvent(req, ALERT, chat.members, `${allUsersName} has been added in the group`)

    emitEvent(req, REFETCH_CHATS, chat.members)

    return res.status(200).json({ success: true, message: "Member added successfully !" })

})



const removeMembers = TryCatch(async (req, res, next) => {

    const { userId, chatId } = req.body

    const [chat, userThatWillBeRemoved] = await Promise.all([Chat.findById(chatId), User.findById(userId, 'name')])

    if (!chat) return next(new ErrorHandler("Chat not found", 404))
    if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400))
    if (chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler("You are not allowed to remove members", 403))
    if (chat.members.length < 3) return next(new ErrorHandler("Group must have at least 3 members", 400))

    const allChatMembers = chat.members

    chat.members = chat.members.filter((m) => m.toString() !== userId.toString())
    await chat.save()

    emitEvent(req, ALERT, chat.members, { message: `${userThatWillBeRemoved} ko kutte ki maut mar ke bhaga diya`, chatId })

    emitEvent(req, REFETCH_CHATS, allChatMembers)

    return res.status(200).json({ success: true, message: "Member removed successfully !" })
})



const leaveGroup = TryCatch(async (req, res, next) => {

    const chatId = req.params.id
    const userId = req.user

    const chat = await Chat.findById(chatId)
    if (!chat) return next(new ErrorHandler("Chat not found", 404))
    if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400))

    const remainingMembers = chat.members.filter((m) => m.toString() !== userId.toString())

    if (chat.creator.toString() === userId.toString()) {
        const randEle = Math.floor(Math.random() * remainingMembers.length)
        const newCreator = remainingMembers[randEle]
        chat.creator = newCreator
    }

    chat.members = remainingMembers

    const [user] = await Promise.all([User.findById(userId, 'name'), chat.save()])

    if (!user) return next(new ErrorHandler("User not found", 404))

    emitEvent(req, ALERT, chat.members, { message: `${user.name} dar ke bhag gaya`, chatId })

    return res.status(200).json({ success: true, message: "Leave Group successfully !" })
})



const sendAttachments = TryCatch(async (req, res, next) => {

    const { chatId } = req.body
    const userId = req.user

    const [chat, me] = await Promise.all([Chat.findById(chatId), User.findById(userId, 'name')])
    if (!chat) return next(new ErrorHandler("Chat not found", 404))

    // // Kam baki

    const files = req.files || []
    if (files.length < 1) return next(new ErrorHandler("Please provide attachments", 400))
    if (files.length > 6) return next(new ErrorHandler("Files can't be more then 5", 400))

    const attachments = await uploadFilesToCloudinary(files)

    const messageForDB = { content: "", attachments, sender: me._id, chat: chatId }

    const messageForRealTime = { ...messageForDB, sender: { _id: me._id, name: me.name } }

    const message = await Message.create(messageForDB)

    emitEvent(req, NEW_MESSAGE, chat.members, { message: messageForRealTime, chatId })

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId })

    return res.status(200).json({ success: true, Message: message })
})



const getChatDetailes = TryCatch(async (req, res, next) => {

    if (req.query.populate === "true") {

        const chat = await Chat.findById(req.params.id).populate('members', 'avatar name').lean()
        // // here, .lean() is used for "skips creating Mongoose document (don't save in DB)"

        if (!chat) return next(new ErrorHandler("Chat not found", 404))

        chat.members = chat.members.map(({ _id, name, avatar }) => ({ _id, name, avatar: avatar.url }))

        return res.status(200).json({ success: true, chat })

    } else {

        const chat = await Chat.findById(req.params.id)

        if (!chat) return next(new ErrorHandler("Chat not found", 404))

        return res.status(200).json({ success: true, chat })

    }

})



const renameGroup = TryCatch(async (req, res, next) => {
    const chatId = req.params.id
    const { name } = req.body

    const chat = await Chat.findById(chatId)

    if (!chat) return next(new ErrorHandler("Chat not found", 404))
    if (!chat.groupChat) return next(new ErrorHandler("This is not a Group chat", 400))
    if (chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler("You are not allowed to rename group", 403))

    chat.name = name
    await chat.save()

    emitEvent(req, REFETCH_CHATS, chat.members)

    return res.status(200).json({ success: true, message: "Group renamed successfully" })
})



const deleteChat = TryCatch(async (req, res, next) => {
    const chatId = req.params.id

    const chat = await Chat.findById(chatId);
    if (!chatId) return next(new ErrorHandler("Chat not found", 404))


    const members = chat.members
    if (chat.groupChat && chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler("You are not allowed to delete the group", 403))
    if (!chat.groupChat && !chat.members.includes(req.user.toString())) return next(new ErrorHandler("You are not allowed to delete the group", 403))

    const messagesWithAttachments = await Message.find({ chat: chatId, attachments: { $exists: true, $ne: [] }, })

    const public_ids = []

    messagesWithAttachments.forEach(({ attachments }) => attachments.forEach(({ public_id }) => public_ids.push(public_id)))

    await Promise.all([
        deleteFilesFromCloudinary(public_ids),
        chat.deleteOne(),
        Message.deleteMany({ chat: chatId }),
    ])

    emitEvent(req, REFETCH_CHATS, members)

    res.status(200).json({ success: true, message: "Chat deleted successfully" })

})



const getMessages = TryCatch(async (req, res, next) => {

    const chatId = req.params.id
    const { page = 1 } = req.query
    const resultPerPage = 20
    const skip = (page - 1) * resultPerPage

    const chat = await Chat.findById(chatId)
    if (!chat) return next(new ErrorHandler("Chat not found", 404))
    if (!chat.members.includes(req.user.toString())) {
        return next(new ErrorHandler("You are not allowed to access this chat", 403))
    }

    const [messages, totalMessagesCount] = await Promise.all([
        Message.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(resultPerPage)
            .populate('sender', 'name')
            .lean(),

        Message.countDocuments({ chat: chatId })
    ])

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0

    res.status(200).json({ success: true, message: messages.reverse(), totalPages })
})


export { newGroupChat, getMyChats, getMyGroup, addMembers, removeMembers, leaveGroup, sendAttachments, getChatDetailes, renameGroup, deleteChat, getMessages }