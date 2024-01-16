import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material'

const navStyles = makeStyles((theme) => ({
    root: {
        boxShadow: 'none',
        zIndex: (props) => (props.mobile ? 1301 : ''),
    },
    link: {
        // color: theme.palette.text.primary,
        textDecoration: 'none',
    },
    logo: {
        height: 20,
        verticalAlign: 'middle',
        marginRight: 34,
        marginLeft: 1,
        filter: (props) => (props.lights ? 'brightness(0.5)' : 'none'),
    },
}))

const Nav = () => {
    const theme = useTheme()
    const location = useLocation()
    const mobile = theme.breakpoints.down('xs')
    const styles = navStyles({
        mobile,
        location,
    })

    const filePath = window.location.protocol === 'file:' ? window.location.pathname.replace('index.html', '') : ''
    return (
        <AppBar component='nav' className={styles.root}>
            <Toolbar>
                <Link to={'/'} className={styles.link}>
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
                        <img alt='logo' className={styles.logo} src={filePath + '/logo.png'}></img>
                    </Typography>
                </Link>
            </Toolbar>
        </AppBar>
    )
}

export default Nav
