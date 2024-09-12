import React from 'react'
import logo from "../assets/logo.png"
import contact from "../assets/contact.png"
function Navbar() {
  return (
    <div className='min-h-20 h-max border flex justify-between items-center bg-[#424242] fixed top-0 z-10 w-full'>
        <div className='flex items-center'>
            <div className='flex justify-center items-center border  fixed'>
                <img src={logo} alt="" className='h-20'/>
            </div>
            <div className='font-semibold text-xl ml-[92px] text-white w-44 sm:w-max'>New Punjabi Dhaba & Restaurant</div>
        </div>
        <div>
            <img src={contact} alt="" className='h-7 mr-3'/>
        </div>
    </div>
  )
}

export default Navbar