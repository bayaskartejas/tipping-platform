import React from 'react'
import logo from "../assets/logo.png"
import contact from "../assets/contact.png"
function Navbar() {
  return (
    <div className='min-h-20 h-max border flex justify-between items-center fixed top-0 sm:top-0 z-10 w-full shadow-md bg-slate-200'>
        <div className='flex items-center justify-center h-max sm:ml-16'>
            <div className='flex justify-center items-center border'>
                <img src={logo} alt="" className='h-20'/>
            </div>
            <div className='font-semibold text-xl sm:text-2xl text-slate-600 w-44 sm:w-max ml-5'>New Punjabi Dhaba & Restaurant</div>
        </div>
        <div className='sm:mr-16'>
            <img src={contact} alt="" className='h-10 border bg-slate-600 p-1 rounded-full cursor-pointer'/>
        </div>
    </div>
  )
}

export default Navbar