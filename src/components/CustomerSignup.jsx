import { X } from 'lucide-react';
import { Signin2 } from './States';
import { useSetRecoilState } from 'recoil';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { WarningAlert } from './Alerts';
import { useState } from 'react'; // Import useState for managing form data

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    // Prepare the data for the POST request
    const customerData = {
      name: `${firstName} ${lastName}`, // Combine first and last name
      email: email,
      phone: mobile,
    };

    try {
      // Make the POST request to the backend
      const response = await axios.post('http://localhost:3000/api/auth/register/customer', customerData);
      
      // Check response status and handle accordingly
      if (response.status === 201) {
        console.log('Customer created successfully:', response.data);
        setLoading(false)
        setShowCustomerSignup(false); // Close the signup form
        setShowOtpVerify(true); // Show the OTP verification component
        setUserType("customer")
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
      <div className='bg-white animate-popup w-80 sm:w-96 h-[400px] justify-self-center shadow-lg rounded-lg md:px-7 px-4 py-8 transform transition-transform duration-300 scale-95'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-medium'>Create Customer Account</h1>
        <X className="cursor-pointer" size={24} onClick={() => setShowCustomerSignup(false)} />
      </div>
      <div className='text-sm text-slate-500'>For Customers</div>
      <div className='border mt-2'></div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className='flex space-x-4'>
          <input 
            type="text" 
            className='w-1/2 h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' 
            placeholder='First Name' 
            required 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} // Set state for first name
          />
          <input 
            type="text" 
            className='w-1/2 h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' 
            placeholder='Last Name' 
            required 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} // Set state for last name
          />
        </div>
        <input 
          type="email" 
          className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' 
          placeholder='Email' 
          required
          value={email}
          onChange={(e) => {setEmail(e.target.value); sessionStorage.setItem("email", e.target.value)}} // Set state for email
        />
        <div className='flex'>
          <div className='h-8 border-2 border-gray-300 w-10 rounded-md text-sm flex justify-center items-center mr-2'>+91</div>
          <input 
          type="number" 
          className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' 
          placeholder='Mobile Number' 
          required
          value={mobile}
          onChange={(e) => setMobile(parseInt(e.target.value) || '')} // Set state for mobile number
        />
        </div>

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
