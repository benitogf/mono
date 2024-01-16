import { useState, useLayoutEffect } from 'react'

function debounce(fn, ms) {
    let timer
    return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            fn.apply(this, arguments)
        }, ms)
    }
}

// deadline in seconds to change the state to idle
const useIdle = ({ deadline }) => {
    const [idle, setIdle] = useState(false)
    useLayoutEffect(() => {
        let timeout
        clearTimeout(timeout)
        function updateIdle() {
            clearTimeout(timeout)
            setIdle(false)
            timeout = setTimeout(() => {
                setIdle(true)
            }, deadline)
        }
        const debouncedEventHandler = debounce(() => updateIdle())
        window.addEventListener('resize', debouncedEventHandler)
        window.addEventListener('mousemove', debouncedEventHandler)
        window.addEventListener('scroll', debouncedEventHandler)
        window.addEventListener('mousemove', debouncedEventHandler)
        window.addEventListener('keydown', debouncedEventHandler)
        window.addEventListener('mousedown', debouncedEventHandler)
        window.addEventListener('touchstart', debouncedEventHandler)

        setIdle(false)
        return () => {
            if (timeout) {
                clearTimeout(timeout)
            }
            window.removeEventListener('resize', debouncedEventHandler)
            window.removeEventListener('mousemove', debouncedEventHandler)
            window.removeEventListener('scroll', debouncedEventHandler)
            window.removeEventListener('mousemove', debouncedEventHandler)
            window.removeEventListener('keydown', debouncedEventHandler)
            window.removeEventListener('mousedown', debouncedEventHandler)
            window.removeEventListener('touchstart', debouncedEventHandler)
        }
    }, [deadline])
    return idle
}

export default useIdle