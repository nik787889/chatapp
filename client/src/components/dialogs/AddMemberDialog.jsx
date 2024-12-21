// //
import React, {useState} from 'react'
import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import { sampleUsers } from '../../constants/sampleData'
import UserItem from '../shared/UserItem'

const AddMemberDialog = ({ addMember, isLoadingAddMember, chatId, open, handleClose, }) => {

    const [members, setMembers] = useState(sampleUsers)
    const [selectedMembers, setselectedMembers] = useState([])
    
    const selectMemberHandler = (id) => {
      setselectedMembers((prev) => prev.includes(id) ? prev.filter((currEle) => currEle !== id) : [...prev, id])
    }


    const closeHandler = () => {
      setselectedMembers([])
      setMembers([])
      handleClose();
    }

    const addMemberSubmitHandler = () => {
      closeHandler()
    }

    return (
        // <Dialog onClose={closeHandler}>
        <Dialog onClose={closeHandler} open={open}>
            <Stack open>
                <DialogTitle textAlign={"center"}>Add Member</DialogTitle>

                <Stack width={"20rem"} p={"2rem"} spacing={"1rem"}>
                    {members.length > 0 ? (members.map((i) => (
                        <UserItem key={i.id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
                    ))
                    ) : (
                        <Typography textAlign={"center"}>No Friends</Typography>
                    )}
                </Stack>

                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                <Button onClick={closeHandler} color='error'>Cancel</Button>
                <Button onClick={addMemberSubmitHandler} variant='contained' disabled={isLoadingAddMember}>Submit Changes</Button>
                </Stack>


            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog