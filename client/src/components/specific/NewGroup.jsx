// //
import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import { sampleUsers } from '../../constants/sampleData'
import UserItem from '../shared/UserItem'
import { useInputValidation } from '6pp'

const NewGroup = () => {

  const [members, setMembers] = useState(sampleUsers)
  const [selectedMembers, setselectedMembers] = useState([])

  const groupName = useInputValidation("")

  const selectMemberHandler = (id) => {
    setselectedMembers((prev) => prev.includes(id) ? prev.filter((currEle) => currEle !== id) : [...prev, id])
  }
  console.log(selectedMembers);


  const submitHandler = () => {

  }

  const closeHandler = () => {

  }

  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>

        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler} />

        <Typography variant='body1'>Members</Typography>

        <Stack>
          {members.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(i._id)}
            />
          ))}
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="text" color="error" size='large' onClick={closeHandler} >Cancel</Button>
          <Button variant="contained" size='large' onClick={submitHandler} >Create</Button>
        </Stack>

      </Stack>
    </Dialog>
  )
}

export default NewGroup