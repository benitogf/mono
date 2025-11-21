import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { api } from '../api'
import { makeStyles } from '@mui/styles'
import CircularProgress from '@mui/material/CircularProgress'
import SnackbarContent from '@mui/material/SnackbarContent'
import Typography from '@mui/material/Typography'
import Icon from '@mui/material/Icon'
import Card from '@mui/material/Card'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { validate, regex } from '../forms'

const signupStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    width: 'inherit',
    margin: 0,
    padding: 0,
    background: 'transparent'
  },
  card: {
    maxWidth: '400px',
    margin: '84px auto'
  },
  warning: {
    backgroundColor: '#f1932c',
    maxWidth: 'unset',
    marginBottom: 10
  },
  fail: {
    backgroundColor: 'brown',
    maxWidth: 'unset',
    marginBottom: 10
  },
  warningText: {
    color: 'white',
    fontSize: '0.96em',
    lineHeight: 2,
    fontWeight: 100
  },
  warningIcon: {
    verticalAlign: "bottom",
    color: "#f0cf81"
  },
  formButton: {
    marginTop: "20px"
  },
  formButtonWrapper: {
    position: 'relative',
  },
  formProgress: {
    position: 'absolute',
    top: '67%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}))

const Signup = ({ status, authorize }) => {
  const styles = signupStyles()

  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [fail, setFail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [available, setAvailable] = useState(null)

  const fields = {
    account: {
      error: () => !regex.username.test(account),
      message: 'username must have only alphanumeric characters and between 2 and 15 in total'
    },
    password: {
      error: () => password.length < 3 || password.length > 88,
      message: 'password must have between 3 and 88 characters'
    },
    name: {
      error: () => name.length === 0,
      message: 'name cannot be empty'
    },
    email: {
      error: () => !regex.email.test(email),
      message: 'invalid email address'
    },
    phone: {
      error: () => !regex.phone.test(phone),
      message: 'phone cannot contain special characters and character count must be between 6 and 15'
    }
  }

  const signup = async () => {
    setSubmitted(true)
    if (!validation.error && available) {
      setLoading(true)
      try {
        const response = await api.post('register', {
          json: {
            account,
            password,
            name,
            email,
            phone
          }
        }).json()
        window.localStorage.setItem('account', account)
        window.localStorage.setItem('token', response.token)
        window.localStorage.setItem('role', response.role)
        await authorize()
      } catch (e) {
        setFail(`Something went wrong (${e && e.response ? await e.response.text() : 'unable to connect to the server'})`)
        setLoading(false)
      }
    }
  }

  const availability = async (validation) => {
    if (!validation.errors.account && available === null) {
      try {
        await api.get('available?account=' + account)
        setAvailable(true)
        setFail('')
      } catch (e) {
        setAvailable(false)
        setFail('This username is already taken')
      }
    }
  }

  const validation = validate(fields)
  availability(validation)

  if (status === 'authorized') {
    return (<Navigate to="/dashboard" />)
  }

  return (<Grid className={styles.container} container spacing={4}>
    <Grid item sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Card className={styles.card}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar variant="dense">
            <Typography component="h4">
              Sign up
            </Typography>
          </Toolbar>
        </AppBar>
        <CardContent>
          {fail && !loading && (
            <SnackbarContent className={styles.fail}
              message={(
                <Typography component="p" className={styles.warningText}>
                  <Icon className={styles.warningIcon}>warning</Icon> {fail}
                </Typography>
              )}
            />
          )}
          {validation.error && submitted && (
            <SnackbarContent className={styles.warning}
              message={(Object.keys(validation.errors).map((error, key) => validation.errors[error] !== '' ? (
                <Typography key={key} component="p" className={styles.warningText}>
                  <Icon className={styles.warningIcon}>warning</Icon> {validation.errors[error]}
                </Typography>) : null)
              )}
            />
          )}
          <form onSubmit={(e) => { e.preventDefault() }}
            noValidate
            autoComplete="off">
            <TextField
              required
              autoFocus
              InputLabelProps={{ shrink: true }}
              margin="dense"
              id="account"
              label="username"
              type="text"
              fullWidth
              variant="outlined"
              onChange={(e) => {
                setAccount(e.target.value)
                if (e.target.value !== account && available !== null) {
                  setAvailable(null)
                }
              }}
              value={account}
              disabled={loading}
              error={(fields.account.error() && submitted) || available === false}
              InputProps={{
                endAdornment: !fields.account.error() && (
                  <InputAdornment position="end">
                    {(() => {
                      if (available === null) {
                        return (
                          <CircularProgress size={18} />
                        )
                      }
                      if (!available) {
                        return (
                          <Icon color="error" edge="end">report</Icon>
                        )
                      }
                      return (
                        <Icon color="primary" edge="end">check_circle</Icon>
                      )
                    })()}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              InputLabelProps={{ shrink: true }}
              margin="dense"
              id="password"
              label="password"
              type="password"
              fullWidth
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              disabled={loading}
              error={fields.password.error() && submitted}
            />
            <TextField
              required
              InputLabelProps={{ shrink: true }}
              margin="dense"
              id="name"
              label="fullname"
              type="text"
              fullWidth
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
              value={name}
              disabled={loading}
              error={fields.name.error() && submitted}
            />
            <TextField
              required
              InputLabelProps={{ shrink: true }}
              margin="dense"
              id="email"
              label="email"
              type="text"
              fullWidth
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={loading}
              error={fields.email.error() && submitted}
            />
            <TextField
              required
              InputLabelProps={{ shrink: true }}
              margin="dense"
              id="phone"
              label="phone"
              type="text"
              fullWidth
              variant="outlined"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              disabled={loading}
              error={fields.phone.error() && submitted}
            />
            <div className={styles.formButtonWrapper}>
              <Button className={styles.formButton}
                variant="contained"
                fullWidth
                type="submit"
                color="primary"
                disabled={loading}
                onClick={signup}>
                Sign up
              </Button>
              {loading && <CircularProgress size={24} className={styles.formProgress} />}
            </div>
          </form>
          <Button className={styles.formButton}
            variant="contained"
            fullWidth
            component={Link}
            {...{ to: '/login' }}
            disabled={loading}>
            Already have an account (log in)
          </Button>
        </CardContent>
      </Card>
    </Grid>
  </Grid>)
}

export default Signup