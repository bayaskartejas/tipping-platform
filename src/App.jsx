import FirstP from './components/FirstP'
import './App.css'
import Navbar from './components/Navbar'
import WaiterSignup from './components/WaiterSignup'
import bg2 from "./assets/bg2.svg"
import { useState } from 'react'

function App() {
  const [toSignup, setToSignup] = useState(false);  
  const [toSignin, setToSignin] = useState(false);
  const [toOtpPage, setToOtpPage] = useState(false);
  const [newOtp, setNewOtp] = useState("0");
  return (
    <div className='bg-slate-200 font-poppins w-full h-full'>
      <div>
        <img className='animate-slide-fade-in fixed top sm:top-56 w-full h-full object-cover bg-no-repeat bg-center zoom-in sm:bg-cover sm:bg-auto' src={bg2} alt="" />
      </div>
      <div className='w-max h-max'>
        <Navbar />
      </div>
      <div className='mt-24 z-0 sm:top-12 sm:relative'>
        <div className='text-4xl flex justify-center px-7 py-5 font-semibold tracking-normal text-slate-800'>Choose your Profile</div>
        <div className='flex w-full justify-center items-center animate-popup mt-4'>
          <FirstP toSignup={toSignup} setToSignup={setToSignup}/>
        </div>
      </div>
      {toSignup && (
        <div className='fixed z-50 top-0 left-0 right-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300'>
            <WaiterSignup setToSignup={setToSignup} setToSignin={setToSignin} setToOtpPage={setToOtpPage} newOtp={newOtp} setNewOtp={setNewOtp} />
        </div>
      )}
    </div>
  )
}

export default App
