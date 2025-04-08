// //
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from './Header'
import Title from '../shared/Title'
import { Drawer, Grid, Skeleton } from '@mui/material'
import ChatList from '../specific/ChatList'
import Profile from '../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducers/misc'
import { useErrors, useSocketEvents } from '../../hooks/hook'
import { getSocket } from '../../socket'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat'
import { getOrSaveFromStorage } from '../../lib/features'
import DeleteChatMenu from '../dialogs/DeleteChatMenu'

const AppLayout = () => (WrappedComp) => {
    return (props) => {

        const dispatch = useDispatch()
        const { isMobile } = useSelector((state) => state.misc)
        const { user } = useSelector((state) => state.auth)
        const { newMessagesAlert } = useSelector((state) => state.chat)
        const [onlineUsers, setOnlineUsers] = useState([])

        const navigate = useNavigate()
        const params = useParams()

        const chatId = params.chatId
        const deleteMenuAnchor = useRef(null)

        const socket = getSocket()
        // console.log(socket);


        const { isLoading, data, isError, error, refetch } = useMyChatsQuery('')

        useErrors([{ isError, error }])

        useEffect(() => {
            getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert })
        }, [newMessagesAlert])

        const handleDeleteChat = (e, chatId, groupChat) => {
            dispatch(setIsDeleteMenu(true))
            dispatch(setSelectedDeleteChat({ chatId, groupChat }))
            deleteMenuAnchor.current = e.currentTarget
        }

        const handleMobileClose = () => dispatch(setIsMobile(false))

        const newMessageAlertHandler = useCallback((data) => {
            if (data.chatId === chatId) return
            dispatch(setNewMessagesAlert(data))
        }, [chatId])

        const newRequestHandler = useCallback(() => {
            dispatch(incrementNotification())
        }, [dispatch])

        const refetchListener = useCallback(() => {
            refetch()
            navigate('/')
        }, [refetch, navigate])

        const onlineUsersListener = useCallback((data) => {
            console.log("onlineUsersListener::", data);
            setOnlineUsers(data)
        }, [])

        const eventHandlers = {
            [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
            [NEW_REQUEST]: newRequestHandler,
            [REFETCH_CHATS]: refetchListener,
            [ONLINE_USERS]: onlineUsersListener,
        }
        useSocketEvents(socket, eventHandlers)

        return (
            <>
                <Title />
                <Header />
                <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor.current} />
                {
                    isLoading ? <Skeleton /> : (
                        <Drawer open={isMobile} onClose={handleMobileClose}>
                            <ChatList w="70vw" chats={data?.chat} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers} />
                        </Drawer>
                    )
                }
                <Grid container height={'calc(100vh - 4rem)'}>
                    <Grid item sm={4} md={3} height={'100%'} sx={{ display: { xs: "none", sm: "block" }, }}>
                        {isLoading ? (<Skeleton />) : <ChatList chats={data?.chat} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers} />}
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={6} height={'100%'}>
                        <WrappedComp {...props} chatId={chatId} user={user} />
                    </Grid>
                    <Grid item md={4} lg={3} height={'100%'} sx={{ display: { xs: "none", md: "block" }, padding: "2rem", bgcolor: "rgba(0,0,0,0.85)", }}>
                        <Profile user={user} />
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default AppLayout