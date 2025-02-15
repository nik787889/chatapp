
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import { CameraAlt as CameraAltIcon } from '@mui/icons-material'
import { useFileHandler, useInputValidation } from '6pp'
import toast from 'react-hot-toast'
import { VisuallyHiddenInput } from '../components/styles/StyledComp'
import { usernameValidator } from '../utils/validators'
import { bgGradient } from '../constants/color'
import { server } from '../constants/config'
import { userExists } from '../redux/reducers/auth'

const Login = () => {

    const dispatch = useDispatch()

    const [isLogin, setIsLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const toggleLogin = () => setIsLogin((prev) => !prev)

    const name = useInputValidation("")
    const bio = useInputValidation("")
    const username = useInputValidation("", usernameValidator)
    const password = useInputValidation("")
    const avatar = useFileHandler("single", 1)


    const handleSignIn = async (e) => {
        e.preventDefault()
        const toastId = toast.loading("Loggin In...")
        setIsLoading(true)

        const userData = { username: username.value, password: password.value }

        const config = {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json', },
        }

        try {
            const { data } = await axios.post(`${server}/api/v1/user/login`, userData, config);
            // console.log("data:::>>>", data.user);

            dispatch(userExists(data.user))
            toast.success(data.message, { id: toastId })
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong", { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        const toastId = toast.loading("Signin Up...")
        setIsLoading(true)

        const formData = new FormData()
        formData.append('avatar', avatar.file)
        formData.append('name', name.value)
        formData.append('bio', bio.value)
        formData.append('username', username.value)
        formData.append('password', password.value)

        const config = {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data', },
        }

        try {
            const { data } = await axios.post(`${server}/api/v1/user/new`, formData, config)
            // console.log("data:::>>>", data.user);
            dispatch(userExists(data.user))
            toast.success(data.message, { id: toastId })
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong", { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <div style={{ backgroundImage: bgGradient, }}>
            <Container component={'main'} maxWidth='xs' sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Paper
                    elevation={3}
                    sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                    {isLogin ? (<>
                        <Typography variant="h5">Login</Typography>
                        <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleSignIn}>
                            <TextField fullWidth label="Username" margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler} />
                            {username.error && <Typography color='error' variant='caption'>{username.error}</Typography>}

                            <TextField fullWidth label="Password" margin='normal' variant='outlined' type='password' value={password.value} onChange={password.changeHandler} />
                            {password.error && <Typography color='error' variant='caption'>{password.error}</Typography>}

                            <Button fullWidth sx={{ marginTop: "1rem" }} variant='contained' color='primary' type='submit' disabled={isLoading}>Login</Button>
                            <Typography textAlign={'center'} m={'1rem'}>or</Typography>
                            <Button sx={{ marginTop: "1rem" }} onClick={toggleLogin}>don't have an account</Button>
                        </form>
                    </>) : (<>
                        <Typography variant="h5">Sign up</Typography>
                        <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleSignUp}>

                            <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                                <Avatar sx={{ width: "10rem", height: "10rem", objectFit: "contain" }} src={avatar.preview} />
                                <IconButton component="label" sx={{ position: "absolute", bottom: "0", right: "0", color: "white", bgcolor: "rgba(0,0,0,0.5)", ":hover": { bgcolor: "rgba(0,0,0,0.7)" } }}>
                                    <>
                                        <CameraAltIcon />
                                        <VisuallyHiddenInput type='file' onChange={avatar.changeHandler} />
                                    </>
                                </IconButton>
                            </Stack>
                            {avatar.error && <Typography m={"1rem auto"} width={"fit-content"} display={"block"} color='error' variant='caption'>{avatar.error}</Typography>}

                            <TextField fullWidth label="Name" margin='normal' variant='outlined' value={name.value} onChange={name.changeHandler} />
                            {name.error && <Typography color='error' variant='caption'>{name.error}</Typography>}

                            <TextField fullWidth label="Bio" margin='normal' variant='outlined' value={bio.value} onChange={bio.changeHandler} />
                            {bio.error && <Typography color='error' variant='caption'>{bio.error}</Typography>}

                            <TextField fullWidth label="Username" margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler} />
                            {username.error && <Typography color='error' variant='caption'>{username.error}</Typography>}

                            <TextField fullWidth label="Password" margin='normal' variant='outlined' type='password' value={password.value} onChange={password.changeHandler} />
                            {password.error && <Typography color='error' variant='caption'>{password.error}</Typography>}

                            <Button fullWidth sx={{ marginTop: "1rem" }} variant='contained' color='primary' type='submit' disabled={isLoading}>Sign up</Button>
                            <Typography textAlign={'center'} m={'1rem'}>or</Typography>
                            <Button sx={{ marginTop: "1rem" }} onClick={toggleLogin}>already signup</Button>
                        </form>
                    </>)}
                </Paper>
            </Container>
        </div>
    )
}

export default Login;
