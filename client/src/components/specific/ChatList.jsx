// //
import React from 'react'
import { Stack } from '@mui/material'
import ChatItem from '../shared/ChatItem'
import { bgGradient } from '../../constants/color'

const ChatList = ({

    w = "100%",
    chatId,
    chats = [],
    onlineUsers = [],
    newMessagesAlert = [{ chatId: "", count: 0 }],
    handleDeleteChat,

}) => {

    return (
        <Stack width={w} height={"100%"} direction={"column"} overflow={"auto"} >
            {chats.map((data, index) => {

                const { _id, name, avatar, groupChat, members } = data

                const newMessageAlert = newMessagesAlert.find(
                    ({ chatId }) => chatId === _id
                )

                const isOnline = members?.some((member) => onlineUsers.includes(_id))

                return <ChatItem
                    index={index}
                    newMessageAlert={newMessageAlert}
                    isOnline={isOnline}
                    avatar={avatar}
                    name={name}
                    _id={_id}
                    key={_id}
                    groupChat={groupChat}
                    sameSender={chatId === _id}
                    handleDeleteChat={handleDeleteChat}
                />
            })}

        </Stack>
    )
}

export default ChatList