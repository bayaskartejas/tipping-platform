import { X } from 'lucide-react';
import { Signin2 } from '../States';
import { useSetRecoilState } from 'recoil';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { WarningAlert } from '../components/Alerts';
import { useState } from 'react'; // Import useState for managing form data
import { TextField } from '@mui/material';

export default function CustomerSignup({ setShowCustomerSignup, setShowOtpVerify, setUserType }) {
  const setSignin = useSetRecoilState(Signin2);

  // Define state to hold form input values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState();
  const [isLoading, setLoading] = useState(false)
  const [showWarning, setWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (password !== confirmPassword) {
      setWarning(true);
      setWarningMessage("Passwords do not match");
      setLoading(false);
      return;
    }
    // Prepare the data for the POST request
    const customerData = {
      name: `${firstName} ${lastName}`, // Combine first and last name
      email: email,
      phone: mobile,
      password: password
    };

    try {
      // Make the POST request to the backend
      const response = await axios.post('https://tipnex-server.tipnex.com/api/auth/register/customer', customerData);
      
      // Check response status and handle accordingly
      if (response.status === 201) {
        setLoading(false)
        setShowCustomerSignup(false);
        setShowOtpVerify(true);
        setUserType("customer")
        localStorage.setItem("token", response.data.token)
      }
    } catch (error) {
      setWarning(true)
      setWarningMessage(error.response.data.error)
      setLoading(false)   
    }
  };

  return (
    <div className='relative flex justify-center items-center'>
      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm ">
          <WarningAlert message={warningMessage} onClose={() => setWarning(false)} />
        </div>
      )}
      <div className='bg-white animate-popup w-80 sm:w-96 h-max justify-self-center shadow-lg rounded-lg md:px-7 px-4 py-8 transform transition-transform duration-300 scale-95'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-medium'>Create Customer Account</h1>
        <X className="cursor-pointer" size={24} onClick={() => setShowCustomerSignup(false)} />
      </div>
      <div className='text-sm text-slate-500'>For Customers</div>
      <div className='border mt-2'></div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className='flex space-x-4'>
        <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ }}
                required
              />
        <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{   }}
                required
              />
        </div>
        <TextField
                fullWidth
                label="Email"
                type='email'
                variant="outlined"
                value={email}
                onChange={(e) => {setEmail(e.target.value); sessionStorage.setItem("email", e.target.value)}} // Set state for email
                sx={{  }}
                required
              />
        <div className='flex'>
          <TextField
                fullWidth
                label="Mobile Number"
                type='number'
                variant="outlined"
                value={mobile}
                onChange={(e) => setMobile(parseInt(e.target.value) || '')} l
                sx={{   }}
                required
              />
        </div>
        <>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              required
              type="password"
              sx={{ my: 1 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              required
              type="password"
              sx={{ my: 1 }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        <button 
          type='submit' 
          className='flex text-white text-lg bg-[#229799] hover:bg-[#1b7b7d] w-full py-2 rounded-md transition delay-100 hover:shadow-md justify-center'>
          {isLoading ? <Loader2 className="animate-spin" /> : "Sign up"}
        </button>
      </form>
      <div className='flex justify-center text-sm text-slate-500 mt-4'>
        Already have an account?
        <div onClick={() => {setSignin(true); setShowCustomerSignup(false)}} className='ml-1 text-blue-600 cursor-pointer'>Sign in</div>
      </div>
    </div>
    </div>
  );
}
