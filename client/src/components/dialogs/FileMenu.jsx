// //
import { Menu } from '@mui/material'
import React from 'react'

const FileMenu = ({ anchorEl }) => {
    return (
        <Menu open={false} anchorEl={anchorEl}>
            <div style={{ width: "10rem" }}>
                FileMenu
            </div>
        </Menu>
    )
}

export default FileMenu