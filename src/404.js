import React from 'react'
import SnackbarContent from '@mui/material/SnackbarContent'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { Link } from 'react-router-dom'

const notFound = () => (<Paper className="paper-container" elevation={1}>
    <SnackbarContent
        style={{
            backgroundColor: '#f1932c',
            maxWidth: 'unset'
        }}
        action={[
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                {...{ to: '/' }}
                component={Link}>
                <Icon>cancel</Icon>
            </IconButton>
        ]}
        message={(
            <Typography component="p" style={{ color: 'white' }}>
                <Icon style={{ verticalAlign: "bottom", color: "#f0cf81" }}>warning</Icon> Could not find this path {window.location.pathname}.
            </Typography>
        )}
    /></Paper>)

export default notFound