// //
import React, { memo } from 'react'
import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import { sampleNotifications } from '../../constants/sampleData'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'


const Notifications = () => {

    const { isNotification } = useSelector((state) => state.misc)

    const dispatch = useDispatch()

    const { isLoading, data, error, isError } = useGetNotificationsQuery()
    const [acceptRequest] = useAcceptFriendRequestMutation()

    console.log("notification data:::", data?.request);


    const friendRequestHandler = async ({ _id, accept }) => {

        dispatch(setIsNotification(false))

        try {
            const res = await acceptRequest({ requestId: _id, accept })

            if (res.data?.success) {
                console.log("Use Socket Here !");
                toast.success(res.data.message)
                
            } else toast.error(res.data?.error || "Something went wrong !")
            
        } catch (error) {
            toast.error("Something went wrong !")
            console.log("acceptRequest error", error);
        }

    }

    const closeHandler = () => dispatch(setIsNotification(false))

    useErrors([{ error, isError }])

    return (
        <Dialog open={isNotification} onClose={closeHandler}>
            <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
                <DialogTitle>Notification</DialogTitle>
                {
                    isLoading ? <Skeleton /> : <>
                        {
                            data?.request?.length > 0 ? (
                                data?.request?.map(({ _id, sender }) => (
                                    <NotificationItem
                                        key={_id}
                                        _id={_id}
                                        sender={sender}
                                        handler={friendRequestHandler}
                                    />
                                ))
                            ) : (
                                <Typography>0 Notifications</Typography>)
                        }
                    </>
                }
            </Stack>
        </Dialog>
    )
}



const NotificationItem = memo(({ _id, sender, handler }) => {

    const { name, avatar } = sender;

    return (
        <ListItem>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>

                <Avatar src={avatar} />

                <Typography
                    variant='body1'
                    sx={{
                        flexGrow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%"
                    }}
                >
                    {`${name} sent you a friend request`}
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }}>
                    <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
                    <Button color='error' onClick={() => handler({ _id, accept: false })}>Reject</Button>
                </Stack>

            </Stack>
        </ListItem>
    )
})

export default Notifications