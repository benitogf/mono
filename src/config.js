export const env = process.env.NODE_ENV
const isFileProtocol = window.location.protocol === 'file:'
export const domain = isFileProtocol ? 'localhost:8888' : window.location.hostname + ':8888'
export const ssl = false
export const autoLogoutTime = 4500