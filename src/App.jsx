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
import PaymentSuccess from './components/PaymentSucess'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import night from "./assets/night.jpg"
import CouponSuccess from './components/CouponSuccess'
import PaymentUnsuccessful from './components/PaymentUnsuccessful'
const theme = createTheme();


function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [amount, setAmount] = useState()
  const [transaction_id, setTransaction_id] = useState()
  const [payment_mode, setPayment_mode] = useState() 
  const [receivers_name, setReceivers_name] = useState() 
  const [dateAndTime, setDateAndTime] = useState()
  const [reviewersName, setReviewersName] = useState()


  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    setLoading(true)
    if (token, role) {
      //  navigate(`/${role}`)
       setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const onLoginSuccess = (user) => {
    setUser(user)
    navigate(`/${user.role}`)
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <ThemeProvider theme={theme}>
    <div className='bg-slate-200 font-poppins w-full min-h-screen'>
      <Routes>
        <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <MainLanding />} />
        <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess}/>} />
        <Route
          path="/staff"
          // element={user && user.role === 'staff' ? <HelperProfile user={user} /> : <Navigate to="/login" />}
          element={<HelperProfile/>}
        />
        <Route
          path="/customer"
          // element={user && user.role === 'customer' ? <CustomerProfile user={user} /> : <Navigate to="/login" />}
          element={<CustomerProfile/>}
        />
        <Route
          path="/store"
          // element={user && user.role === 'store' ? <OwnerProfile user={user} /> : <Navigate to="/login" />}
          element={<OwnerProfile/>}
        />
        <Route
          path="/pay/:storeId"
          // element={user ? <PaymentPage user={user} /> : <Navigate to="/login" />}
          element={<PaymentPage setAmount= {setAmount} setTransaction_id = {setTransaction_id} setPayment_mode = {setPayment_mode} setReceivers_name = {setReceivers_name} setDateAndTime = {setDateAndTime}/>}
        />
        <Route
          path="/payment-success/:storeId"
          // element={user ? <PaymentPage user={user} /> : <Navigate to="/login" />}
          element={<PaymentSuccess amount={amount} transaction_id={transaction_id} payment_mode={payment_mode} receivers_name={receivers_name} dateAndTime={dateAndTime}/>}
        />
        <Route
          path="/payment-error/:storeId"
          // element={user ? <PaymentPage user={user} /> : <Navigate to="/login" />}
          element={<PaymentUnsuccessful amount={amount} transaction_id={transaction_id} payment_mode={payment_mode} receivers_name={receivers_name} dateAndTime={dateAndTime}/>}
        />
        <Route
          path="/review"
          // element={user ? <PaymentPage user={user} /> : <Navigate to="/login" />}
          element={<div className='h-screen flex relative bg-cover bg-center' style={{ backgroundImage: `url(${night})` }}><ReviewPage reviewersName={reviewersName}/></div>}
        />
        <Route
          path="/coupon-success"
          // element={user ? <PaymentPage user={user} /> : <Navigate to="/login" />}
          element={<div className='h-screen flex relative bg-cover bg-center' style={{ backgroundImage: `url(${night})` }}><CouponSuccess /></div>}
        />
      </Routes>
    </div>
    </ThemeProvider>
  )
}

export default App