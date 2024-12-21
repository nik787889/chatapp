// //

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewGroup: false,
    isAddMember: false,
    isNotification: false,
    isMobile: false,
    isSearch: false,
    isFileMenue: false,
    isDeleteMenu: false,
    uploadingLoader: false,
    selectedDeleteChat: {
        chatId: "",
        groupChat: false,
    },

}

const miscSlice = createSlice({

    name: "misc",
    initialState,
    reducers: {

        setIsNewGroup: (state, action) => {
            state.isNewGroup = action.payload
        },
        setIsAddMember: (state, action) => {
            state.isAddMember = action.payload
        },
        setIsNotification: (state, action) => {
            state.isNotification = action.payload
        },
        setIsMobile: (state, action) => {
            state.isMobile = action.payload
        },
        setIsSearch: (state, action) => {
            state.isSearch = action.payload
        },
        setIsFileMenue: (state, action) => {
            state.isFileMenue = action.payload
        },
        setIsDeleteMenu: (state, action) => {
            state.isDeleteMenu = action.payload
        },
        setUploadingLoader: (state, action) => {
            state.uploadingLoader = action.payload
        },
        setSelectedDeleteChat: (state, action) => {
            state.selectedDeleteChat = action.payload
        },

    },

})

export default miscSlice;
export const {
    setIsNewGroup, setIsAddMember, setIsNotification, setIsMobile, setIsSearch, setIsFileMenue, setIsDeleteMenu, setUploadingLoader, setSelectedDeleteChat
} = miscSlice.actions;