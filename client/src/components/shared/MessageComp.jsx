// //
import { Box, Typography } from '@mui/material';
import React, { memo } from 'react'
import { lightBlue } from '../../constants/color';
import moment from 'moment';
import { fileFormate } from '../../lib/features';
import RenderAttachment from './RenderAttachment';
import { motion } from 'framer-motion'

const MessageComp = ({ message, user }) => {

    const { sender, content, attachments = [], createdAt } = message;
    const sameSender = sender?._id === user?.data?._id;
    const timeAgo = moment(createdAt).fromNow()

    return (
        <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            whileInView={{ opacity: 1, x: 0 }}

            style={{
                alignSelf: sameSender ? "flex-end" : "flex-start",
                width: "fit-content",
                padding: "0.5rem",
                backgroundColor: "white",
                color: "black",
                borderRadius: "5px"

            }}
        >
            {!sameSender && <Typography color={lightBlue} fontWeight={"600"}>{sender.name}</Typography>}

            {content && <Typography>{content}</Typography>}

            {
                attachments.length > 0 && attachments.map((atta, index) => {
                    const url = atta.url
                    const file = fileFormate(url)

                    return (
                        <Box key={index}>
                            <a href={url} target='_blank' download style={{ color: "black", }}>{RenderAttachment(file, url)}</a>
                        </Box>
                    )
                })
            }

            {<Typography variant='caption' color='text.secondary'>{timeAgo}</Typography>}

        </motion.div>
    )
}

export default memo(MessageComp)