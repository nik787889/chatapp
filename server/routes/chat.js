// //
import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { newGroupChat, getMyChats, getMyGroup, addMembers, removeMembers, leaveGroup, sendAttachments, getChatDetailes, renameGroup, deleteChat, getMessages } from '../controllers/chat.js';
import { attachmentsMulter } from '../middlewares/multer.js';
import { addMemberValidator, leaveGroupValidator, newGroupChatValidator, removeMemberValidator, sendAttachmentsValidator, chatIdValidator, renameValidator, validateHandler } from '../lib/validators.js';

const app = express.Router()


app.use(isAuthenticated)

app.post('/new', newGroupChatValidator(), validateHandler, newGroupChat)
app.get('/my', getMyChats)
app.get('/my/groups', getMyGroup)
app.put('/addmembers', addMemberValidator(), validateHandler, addMembers)
app.put('/removemembers', removeMemberValidator(), validateHandler, removeMembers)
app.delete('/leave/:id', leaveGroupValidator(), validateHandler, leaveGroup)
app.post('/message', attachmentsMulter, sendAttachmentsValidator(), validateHandler, sendAttachments)
app.get('/message/:id', chatIdValidator(), validateHandler, getMessages)
app.route('/:id')
    .get(chatIdValidator(), validateHandler, getChatDetailes)
    .put(renameValidator(), validateHandler, renameGroup)
    .delete(chatIdValidator(), validateHandler, deleteChat)



export default app;