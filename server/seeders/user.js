// //

import { faker, simpleFaker } from "@faker-js/faker";
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";

const createUser = async (numUsers) => {
    try {
        const userPromise = []

        for (let i = 0; i < numUsers; i++) {
            const tempUser = User.create({
                name: faker.person.fullName(),
                username: faker.internet.username(),
                bio: faker.lorem.sentence(10),
                password: "password",
                avatar: {
                    public_id: faker.system.fileName(),
                    url: faker.image.avatar(),
                },
            })
            userPromise.push(tempUser)
        }

        await Promise.all(userPromise);

        console.log("created Users :: ", numUsers);
        // process.exit(1)

    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}


const createSingleChat = async (numChats) => {
    try {

        const users = await Chat.find().select('_id')

        const chatPromise = []

        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                chatPromise.push(
                    Chat.create({
                        name: faker.lorem.word(2),
                        members: [users[i], users[j]]
                    })
                )
            }
        }

        await Promise.all(chatPromise)
        console.log("Chat created successfully")
        process.exit()

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}


const createGroupChat = async (numChats) => {
    try {

        const users = await User.find().select('_id')

        const chatPromise = []

        for (let i = 0; i < numChats; i++) {

            const numMembers = simpleFaker.number.int({ min: 3, max: users.length })
            const members = []

            for (let i = 0; i < numMembers; i++) {

                const randIndex = Math.floor(Math.random() * users.length)
                const randUser = users[randIndex]

                if (!members.includes(randUser)) {
                    members.push(randUser)
                }
            }

            const chat = Chat.create({
                groupChat: true,
                name: faker.lorem.word(1),
                members,
                creator: members[0]
            })

            chatPromise.push(chat)
        }

        await Promise.all(chatPromise)
        console.log("Chat created successfully")
        process.exit()

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}


const createMessages = async (numMessages) => {
    try {
        const users = await User.find().select('_id')
        const chats = await Chat.find().select('_id')

        const messagesPromise = []

        for (let i = 0; i < numMessages; i++) {
            const randUser = users[Math.floor(Math.random() * users.length)]
            const randChat = chats[Math.floor(Math.random() * chats.length)]

            messagesPromise.push(Message.create({
                chat: randChat,
                sender: randUser,
                content: faker.lorem.sentence(),
            }))
        }

        await Promise.all(messagesPromise)
        console.log("Messages created successfully");
        process.exit()

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}


const createMessagesInAChat = async (chatId, numMessages) => {
    try {
        const users = await User.find().select('_id')

        const messagesPromise = []

        for (let i = 0; i < numMessages; i++) {
            const randUser = users[Math.floor(Math.random() * users.length)]

            messagesPromise.push(Message.create({
                chat: chatId,
                sender: randUser,
                content: faker.lorem.sentence(),
            }))
        }

        await Promise.all(messagesPromise)
        console.log("Messages created successfully");
        process.exit()

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}


export { createUser, createSingleChat, createGroupChat, createMessages, createMessagesInAChat }