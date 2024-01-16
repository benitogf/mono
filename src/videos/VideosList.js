import React, { memo, useState } from 'react'
import 'react-perfect-scrollbar/dist/css/styles.css'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { unpublish } from '../api'
import AlertDialog from '../components/AlertDialog'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

const VideoList = memo(({ videos }) => {
    const theme = useTheme()

    const [searchTerm, setSearchTerm] = useState('')
    const [videoPreview, setVideoPreview] = useState({})

    // alert dialog state
    const [alertDialogState, setAlertDialogState] = useState({
        show: false,
        type: '',
        message: '',
        error: false,
        confirm: () => { },
    })

    const filteredVideos = videos.filter((video) => video.data.name.indexOf(searchTerm) !== -1)

    const togglePreview = (index, e) => {
        setVideoPreview({
            [index]: !videoPreview[index],
        })
    }

    const onDeleteClick = async (video) => {
        try {
            await unpublish('videos/' + video.index)
            setAlertDialogState((prev) => ({
                ...prev,
                show: false,
            }))
        } catch (e) {
            console.warn('error', e)
            setAlertDialogState({
                show: true,
                type: 'error',
                message: 'Unable to delete video. Please try again.',
                error: true,
                confirm: () => { },
            })
        }
    }

    return (
        <>
            <AlertDialog state={alertDialogState} setState={setAlertDialogState} />

            <Box height='100%' display='flex' flexDirection='column' gap={0}>
                <Toolbar
                    sx={{
                        margin: '.35rem 1rem',
                        padding: '0px 14px !important',
                        minHeight: '44px !important',
                        display: 'flex',
                        gap: '.5rem',
                        border: theme.palette.mode === 'light' ? '2px solid #edede9' : '2px solid #616161',
                        borderRadius: '10px',
                    }}
                >
                    <SearchIcon />
                    <InputBase
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        inputProps={{ 'aria-label': 'search' }}
                        placeholder='Search'
                        fullWidth
                    />
                </Toolbar>

                <List
                    sx={{
                        display: 'flex',
                        flex: '1',
                        flexDirection: 'column',
                        padding: 0,
                    }}
                >
                    {videos.length === 0 && (
                        <Box height='100%' display='flex' alignItems='center' justifyContent='center'>
                            <Typography>No video(s) found.</Typography>
                        </Box>
                    )}
                    {videos.length > 1 && filteredVideos.length === 0 && (
                        <Box height='100%' display='flex' alignItems='center' justifyContent='center'>
                            <Typography>No video(s) matching with "{searchTerm}".</Typography>
                        </Box>
                    )}
                    <AutoSizer>
                        {({ height, width }) => {
                            return <FixedSizeList height={height} width={width} itemCount={filteredVideos.length} itemSize={120}>
                                {({ index, style }) => {
                                    const video = filteredVideos[index]
                                    return <Box key={index}>
                                        <ListItem
                                            key={video.data.id}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                gap: '1rem',
                                                cursor: 'pointer',
                                            }}
                                            onClick={(e) => togglePreview(video.index, e)}
                                        >
                                            <Box display='flex' alignItems='center' gap='.5rem'>
                                                <Typography>{video.data.name}</Typography>
                                                {!videoPreview[video.index] && <img alt={video.data.name + '-thumbnail'} style={{ height: '40px' }} src={video.data.thumbnail}></img>}
                                            </Box>

                                            <Box>
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        togglePreview(video.index, e)
                                                    }}
                                                >
                                                    {videoPreview[video.index] ? (
                                                        <VisibilityIcon />
                                                    ) : (
                                                        <VisibilityOutlinedIcon />
                                                    )}
                                                </IconButton>

                                                <IconButton
                                                    onClick={() => {
                                                        setAlertDialogState({
                                                            show: true,
                                                            type: 'confirmation',
                                                            message: 'Are you sure you want to delete this video?',
                                                            error: false,
                                                            confirm: () => {
                                                                onDeleteClick(video)
                                                            },
                                                        })
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </ListItem>

                                        {!!videoPreview[video.index] && (
                                            <ListItem
                                                sx={{
                                                    justifyContent: 'center',
                                                    background: theme.palette.mode === 'light' ? '#fafafa' : '#616161',
                                                }}
                                            >
                                                <video
                                                    autoPlay
                                                    type='video/mp4'
                                                    src={video.data.url}
                                                    style={{ padding: 10, maxWidth: '50vh' }}
                                                    controls
                                                    preload='auto'
                                                />
                                            </ListItem>
                                        )}

                                        <Divider />
                                    </Box>
                                }}
                            </FixedSizeList>
                        }}
                    </AutoSizer>
                </List>
            </Box>
        </>
    )
})

export default VideoList
