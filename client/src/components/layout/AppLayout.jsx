// //
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from './Header'
import Title from '../shared/Title'
import { Drawer, Grid, Skeleton } from '@mui/material'
import ChatList from '../specific/ChatList'
import { sampleChats } from '../../constants/sampleData'
import Profile from '../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { setIsMobile } from '../../redux/reducers/misc'
import { useErrors, useSocketEvents } from '../../hooks/hook'
import { getSocket } from '../../socket'
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from '../../constants/events'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat'

const AppLayout = () => (WrappedComp) => {
    return (props) => {

        const dispatch = useDispatch()
        const { isMobile } = useSelector((state) => state.misc)
        const { user } = useSelector((state) => state.auth)
        const { newMessagesAlert } = useSelector((state) => state.chat)

        const params = useParams()
        const chatId = params.chatId

        const socket = getSocket()
        // console.log(socket);


        const { isLoading, data, isError, error, refetch } = useMyChatsQuery('')

        useErrors([{ isError, error }])

        const handleDeleteChat = (e, _id, groupChat) => {
            e.preventDefault()
            console.log("Delete chat", _id, groupChat);
        }

        const handleMobileClose = () => dispatch(setIsMobile(false))

        const newMessageAlertHandler = useCallback((data) => {
            if (data.chatId === chatId) return
            dispatch(setNewMessagesAlert(data))
        }, [chatId])

        const newRequestHandler = useCallback(() => {
            dispatch(incrementNotification())
        }, [dispatch])

        const eventHandlers = {
            [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
            [NEW_REQUEST]: newRequestHandler,
        }
        useSocketEvents(socket, eventHandlers)

        return (
            <>
                <Title />
                <Header />
                {
                    isLoading ? <Skeleton /> : (
                        <Drawer open={isMobile} onClose={handleMobileClose}>
                            <ChatList w="70vw" chats={data?.chat} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} />
                        </Drawer>
                    )
                }
                <Grid container height={'calc(100vh - 4rem)'}>
                    <Grid item sm={4} md={3} height={'100%'} sx={{ display: { xs: "none", sm: "block" }, }}>
                        {isLoading ? (<Skeleton />) : <ChatList chats={data?.chat} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} />}
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