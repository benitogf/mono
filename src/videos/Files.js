import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'

import { upload, usePublish } from '../api'
import AlertDialog from '../components/AlertDialog'


const loadVideoMeta = file => new Promise((resolve, reject) => {
    try {
        let video = document.createElement('video')
        video.preload = 'metadata'

        video.onloadedmetadata = function () {
            resolve(video)
        }

        video.onerror = function () {
            reject("Invalid video. Please select a video file.")
        }

        video.src = window.URL.createObjectURL(file)
    } catch (e) {
        reject(e)
    }
})

const generateVideoThumbnail = file => new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const video = document.createElement("video")

    // this is important
    video.autoplay = true
    video.muted = true
    video.src = URL.createObjectURL(file)

    video.onloadeddata = () => {
        let ctx = canvas.getContext("2d")

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        video.pause()
        return resolve(canvas.toDataURL("image/png"))
    }
})

const Files = ({ authorize }) => {
    const [isLoading, setIsLoading] = useState(false)

    // alert dialog state
    const [alertDialogState, setAlertDialogState] = useState({
        show: false,
        type: '',
        message: '',
        error: false,
        confirm: () => { },
    })

    const publish = usePublish('videos/*', authorize)

    const onFileChange = async (e) => {
        setIsLoading(true)
        console.log('file changed', e.target.files[0].type)

        if (!e.target || e.target.files.lenght < 1) {
            setAlertDialogState({
                show: true,
                type: 'error',
                message: 'There was an error processing your video, please try again.',
                error: true,
                confirm: () => { },
            })
            setIsLoading(false)
            return
        }

        const newFile = e.target.files[0]
        if (newFile.type !== 'video/mp4') {
            setAlertDialogState({
                show: true,
                type: 'reminder',
                message: 'Only .mp4 format video file is allowed.',
                error: false,
                confirm: () => { },
            })
            setIsLoading(false)
            return
        }

        console.log('file changed', e.target.files[0])

        try {
            const metadata = await loadVideoMeta(e.target.files[0])
            const thumbnail = await generateVideoThumbnail(e.target.files[0])
            const video = await upload(newFile, newFile.name, newFile.type)
            console.log('upload done', video)
            await publish({
                name: newFile.name,
                type: newFile.type,
                url: video.replace('/files/', '/uploads/'),
                id: video.split('files/')[1],
                duration: metadata.duration,
                thumbnail: thumbnail
            })
        } catch (e) {
            console.warn('we had an issue uploading the file', e)
            setAlertDialogState({
                show: true,
                type: 'error',
                message: 'Failed to upload video, please try again.',
                error: false,
                confirm: () => { },
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <LinearProgress />
    }

    return (
        <>
            <AlertDialog state={alertDialogState} setState={setAlertDialogState} />

            <Box sx={{ padding: '1rem' }}>
                <Button variant='contained' component='label' sx={{ display: 'flex', background: '#4dabf5' }}>
                    Upload Video
                    <input onChange={onFileChange} type='file' hidden />
                </Button>
            </Box>
        </>
    )
}
export default Files
