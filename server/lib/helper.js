// //

import { userSocketIDs } from "../app.js"


export const getOtherMember = (members, userId) => members.find((m) => m._id.toString() !== userId.toString())


export const getSockets = (users = []) => users.map((user) => userSocketIDs.get(user.toString()))


export const getBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`