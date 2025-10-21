import { useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TopBar from './components/topbar'
// import AboutPage from './pages/AboutPage'
// import DashboardPage from './pages/DashboardPage'
// import ContactPage from './pages/ContactPage'
import EventsPage from './pages/EventsPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <TopBar />
        <HomePage />
        <Routes>
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Events" element={<EventsPage />} />
        </Routes>
      </div>

    </>
  )
}

export default App
