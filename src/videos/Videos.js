import React from 'react'
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import { useSubscribe } from '../api'
import Files from './Files'
import VideosList from './VideosList'

const Videos = () => {
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [videos, videosSocket] = useSubscribe('videos/*')

    const active =
        videosSocket &&
        videosSocket.readyState === WebSocket.OPEN

    if (!active || !videos) {
        return <LinearProgress />
    }

    return <>
        <AppBar position='static'>
            <Tabs
                value={0}
                variant={mobile ? 'fullWidth' : 'standard'}
                indicatorColor='secondary'
                textColor='inherit'
            >
                <Tab component={Link} to='/dashboard/videos' label='Videos' />
            </Tabs>
        </AppBar>
        <Paper square sx={{ height: '100%' }}>
            <Files />
            <VideosList videos={videos} />
        </Paper>
    </>
}

export default Videos
