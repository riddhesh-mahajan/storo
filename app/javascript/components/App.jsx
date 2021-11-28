import React from 'react'
import { Routes, Route, Link, BrowserRouter, HashRouter } from "react-router-dom";
import Home from '../components/home/Home'
import Login from '../components/login/Login'
import Signup from '../components/signup/Signup'
import Dashboard from '../components/dashboard/Dashboard'

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
      </HashRouter>
    )
}
