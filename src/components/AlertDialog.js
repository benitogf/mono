import { isUndefined, isArray } from 'lodash'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

export const defaultAlertDialogState = {
    show: false,
    type: '',
    message: '',
    loading: false,
    error: false,
    confirm: () => { },
}

export const handleClose = (state, setState) => {
    setState((prev) => ({
        ...prev,
        show: false,
    }))
}

export const startLoading = (state, setState) => {
    setState((prev) => ({
        ...prev,
        loading: true,
    }))
}

const AlertDialog = (props) => {
    const { state, setState } = props

    const handleConfirm = () => {
        if (!isUndefined(state.confirm) && typeof state.confirm === 'function') state.confirm()
    }

    const tryClose = (event, reason) => {
        if (state.loading && reason && reason === "backdropClick")
            return

        handleClose(state, setState)
    }

    return (
        <Dialog
            open={state.show}
            onClose={tryClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            fullWidth={true}
            sx={{ colorScheme: 'dark' }}
        >
            {!state.loading && <DialogTitle id='alert-dialog-title'>
                {state.type === 'confirmation' && <Typography sx={{ fontSize: '1.4rem' }}>Confirmation</Typography>}
                {state.type === 'reminder' && <Typography sx={{ fontSize: '1.4rem' }}>Reminder</Typography>}
                {state.type === 'success' && <Typography sx={{ fontSize: '1.4rem' }}>Note</Typography>}
                {state.type === 'error' && <Typography sx={{ fontSize: '1.4rem' }}>Error</Typography>}
                {state.type === 'custom' && <Typography sx={{ fontSize: '1.4rem' }}>{state.title}</Typography>}
            </DialogTitle>}

            <DialogContent>
                {state.loading && <LinearProgress />}
                {!state.loading && <DialogContentText id='alert-dialog-description' sx={{ maxHeight: '12rem', overflow: 'auto', fontSize: '1.2rem' }}>
                    {!isArray(state.message) && state.message}
                    {isArray(state.message) && (
                        <>
                            {state.message.map((item) => {
                                return <div>{item}</div>
                            })}
                        </>
                    )}
                </DialogContentText>}
            </DialogContent>

            {!state.loading && <DialogActions>
                {state.type === 'confirmation' && (
                    <>
                        <Button onClick={() => handleClose(state, setState)} size='large'>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} size='large'>
                            Confirm
                        </Button>
                    </>
                )}

                {(state.type === 'reminder' || state.type === 'success' || state.type === 'error') && (
                    <Button onClick={() => handleClose(state, setState)} size='large'>
                        OK
                    </Button>
                )}

                {state.type === 'custom' && <>{state.action}</>}
            </DialogActions>}
        </Dialog>
    )
}

export default AlertDialog
