// //
import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import UserItem from '../shared/UserItem'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../../redux/reducers/misc'

const AddMemberDialog = ({ chatId }) => {

    const dispatch = useDispatch()
    const { isAddMember } = useSelector(state => state.misc)

    const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMembersMutation)
    const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId)
    console.log("data :::>>", data?.friends);

    const [selectedMembers, setselectedMembers] = useState([])

    const selectMemberHandler = (id) => {
        setselectedMembers((prev) => prev.includes(id) ? prev.filter((currEle) => currEle !== id) : [...prev, id])
    }


    const closeHandler = () => {
        // setselectedMembers([])
        // setMembers([])
        // handleClose();
        dispatch(setIsAddMember(false))
    }

    const addMemberSubmitHandler = () => {
        addMembers("Adding Members", { chatId, members: selectedMembers })
        closeHandler()
    }

    useErrors([{ isError, error }])

    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack width={"20rem"} p={"2rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"}>Add Member</DialogTitle>

                <Stack spacing={"1rem"}>
                    {isLoading ? <Skeleton /> : data?.friends.length > 0 ? (data?.friends.map((i) => (
                        <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
                    ))
                    ) : (
                        <Typography textAlign={"center"}>No Friends</Typography>
                    )}
                </Stack>

                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                    <Button onClick={closeHandler} color='error'>Cancel</Button>
                    <Button onClick={addMemberSubmitHandler} variant='contained' disabled={isLoadingAddMembers}>Submit Changes</Button>
                </Stack>


            </Stack>
        </Dialog>
    )
}

export default AddMemberDialog