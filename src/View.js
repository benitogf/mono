const View = (menuOpen, theme) => ({
    // bgcolor: 'background.default',
    color: 'text.primary',
    // flexGrow: 1,
    p: 0,
    // pb: '120px',
    // marginLeft: menuOpen ? 30 : 7,
    // marginTop: 7,
    // [theme.breakpoints.up('md')]: {
    //     marginTop: 8,
    // },
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    })
})

export default View