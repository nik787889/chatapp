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
        setNewMessagesAlert: (state) => {
            const index = state.newMessagesAlert.findIndex((item) => item.chatId === action.payload.chatId)
        },
    },

})

export default chatSlice;
export const { incrementNotification, resetNotification, setNewMessagesAlert } = chatSlice.actions;