import React, { useEffect, useState } from 'react'
import { Box, Container, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Person as PersonIcon } from '@mui/icons-material'
import moment from 'moment'
import AdminLayout from '../../components/layout/AdminLayout'
import { CurveButton, SearchField } from '../../components/styles/StyledComp'
import { DoughnutChart, LineChart } from '../../components/specific/Chart'
import { useFetchData } from '6pp'
import { server } from '../../constants/config'
import { LayoutLoader } from '../../components/layout/Loaders'
import { useErrors } from '../../hooks/hook'

const Dashboard = () => {

    const { loading, data, error } = useFetchData(`${server}/api/v1/admin/stats`, { credentials: "include" }, "dashboard-stats")
    console.log(data);

    const { stats } = data || {}

    useErrors([{ isError: error, error: useErrors }])

    const Appbar = (
        <Paper
            elevation={3}
            sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "1rem" }}
        >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                <AdminPanelSettingsIcon sx={{ fontSize: '3rem' }} />
                <SearchField />
                <CurveButton>Search</CurveButton>
                <Box flexGrow={1} />
                <Typography sx={{ display: { xs: "none", lg: "block" } }}>{moment().format("MMMM Do YYYY")}</Typography>
            </Stack>
        </Paper>
    )


    const Widgets = (<Stack direction={{ xs: "column", sm: "row" }} justifyContent={"space-between"} alignItems={"center"} marginTop={"4rem"} marginBottom={"2rem"}>
        <Widget title={"Users"} value={stats?.usersCount} Icon={<PersonIcon />} />
        <Widget title={"Charts"} value={stats?.totalChatsCount} Icon={<GroupIcon />} />
        <Widget title={"Messages"} value={stats?.messagesCount} Icon={<MessageIcon />} />
    </Stack>)

    return (
        <AdminLayout>
            {loading ? (<Skeleton height={"100vh"} />) : (

                <Container component={"main"}>
                    {Appbar}

                    <Stack flexWrap={"wrap"} direction={{ xs: "column", lg: "row" }} alignItems={{ xs: "center", lg: "stretch" }} justifyContent={"center"} sx={{ gap: "2rem" }}>
                        <Paper
                            elevation={3}
                            sx={{
                                width: "100%", maxWidth: "45rem", padding: "2rem 3.5rem", borderRadius: "1rem",
                            }}
                        >
                            <Typography margin={"2rem 0"} variant='h4'>Last Messages <LineChart value={stats?.messagesChart || []} /></Typography>
                        </Paper>

                        <Paper
                            elevation={3}
                            sx={{
                                display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "100%", maxWidth: "25rem", width: { xs: "100%", sm: "50%" }, padding: "1rem", borderRadius: "1rem",
                            }}
                        >
                            <DoughnutChart labels={["single chats", "group chats"]} value={[stats?.totalChatsCount - stats?.groupsCount || 0, stats?.groupsCount || 0]} />
                            <Stack position={"absolute"} direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"0.5rem"} width={"100%"} height={"100%"}>
                                <GroupIcon /> <Typography>Vs</Typography> <PersonIcon />
                            </Stack>
                        </Paper>
                    </Stack>

                    {Widgets}
                </Container>

            )}

        </AdminLayout>
    )
}



const Widget = ({ title, value, Icon }) => (
    <Paper elevation={3} sx={{ width: "20rem", margin: "2rem 0", padding: "2rem", borderRadius: "1.5rem" }}>
        <Stack alignItems={"center"} spacing={"1rem"}>
            <Typography
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "5rem", width: "5rem", color: "rgba(0,0,0,0.7)", border: "5px solid rgba(0,0,0,0.9)", borderRadius: "50%", }}
            >
                {value}
            </Typography>
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                {Icon}
                <Typography>{title}</Typography>
            </Stack>
        </Stack>
    </Paper>
)

export default Dashboard