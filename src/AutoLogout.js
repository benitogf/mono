import { useEffect, useState } from "react"

const useLogout = (startTime, logedIn) => {
  let timer = startTime
  const [status, setStatus] = useState('in')
  useEffect(() => {
    const myInterval = setInterval(() => {
      if (logedIn) {
        if (timer > 0) {
          // Assignments to the 'timer' variable from inside React Hook useEffect will be lost after each render.
          // we want this behavior so disable the warning
          timer = timer - 1 // eslint-disable-line react-hooks/exhaustive-deps
        } else {
          if (timer === 0) {
            setStatus('out')
          }
        }
      }
    }, 1000)
    const resetTimeout = () => {
      timer = startTime
    }
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress"
    ]
    for (let i in events) {
      window.addEventListener(events[i], resetTimeout)
    }
    return () => {
      clearInterval(myInterval)
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout)
      }
    }
  })
  return status
}

export default useLogout