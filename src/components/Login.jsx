import React, { useState } from 'react'
import axios from 'axios'

export default function Login({ onLoginSuccess }) {
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  // const [error, setError] = useState('')

  // const handleLogin = async (e) => {
  //   e.preventDefault()
  //   setError('')
  //   try {
  //     const response = await axios.post('http://localhost:3000/api/auth/login', { email, password })
  //     localStorage.setItem('token', response.data.token)
  //     onLoginSuccess(response.data.user)
  //   } catch (error) {
  //     console.error('Login failed:', error)
  //     setError('Invalid email or password')
  //   }
  // }

  return (
    <div></div>
    // <div className="min-h-screen flex items-center justify-center bg-slate-200">
    //   <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
    //     <h2 className="text-2xl font-bold mb-6 text-center">Login to TipNex</h2>
    //     {error && <p className="text-red-500 mb-4">{error}</p>}
    //     <div className="mb-4">
    //       <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
    //         Email
    //       </label>
    //       <input
    //         type="email"
    //         id="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#229799] focus:border-[#229799]"
    //         required
    //       />
    //     </div>
    //     <div className="mb-6">
    //       <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
    //         Password
    //       </label>
    //       <input
    //         type="password"
    //         id="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#229799] focus:border-[#229799]"
    //         required
    //       />
    //     </div>
    //     <button
    //       type="submit"
    //       className="w-full bg-[#229799] text-white py-2 px-4 rounded-md hover:bg-[#1b7b7d] transition-colors duration-300"
    //     >
    //       Login
    //     </button>
    //   </form>
    // </div>
  )
}