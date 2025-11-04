import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'

function App() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('user') ? true : false
  )

  const handleLogin = (userData) => {
    sessionStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/feed" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/feed" replace />
            ) : (
              <Register onRegister={handleLogin} />
            )
          }
        />
        <Route
          path="/feed"
          element={
            isAuthenticated ? (
              <Feed />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/feed" : "/login"} replace />} />
      </Routes>
    </Router>
  )
}

export default App