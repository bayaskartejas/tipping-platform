import { X } from 'lucide-react';

export default function CustomerSignup({ setShowCustomerSignup, setToSignin, setShowOtpVerify }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    setShowCustomerSignup(false); // Close the signup form
    setShowOtpVerify(true); // Show the OTP verification component
  };

  return (
    <div className='bg-white animate-popup w-96 h-[400px] justify-self-center shadow-lg rounded-lg md:px-7 px-4 py-8 transform transition-transform duration-300 scale-95'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-medium'>Create Customer Account</h1>
        <X className="cursor-pointer" size={24} onClick={() => setShowCustomerSignup(false)} />
      </div>
      <div className='text-sm text-slate-500'>For Customers</div>
      <div className='border mt-2'></div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className='flex space-x-4'>
          <input type="text" className='w-1/2 h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='First Name' required/>
          <input type="text" className='w-1/2 h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='Last Name' required/>
        </div>
        <input type="email" className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='Email' required/>
        <input type="tel" className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='Mobile Number' required/>
        <button type='submit' className='flex text-white text-lg bg-[#229799] hover:bg-[#1b7b7d] w-full py-2 rounded-md transition delay-100 hover:shadow-md justify-center'>Sign up</button>
      </form>
      <div className='flex justify-center text-sm text-slate-500 mt-4'>
        Already have an account?
        <div onClick={() => {setToSignin(true); setShowCustomerSignup(false)}} className='ml-1 text-blue-600 cursor-pointer'>Sign in</div>
      </div>
    </div>
  );
}
