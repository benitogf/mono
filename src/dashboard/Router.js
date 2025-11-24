import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import R404 from '../404'
import Home from '../home/Home'
import Settings from '../settings/Settings'

// Route configuration with metadata
const routesConfig = [
    { path: '/home', icon: HomeIcon, element: Home },
    { path: '/settings', icon: SettingsIcon, element: Settings },
]

// Helper to derive section name from path
const pathToSection = (path) => {
    // Remove leading slash and capitalize first letter
    const name = path.replace(/^\//, '')
    return name.charAt(0).toUpperCase() + name.slice(1)
}

// Helper to derive key from path
const pathToKey = (path) => {
    // Remove leading slash
    return path.replace(/^\//, '')
}

// Export routes with derived properties
export const routes = routesConfig.map(route => ({
    ...route,
    section: pathToSection(route.path),
    key: pathToKey(route.path)
}))

// Helper to get current section from pathname
export const getCurrentSection = (pathname) => {
    const pathParts = pathname.split('/')
    const currentPath = pathParts.length > 2 ? `/${pathParts[2]}` : null
    const route = routes.find(r => r.path === currentPath)
    return route ? route.section : 'Dashboard'
}

const Router = ({ active }) => {
    return <Routes>
        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
        {routes.map((route) => {
            const Component = route.element
            return (
                <Route 
                    key={route.key}
                    path={route.path} 
                    element={<Component active={active} />} 
                />
            )
        })}
        <Route path="*" element={<R404 />} />
    </Routes>
}

export default Router