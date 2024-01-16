import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Settings from './Settings'
import R404 from '../404'
import Videos from '../videos/Videos'

const Router = ({ dispatch }) => {
    return <Routes>
        <Route path="/" element={<Navigate to="/dashboard/videos" replace />} />
        <Route exact path="/settings" element={<Settings dispatch={dispatch} />} />
        <Route exact path="/videos" element={<Videos />} />
        <Route element={<R404 />} />
    </Routes>
}

export default Router