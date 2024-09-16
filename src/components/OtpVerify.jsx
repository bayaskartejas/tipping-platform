import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function OTPVerify({ setShowOTPVerify }) {
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          setCanResend(true)
          clearInterval(interval)
        }
        return prevTimer > 0 ? prevTimer - 1 : 0
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleResendOTP = () => {
    // Resend OTP logic here
    setTimer(30)
    setCanResend(false)
  }

  const handleVerifyOTP = (e) => {
    e.preventDefault()
    // Verify OTP logic here
  }

  return (
    <div className='bg-white animate-popup w-96 h-[300px] justify-self-center shadow-lg rounded-lg md:px-7 px-4 py-8 transform transition-transform duration-300 scale-95'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-medium'>Verify OTP</h1>
        <X className="cursor-pointer" size={24} onClick={() => setShowOTPVerify(false)} />
      </div>
      <div className='border mt-2'></div>
      <form onSubmit={handleVerifyOTP} className="space-y-4 mt-4">
        <input type="text" className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='Enter OTP' required/>
        <button 
          type='button' 
          onClick={handleResendOTP} 
          className={`text-sm ${canResend ? 'text-blue-600 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
          disabled={!canResend}
        >
          {canResend ? 'Resend OTP' : `Resend OTP in ${timer}s`}
        </button>
        <button type='submit' className='flex text-white text-lg bg-[#229799] hover:bg-[#1b7b7d] w-full py-2 rounded-md transition delay-100 hover:shadow-md justify-center'>Verify OTP</button>
      </form>
    </div>
  )
}