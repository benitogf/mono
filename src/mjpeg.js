import { Box, LinearProgress } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

const MJPEG = ({ url }) => {
    const fux = useRef()
    const timeoutRef = useRef()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        let _fux = null
        if (fux.current) {
            console.log("set ref", url)
            fux.current.src = url + '?' + Date.now()
            // fux.current.src = url
            _fux = fux.current
        }
        timeoutRef.current = setTimeout(() => {
            setLoading(false)
        }, 1500)
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            if (_fux) {
                _fux.src = ''
            }
        }
    }, [url])

    return <Box style={{
        display: 'flex',
        minWidth: 300
    }}>
        {loading && <LinearProgress style={{
            width: 100
        }} />}
        <img alt="preview" style={{
            height: 200,
            minWidth: 300,
            paddingRight: 25,
            opacity: loading ? 0 : 1,
        }} ref={fux} />
    </Box>
}

export default MJPEG