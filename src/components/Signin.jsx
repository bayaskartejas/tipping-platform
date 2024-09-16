import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function Signin({ setShowSignin, setToSignup }) {
  const [timer, setTimer] = useState(0)
  const [canGetOTP, setCanGetOTP] = useState(true)
  const [mobileNumber, setMobileNumber] = useState('')
  const [isOTPSent, setIsOTPSent] = useState(false)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (timer === 0 && !canGetOTP) {
      setCanGetOTP(true)
    }
  }, [timer, canGetOTP])

  const handleGetOTP = () => {
    // Get OTP logic here
    setTimer(60)
    setCanGetOTP(false)
    setIsOTPSent(true)
  }

  const handleVerifyOTP = (e) => {
    e.preventDefault()
    // Verify OTP logic here
  }

  return (
    <div className='bg-white animate-popup w-96 h-[350px] justify-self-center shadow-lg rounded-lg md:px-7 px-4 py-8 transform transition-transform duration-300 scale-95'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-medium'>Sign In</h1>
        <X className="cursor-pointer" size={24} onClick={() => setShowSignin(false)} />
      </div>
      <div className='border mt-2'></div>
      <form onSubmit={handleVerifyOTP} className="space-y-4 mt-4">
        <div className="flex space-x-2">
          <input 
            type="tel" 
            className='w-3/4 h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' 
            placeholder='Mobile Number' 
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            disabled={!canGetOTP}
          />
          <button 
            type='button' 
            onClick={handleGetOTP} 
            className={`w-1/4 text-sm ${canGetOTP ? 'bg-[#229799] text-white' : 'bg-gray-300 text-gray-500'} rounded-md`}
            disabled={!canGetOTP}
          >
            {isOTPSent ? (timer > 0 ? `${timer}s` : 'Resend OTP') : 'Get OTP'}
          </button>
        </div>
        <input type="text" className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='Enter OTP' required/>
        <button type='submit' className='flex text-white text-lg bg-[#229799] hover:bg-[#1b7b7d] w-full py-2 rounded-md transition delay-100 hover:shadow-md justify-center'>Verify</button>
      </form>
      <div className='flex justify-center text-sm text-slate-500 mt-4'>
        Don't have an account?
        <div onClick={() => {setToSignup(true); setShowSignin(false)}} className='ml-1 text-blue-600 cursor-pointer'>Sign up</div>
      </div>
    </div>
  )
}