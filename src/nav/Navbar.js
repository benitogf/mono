import React from 'react'
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import { styled } from '@mui/material/styles'

const drawerWidth = 240

const StyledAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: !open ? theme.zIndex.drawer + 1 : 'inherit',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    boxShadow: 'none',
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

const Navbar = ({
    isAuthenticated,
    active = true,
    menuOpen,
    onMenuOpen,
    onSettingsClick
}) => {
    const filePath = window.location.protocol === 'file:' ? window.location.pathname.replace('index.html', '') : ''

    return (
        <StyledAppBar position='fixed' open={isAuthenticated && menuOpen}>
            <Toolbar>
                {isAuthenticated ? (
                    // Authenticated: Show menu button and logo
                    <>
                        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 40,
                                    height: 40,
                                    marginLeft: '-11px',
                                    marginRight: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        opacity: active && !menuOpen ? 1 : 0,
                                        transition: 'opacity 0.3s ease-in-out',
                                        pointerEvents: active && !menuOpen ? 'auto' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <IconButton
                                        sx={{
                                            color: 'white',
                                        }}
                                        onClick={onMenuOpen}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                </Box>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        opacity: active && !menuOpen ? 0 : 1,
                                        transition: 'opacity 0.3s ease-in-out',
                                        pointerEvents: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Skeleton
                                        variant='circular'
                                        width={40}
                                        height={40}
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.13)',
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box
                                component='img'
                                alt='logo'
                                src={filePath + '/logo.png'}
                                sx={{
                                    height: 20,
                                    marginLeft: menuOpen ? '-56px' : 0,
                                    marginRight: 2,
                                    transition: 'margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        opacity: active ? 1 : 0,
                                        transition: 'opacity 0.3s ease-in-out',
                                        pointerEvents: active ? 'auto' : 'none',
                                    }}
                                >
                                    <IconButton
                                        sx={{
                                            color: 'white',
                                        }}
                                        onClick={onSettingsClick}
                                    >
                                        <SettingsIcon />
                                    </IconButton>
                                </Box>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        opacity: active ? 0 : 1,
                                        transition: 'opacity 0.3s ease-in-out',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <Skeleton
                                        variant="circular"
                                        width={40}
                                        height={40}
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.13)'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </>
                ) : (
                    // Unauthenticated: Show logo and settings button
                    <>
                        <Link to={'/'} style={{ textDecoration: 'none' }}>
                            <Typography
                                variant='h6'
                                component='div'
                                sx={{
                                    flexGrow: 1,
                                    fontStyle: 'italic',
                                    fontWeight: '100',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                <Box
                                    component='img'
                                    alt='logo'
                                    src={filePath + '/logo.png'}
                                    sx={{
                                        height: 20,
                                        verticalAlign: 'middle',
                                        marginRight: '34px',
                                        marginLeft: '1px',
                                    }}
                                />
                            </Typography>
                        </Link>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                            sx={{ color: 'white' }}
                            onClick={onSettingsClick}
                        >
                            <SettingsIcon />
                        </IconButton>
                    </>
                )}
            </Toolbar>
        </StyledAppBar>
    )
}

export default Navbar
