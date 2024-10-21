import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './App.css'
import MainLanding from './components/MainLanding'
import HelperProfile from './components/HelperProfile'
import CustomerProfile from './components/CustomerProfile'
import OwnerProfile from './components/OwnerProfile'
import PaymentPage from './components/PaymentPage'
import Login from './components/Login'
import ReviewPage from './components/ReviewPage'
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme();


function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data)
      navigate(`/${response.data.role}`)
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('token')
    }
    setLoading(false)
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    navigate(`/${userData.role}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <ThemeProvider theme={theme}>
    <div className='bg-slate-200 font-poppins w-full min-h-screen'>
      {user && (
        <nav className="bg-[#229799] p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="text-white font-bold">TipNex</span>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <MainLanding />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/helper"
          // element={user && user.role === 'staff' ? <HelperProfile user={user} /> : <Navigate to="/login" />}
          element={<HelperProfile user={{name: "Sample"}}/>}
        />
        <Route
          path="/customer"
          // element={user && user.role === 'customer' ? <CustomerProfile user={user} /> : <Navigate to="/login" />}
          element={<CustomerProfile  user={{name: "Sample"}} />}
        />
        <Route
          path="/owner"
          // element={user && user.role === 'store' ? <OwnerProfile user={user} /> : <Navigate to="/login" />}
          element={<OwnerProfile  user={{name: "Sample"}} />}
        />
        <Route
          path="/pay/:storeId"
          // element={user ? <PaymentPage user={user} /> : <Navigate to="/login" />}
          element={<PaymentPage user={user}/>}
        />
        <Route
          path="/review"
          // element={user ? <PaymentPage user={user} /> : <Navigate to="/login" />}
          element={<div className='h-screen flex'><ReviewPage /></div>}
        />
      </Routes>
    </div>
    </ThemeProvider>
  )
}

export default App