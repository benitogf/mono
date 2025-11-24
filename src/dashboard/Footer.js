import React from 'react'
import moment from 'moment'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material/styles'

const Footer = ({ time, active }) => {
    const theme = useTheme()
    
    const formatTime = (timestamp) => {
        const m = moment.unix(timestamp / 1000000000)
        return {
            time: m.format('h:mm:ss A'),
            date: m.format('dddd, MMMM Do, YYYY')
        }
    }

    const { time: formattedTime, date: formattedDate } = time ? formatTime(time) : { time: '', date: '' }

    return (
        <Box
            component='footer'
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: 'transparent',
                backdropFilter: 'blur(8px)',
                borderTop: `1px solid ${theme.palette.divider}`,
                zIndex: theme.zIndex.appBar - 1,
                padding: '0 16px',
            }}
        >
            <Box
                sx={{
                    opacity: (active && time) ? 1 : 0.7,
                    transition: 'opacity 0.3s ease-in-out',
                }}
            >
                {active && time ? (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-end',
                        gap: 0.25
                    }}>
                        <Typography 
                            variant='body2' 
                            sx={{ 
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                lineHeight: 1.2,
                                color: theme.palette.text.primary
                            }}
                        >
                            {formattedTime}
                        </Typography>
                        <Typography 
                            variant='caption' 
                            sx={{ 
                                fontSize: '0.7rem',
                                opacity: 0.7,
                                lineHeight: 1,
                                color: theme.palette.text.secondary
                            }}
                        >
                            {formattedDate}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-end',
                        gap: 0.25
                    }}>
                        <Skeleton variant="text" width={80} height={20} />
                        <Skeleton variant="text" width={180} height={14} />
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default Footer
