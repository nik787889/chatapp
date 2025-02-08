import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc'
import { ExitToApp as ExitToAppIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {

    const { isDeleteMenu, selectedDeleteChat } = useSelector((state) => state.misc)

    const navigate = useNavigate()

    const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteChatMutation)
    const [leaveGroup, __, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation)

    const isGroup = selectedDeleteChat.groupChat

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false))
        deleteMenuAnchor.current = null
    }

    const deleteChatHandler = () => {
        closeHandler()
        leaveGroup("Deleting Chat", selectedDeleteChat.chatId)
    }

    const leaveGroupHandler = () => {
        closeHandler()
        deleteChat("Leaving Group", selectedDeleteChat.chatId)
    }

    useEffect(() => {
        if (deleteChatData || leaveGroupData) navigate('/')
    }, [deleteChatData])

    return (
        <Menu
            open={isDeleteMenu}
            onClose={closeHandler}
            anchorEl={deleteMenuAnchor}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "center", horizontal: "center" }}
        >
            <Stack
                sx={{ width: "10rem", padding: "0.5rem", cursor: "pointer", }}
                direction={'row'}
                alignItems={'center'}
                spacing={'0.5rem'}
                onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
            >
                {isGroup ?
                    <>
                        <ExitToAppIcon /><Typography>Leave Group</Typography>
                    </> :
                    <>
                        <DeleteIcon /><Typography>Delete Chat</Typography>
                    </>}
            </Stack>
        </Menu >
    )
}

export default DeleteChatMenu
