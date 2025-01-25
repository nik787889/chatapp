// //

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notificationCount: 0,
    newMessagesAlert: [{ chatId: "", count: 0 },],
}

const chatSlice = createSlice({

    name: "chat",
    initialState,
    reducers: {
        incrementNotification: (state) => {
            state.notificationCount += 1
        },
        resetNotification: (state) => {
            state.notificationCount = 0
        },
        setNewMessagesAlert: (state, action) => {
            const index = state.newMessagesAlert.findIndex((item) => item.chatId === action.payload.chatId)
            if (index !== -1) {
                state.newMessagesAlert[index].count += 1
            } else {
                state.newMessagesAlert.push({ chatId: action.payload.chatId, count: 1 })
            }
        },
        removeNewMessagesAlert: (state, action) => {
            state.newMessagesAlert = state.newMessagesAlert.filter((item) => item.chatId !== action.payload)
        },
    },

})

export default chatSlice;
export const { incrementNotification, resetNotification, setNewMessagesAlert, removeNewMessagesAlert } = chatSlice.actions;