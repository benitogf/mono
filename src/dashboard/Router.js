import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Settings from './Settings'
import R404 from '../404'
import Home from './Home'

const Router = ({ dispatch }) => {
    return <Routes>
        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/settings" element={<Settings dispatch={dispatch} />} />
        <Route path="*" element={<R404 />} />
    </Routes>
}

export default Router