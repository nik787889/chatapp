import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import ProtectRoute from './components/auth/ProtectRoute'
import { LayoutLoader } from './components/layout/Loaders'
import { server } from './constants/config'
import { userExists, userNotExists } from './redux/reducers/auth'
import { SocketProvider } from './socket'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Groups = lazy(() => import('./pages/Groups'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const ChatManagement = lazy(() => import('./pages/admin/ChatManagement'))
const MessageManagement = lazy(() => import('./pages/admin/MessageManagement'))
const NotFound = lazy(() => import('./pages/NotFound'))


const App = () => {

  const { user, loader } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    axios.get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data)))
      .catch((err) => dispatch(userNotExists()))
  }, [dispatch])


  return loader ? < LayoutLoader /> : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          {/* Access the socket only in following three routes */}
          <Route element={<SocketProvider><ProtectRoute user={user} /></SocketProvider>}>
            <Route path='/' element={<Home />} />
            <Route path='/chat/:chatId' element={<Chat />} />
            <Route path='/groups' element={<Groups />} />
          </Route>

          <Route path='/login' element={
            <ProtectRoute user={!user} redirect='/'>
              <Login />
            </ProtectRoute>
          } />

          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/users' element={<UserManagement />} />
          <Route path='/admin/chats' element={<ChatManagement />} />
          <Route path='/admin/messages' element={<MessageManagement />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position='bottom-center' />
    </BrowserRouter>
  )
}

export default App
