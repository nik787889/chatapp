import React, { useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Stack } from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { grayColor, orange } from '../constants/color'
import { InputBox } from '../components/styles/StyledComp'
import FileMenu from '../components/dialogs/FileMenu'
import { sampleMessage } from '../constants/sampleData'
import MessageComp from '../components/shared/MessageComp'
import { getSocket } from '../socket'


const user = {
  _id: "wertyuvdcxz",
  name: "New User"
}

const Chat = () => {

  const containerRef = useRef(null)

  const socket = getSocket()

  const [message, setMessage] = useState("")
  console.log("message", message);

  const submitHandler = (e) => {
    e.preventDefault()
    console.log(message);
    setMessage("")
    if (!message.trim()) return
  }


  return (<>

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
      {
        sampleMessage.map((i) => (
          <MessageComp key={i._id} message={i} user={user} />
        ))
      }
    </Stack>

    <form style={{ height: "10%" }} onSubmit={submitHandler}>
      <Stack direction={"row"} alignItems={"center"} position={"relative"} height={"100%"} padding={"1rem"}>

        <IconButton sx={{ position: "absolute", left: "1.5rem" }} >
          <AttachFileIcon />
        </IconButton>

        <InputBox placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} />

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

    <FileMenu />

  </>)
}

export default AppLayout()(Chat) 