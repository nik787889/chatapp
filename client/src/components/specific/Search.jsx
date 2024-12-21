// //
import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem'
import { sampleUsers } from '../../constants/sampleData'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '../../redux/reducers/misc'
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api'
import toast from 'react-hot-toast'
import { useAsyncMutation } from '../../hooks/hook'



const Search = () => {

    const dispatch = useDispatch()

    const { isSearch } = useSelector((state) => state.misc)

    const [searchUser] = useLazySearchUserQuery()
    const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation)

    const [users, setUsers] = useState([])

    const search = useInputValidation("")

    const addFriendHandler = async (id) => {
        await sendFriendRequest("Sending friend request...", { userId: id })
    }

    const closeSearch = () => dispatch(setIsSearch(false))


    useEffect(() => {
        const timeOutId = setTimeout(() => {
            searchUser(search.value)
                .then(({ data }) => setUsers(data?.users || []))
                .catch((err) => console.log("searchUser error", err));
        }, 300);

        return () => {
            clearTimeout(timeOutId);
        };
    }, [search.value]);

    

    return (
        <Dialog open={isSearch} onClose={closeSearch}>
            <Stack p={"2rem"} direction={"column"} width={"25rem"}>
                <DialogTitle textAlign={"center"}>Find Peoples</DialogTitle>
                <TextField
                    label=""
                    value={search.value}
                    onChange={search.changeHandler}
                    variant='outlined'
                    size='small'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />

                <List>
                    {users.map((i) => (
                        <UserItem
                            user={i}
                            key={i._id}
                            handler={addFriendHandler}
                            handlerIsLoading={isLoadingSendFriendRequest}
                        />
                    ))}
                </List>

            </Stack>
        </Dialog>
    )
}

export default Search