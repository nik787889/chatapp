import React from 'react'
import { Avatar, Stack, Typography } from '@mui/material'
import { Face as FaceIcon, AlternateEmail as UserNameIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material'
import moment from 'moment'
import { transformImage } from '../../lib/features'

const Profile = ({ user }) => {    

    const userInfo = {
        avatar: user?.data?.avatar?.url,
        name: user?.data?.name,
        username: user?.data?.username,
        bio: user?.data?.bio,
        joined: user?.data?.createdAt,
    }
    
    return (
        <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
            <Avatar src={transformImage(userInfo.avatar)} sx={{ width: 200, height: 200, objectFit: "contain", marginBottom: "1rem", border: "5px solid white" }} />
            <ProfileCard heading={"Bio"} text={userInfo.bio} />
            <ProfileCard heading={"Username"} text={userInfo.username} Icon={<UserNameIcon/>}/>
            <ProfileCard heading={"Name"} text={userInfo.name} Icon={<FaceIcon/>}/>
            <ProfileCard heading={"Joined"} text={moment(userInfo.joined).fromNow()} Icon={<CalendarIcon/>}/>
        </Stack>
    )
}


const ProfileCard = ({ text, Icon, heading }) => <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
>
{Icon && Icon}

<Stack>
    <Typography variant='body1'>{text}</Typography>
    <Typography variant='caption' color={"gray"}>{heading}</Typography>
</Stack>


</Stack>

export default Profile