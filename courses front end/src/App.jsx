import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import LoginPage from './components/formPages/LoginPage'
import SignUpPage from './components/formPages/SignUpPage'
import { AccessProvider } from './AccessContext'
import HomePage from './components/homepage/HomePage'
import Courses from './components/CoursesPage/Courses'
import ResetPage from './components/formPages/ResetPage'
function App() {
  return (
    <BrowserRouter>
      <AccessProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/myCourses" element={<Courses />} />
          <Route path="/passwordReset" element={<ResetPage />} />
        </Routes>
      </AccessProvider>
    </BrowserRouter>
  )
}

export default App
