import React, { Suspense, lazy, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Menu as MenuIcon, Notifications as NotificationsIcon, Search as SearchIcon } from '@mui/icons-material'
import { orange } from '../../constants/color'
import { server } from '../../constants/config'
import toast from 'react-hot-toast'
import { userNotExists } from '../../redux/reducers/auth'
import { setIsMobile, setIsSearch, setIsNotification, setIsNewGroup } from '../../redux/reducers/misc'
import { resetNotification } from '../../redux/reducers/chat'


const SearchDialog = lazy(() => import('../specific/Search'))
const NotificationDialog = lazy(() => import('../specific/Notifications'))
const NewGroupDialog = lazy(() => import('../specific/NewGroup'))

const Header = () => {

    const dispatch = useDispatch()
    const { isSearch, isNotification, isNewGroup } = useSelector(state => state.misc)
    const { notificationCount } = useSelector(state => state.chat)

    const navigate = useNavigate()



    const handleMobile = () => dispatch(setIsMobile(true))

    const openSearch = () => dispatch(setIsSearch(true))


    const openNotification = () => {
        dispatch(setIsNotification(true))
        dispatch(resetNotification())
    }

    const openNewGroup = () => {
        dispatch(setIsNewGroup(true))
    }

    const navigateToGroup = () => {
        console.log("navigateToGroup Clicked !");
        navigate('/groups')
    }

    const handleLogout = async () => {
        try {
            const { data } = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true })
            dispatch(userNotExists())
            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong")
        }
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"}>
                <AppBar position="static" sx={{ bgcolor: orange }}>
                    <Toolbar>

                        <Typography variant='h6' sx={{ display: { xs: "none", sm: "block" }, }}>Chat App</Typography>

                        <Box sx={{ display: { xs: "block", sm: "none" }, }}>
                            <IconButton color='inherit' onClick={handleMobile}>
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />
                        <Box>
                            <IconBtn title={'Search'} icon={<SearchIcon />} onClick={openSearch} />
                            <IconBtn title={'New Group'} icon={<AddIcon />} onClick={openNewGroup} />
                            <IconBtn title={'Manage Group'} icon={<GroupIcon />} onClick={navigateToGroup} />
                            <IconBtn title={'Notification'} icon={<NotificationsIcon />} onClick={openNotification} value={notificationCount} />
                            <IconBtn title={'Logout'} icon={<LogoutIcon />} onClick={handleLogout} />
                        </Box>

                    </Toolbar>
                </AppBar>
            </Box>


            {isSearch && (
                <Suspense fallback={<Backdrop open />}>
                    <SearchDialog />
                </Suspense>
            )}
            {isNotification && (
                <Suspense fallback={<Backdrop open />}>
                    <NotificationDialog />
                </Suspense>
            )}
            {isNewGroup && (
                <Suspense fallback={<Backdrop open />}>
                    <NewGroupDialog />
                </Suspense>
            )}
        </>
    )
}


const IconBtn = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
                {/* {icon} */}
                {/* {value ? <Badge>{icon}</Badge> : icon} */}
                {value ? <Badge badgeContent={value} color='error'>{icon}</Badge> : icon}
            </IconButton>
        </Tooltip>
    )
}

export default Header