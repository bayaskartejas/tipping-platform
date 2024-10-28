import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X } from 'lucide-react';
import { SuccessAlert } from './Alerts';
import LoadingOverlay from './LoadingOverlay';
import { useRecoilState, useSetRecoilState } from 'recoil';

const OTPVerify = ({ setShowOtpVerify, userType }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();
  const email = sessionStorage.getItem("email");
  const storeId = sessionStorage.getItem("storeId");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          setCanResend(true);
          clearInterval(interval);
        }
        return prevTimer > 0 ? prevTimer - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleShowOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const BASE_URL = 'http://localhost:3000/api/auth';
      let response;

      if (userType === "customer") {
        response = await axios.post(`${BASE_URL}/verify-otp-customer`, { email, otp });
      } else if (userType === "store") {
        response = await axios.post(`${BASE_URL}/verify-otp-owner`, { email, otp });
        localStorage.setItem("storeId", response.data.storeId)
      } else if (userType === "staff") {
        response = await axios.post('http://localhost:3000/api/staff/verify', { email, otp, storeId });
        localStorage.setItem("storeId", response.data.storeId)
      } else {
        throw new Error('Invalid user type');
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token) 
        console.log('Token set:', response.data.token);
    }
     else {
        setError('Authentication data is missing from the response.');
        return;
      }

      setShowSuccess(true);
      setSuccessMessage('Email verified successfully!');
      handleShowOverlay();
      
      setTimeout(() => {
        setShowOtpVerify(false);
        setShowSuccess(false);
        navigate(userType === 'customer' ? '/customer' : userType === 'store' ? '/store' : '/staff');
      }, 2000);
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setOtpLoading(true);
    try {
      await axios.post('http://localhost:3000/api/auth/resend-otp', { email, userType });
      setTimer(30);
      setOtpLoading(false);
      setCanResend(false);

      setShowSuccess(true);
      setSuccessMessage('OTP resent successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="relative">
      {showOverlay && <LoadingOverlay duration={1500} />}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
          <SuccessAlert message={successMessage} onClose={() => setShowSuccess(false)} />
        </div>
      )}
      <div className='bg-white animate-popup sm:w-96 sm:h-[300px] w-72 justify-self-center shadow-lg rounded-lg md:px-7 px-4 py-8 transform transition-transform duration-300 scale-95'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-medium'>Verify OTP</h1>
          <X className="cursor-pointer" size={24} onClick={() => setShowOtpVerify(false)} />
        </div>
        <div className='text-sm text-slate-500'>sent on your email</div>
        <div className='border mt-2'></div>
        <form onSubmit={handleVerifyOTP} className="space-y-4 mt-4">
          <input
            type="text"
            className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm'
            placeholder='Enter OTP'
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type='submit'
            className='flex text-white text-lg bg-[#229799] hover:bg-[#1b7b7d] w-full py-2 rounded-md transition delay-100 hover:shadow-md justify-center'
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            type='button'
            onClick={handleResendOTP}
            className={`text-sm ${canResend ? 'text-blue-600 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
            disabled={!canResend || otpLoading}
          >
            {otpLoading ? "Resending..." : canResend ? 'Resend OTP' : `Resend OTP in ${timer}s`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerify;