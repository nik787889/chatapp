import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { grayColor, orange } from '../constants/color'
import { InputBox } from '../components/styles/StyledComp'
import FileMenu from '../components/dialogs/FileMenu'
import { sampleMessage } from '../constants/sampleData'
import MessageComp from '../components/shared/MessageComp'
import { getSocket } from '../socket'
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/events"
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api'
import { useErrors, useSocketEvents } from '../hooks/hook'
import { useInfiniteScrollTop } from '6pp'
import { useDispatch } from 'react-redux'
import { setIsFileMenu } from '../redux/reducers/misc'
import { removeNewMessagesAlert } from '../redux/reducers/chat'
import { TypingLoader } from '../components/layout/Loaders'
import { useNavigate } from 'react-router-dom'


const Chat = ({ chatId, user }) => {

  const dispatch = useDispatch()
  const bottomRef = useRef(null)

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [page, setPage] = useState(1)
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null)

  const [IamTyping, setIamTyping] = useState(false)
  const [userTyping, setUserTyping] = useState(false)
  const typingTimeout = useRef(null)

  const navigate = useNavigate()

  const containerRef = useRef(null)
  const socket = getSocket()
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId })
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page })
  const members = chatDetails.data?.chat?.members

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.message,
  )

  const allMessages = [...oldMessages, ...messages]

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ]

  const messageOnChange = (e) => {
    setMessage(e.target.value)
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId })
      setIamTyping(true)
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId })
      setIamTyping(false)
    }, 500);
  }

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true))
    setFileMenuAnchor(e.currentTarget)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    // // Emitting message to the server.
    socket.emit(NEW_MESSAGE, { chatId, members, message })
    setMessage("")
  }

  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId))
    return () => {
      setMessage([])
      setMessages([])
      setOldMessages([])
      setPage(1)
    }
  }, [chatId])

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!chatDetails.data?.chat) return navigate('/')
  }, [chatDetails.data])

  const newMessagesListener = useCallback((data) => {
    if (data.chatId !== chatId) return
    setMessages((prev) => {
      const updatedMessages = [...prev, data.message];
      return updatedMessages;
    });
  }, [chatId]);

  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return
    setUserTyping(true)
  }, [chatId]);

  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return
    setUserTyping(false)
  }, [chatId]);

  const alertListener = useCallback((content) => {
    const messageForAlert = {
      content,
      sender: {
        _id: "gjhfjgugygyjhgiu",
        name: "Admin"
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    }
    setMessages((pre) => [...pre, messageForAlert])
  }, [chatId]);


  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  }
  useSocketEvents(socket, eventHandler)

  useErrors(errors)



  return chatDetails.isLoading ? <Skeleton /> : (
    <Fragment>
      <Stack
        ref={containerRef}
        height={"90%"}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        sx={{
          overflowX: "hidden", overflowY: "auto"
        }}
      >
        {/*"render chat here"*/}
        {allMessages.map((i) => (
          <MessageComp key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />

      </Stack>

      <form style={{ height: "10%" }} onSubmit={submitHandler}>
        <Stack direction={"row"} alignItems={"center"} position={"relative"} height={"100%"} padding={"1rem"}>

          <IconButton sx={{ position: "absolute", left: "1.5rem" }} onClick={handleFileOpen}>
            <AttachFileIcon />
          </IconButton>

          <InputBox placeholder='Message' value={message} onChange={messageOnChange} />

          <IconButton
            type='submit'
            sx={{
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": { bgcolor: "error.dark", }
            }}
          >
            <SendIcon />
          </IconButton>

        </Stack>
      </form>

      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  )
}

export default AppLayout()(Chat) 