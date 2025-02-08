import React, { useState, memo, useEffect, lazy, Suspense } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Done as DoneIcon, Delete as DeleteIcon, KeyboardBackspace as KeyBoardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { Link } from "../components/styles/StyledComp"
import AvatarCard from '../components/shared/AvatarCard'
import { sampleChats, sampleUsers } from '../constants/sampleData'
import UserItem from '../components/shared/UserItem'
import { bgGradient } from '../constants/color'
import { useAddGroupMembersMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import { LayoutLoader } from '../components/layout/Loaders'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../redux/reducers/misc'

const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'))

const Groups = () => {

  const dispatch = useDispatch()
  const { isAddMember } = useSelector(state => state.misc)

  const [isMobileMenuOpnen, setIsMobileMenuOpnen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("")
  const [members, setMembers] = useState([])
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const navigate = useNavigate()

  const chatId = useSearchParams()[0].get("group")

  const myGroups = useMyGroupsQuery("");
  const groupDetails = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId })
  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation)
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation)
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)
  // console.log(groupDetails.data);
  console.log(groupDetails);

  const error = [
    { isError: myGroups.isError, error: myGroups.error, },
    { isError: groupDetails.isError, error: groupDetails.error, },
  ];

  useErrors(error)

  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat.name)
      setGroupNameUpdatedValue(groupDetails.data.chat.name)
      setMembers(groupDetails.data.chat.members)
    }
    return () => {
      setGroupName("")
      setGroupNameUpdatedValue("")
      setMembers([])
      setIsEdit(false)
    }
  }, [groupDetails.data])

  const handleMobile = () => {
    setIsMobileMenuOpnen((prev) => !prev)
  }

  const handleMobileClose = () => {
    setIsMobileMenuOpnen(false)
  }

  const updateGroupName = () => {
    setIsEdit(false)
    updateGroup("Updating Group Name", { chatId, name: groupNameUpdatedValue })
    console.log("groupNameUpdatedValue :", groupNameUpdatedValue);
  }

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true)
  }

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false)
  }

  const deleteHandler = () => {
    deleteGroup("Deleting Group", chatId);
    closeConfirmDeleteHandler()
    navigate('/groups')
  }

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true))
  }

  // const openAddMemberHandler = () => {
  //   setIsAddMemberDialogOpen(prev => !prev);
  //   console.log("openAddMemberHandler clicked");
  // };

  // const closeAddMemberHandler = () => {
  //   setIsAddMemberDialogOpen(false);
  // };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Members", { chatId, userId })
  }


  const IconBtns = (<>
    <Tooltip title="back">

      <Box
        sx={{
          display: {
            xs: "block", sm: "none", position: "fixed", right: "1rem", top: "1rem",
          }
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          color: "white",
          bgcolor: "rgba(0,0,0,0.8)",
          ":hover": { bgcolor: "rgba(0,0,0,0.7)" }
        }}
      >
        <KeyBoardBackspaceIcon />
      </IconButton>

    </Tooltip>
  </>)


  const GroupName = (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
      {
        isEdit ? (<>
          <TextField value={groupNameUpdatedValue} onChange={e => setGroupNameUpdatedValue(e.target.value)} />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>
        </>) : (<>
          <Typography variant='h4'>{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}>
            <EditIcon />
          </IconButton>
        </>)
      }
    </Stack>
  )


  const ButtonGroup = (
    <Stack
      direction={{ sm: "row", xs: "column-reverse" }}
      spacing={"1rem"}
      p={{ xs: "0", sm: "1rem", md: "1rem 4rem" }}
    >
      <Button size="large" color='error' variant='outlined' startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler} > Delete Group </Button>
      <Button size="large" variant='contained' startIcon={<AddIcon />} onClick={openAddMemberHandler} > Add Members </Button>
    </Stack>
  )


  useEffect(() => {
    setGroupName(`Group Name ${groupDetails?.data?.chat?.name}`)
    setGroupNameUpdatedValue(`Group Name ${chatId}`)
    console.log("For Group anme:::>>>", myGroups?.data?.Groups);


    return () => {
      setIsEdit(false)
      setGroupName("")
      setGroupNameUpdatedValue("")
    }
  }, [chatId])


  return myGroups.isLoading ? <LayoutLoader /> : (
    <Grid container height={"100vh"}>
      <Grid item sx={{ display: { xs: "none", sm: "block", }, }} sm={4}>
        <GroupList myGroups={myGroups?.data?.Groups} chatId={chatId} />
      </Grid>

      <Grid item xs={12} sm={8} sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "1rem 3rem", }}>
        {IconBtns}
        {
          groupName && (<>
            {GroupName}
            <Typography margin={"2rem"} alignSelf={"flex-start"} variant='body1'>Members</Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{ sm: "1rem", xs: "0", md: "1rem, 4rem", }}
              spacing={"2rem"}
              // bgcolor={"bisque"}
              height={"50vh"}
              overflow={"auto"}
            >
              {/* members */}
              {isLoadingRemoveMember ? (<CircularProgress />) : members.map((i) => (
                <UserItem
                  key={i._id}
                  user={i}
                  isAdded
                  handler={removeMemberHandler}
                  styling={{ padding: "1rem 2rem", borderRadius: "1rem", boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)" }} />
              ))}
            </Stack>

            {ButtonGroup}
          </>)
        }
      </Grid>

      {
        isAddMember && (<Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>)
      }

      {
        confirmDeleteDialog && (<Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler} />
        </Suspense>)
      }

      <Drawer sx={{ display: { xs: "block", sm: "none", } }} open={isMobileMenuOpnen} onClose={handleMobileClose}>
        <GroupList myGroups={myGroups?.data?.Groups} chatId={chatId} w={"50vw"} />
      </Drawer>
    </Grid>
  )
}


const GroupList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack width={w} sx={{ height: "100vh", overflow: "auto", backgroundImage: bgGradient }}>
    {
      myGroups.length > 0 ? (myGroups.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id} />)
      ) : (
        <Typography textAlign={"center"} padding={"1rem"}>
          No Groups
        </Typography>)
    }
  </Stack>
)


const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return <Link to={`?group=${_id}`} onClick={(e) => {
    if (chatId === _id) e.preventDefault()
  }}>
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
  </Link>

})

export default Groups