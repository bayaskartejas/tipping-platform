import React from 'react'
import { useState } from 'react'
import waiter from "../assets/waiter.png"
import waiter2 from "../assets/waiter2.png"
import customer from "../assets/customer.png"
import customer2 from "../assets/customer2.png"
import owner from "../assets/owner.png"
import owner2 from "../assets/owner2.png"
import WaiterSignup from './WaiterSignup'
function FirstP({toSignup, setToSignup}) {
    return (
      <div className='sm:flex grid justify-center w-full fixed top-0'>
        <div className='bg-[#fff] cursor-pointer hover:scale-110 duration-200 sm:mx-8 rounded-3xl w-48 h-48 sm:w-64 sm:h-64 my-5 sm:my-0 flex justify-center items-center text-xl font-medium tracking-wide shadow-2xl hover:shadow-[#424242]'>
          <div className=''>
            <div className='w-full flex justify-center'>
              <img className='h-24' src={customer2} alt="" />
            </div>
            <div className='w-full flex justify-center mt-3'>Customer</div>
          </div>
        </div>
        <div onClick={() => { setToSignup(true); }} className='bg-[#fff] cursor-pointer hover:scale-110 duration-200 sm:mx-8 rounded-3xl w-48 h-48 sm:w-64 sm:h-64 my-5 sm:my-0 text-xl font-medium tracking-wide flex items-center justify-center shadow-2xl hover:shadow-[#424242]'>
          <div className=''>
            <div className='w-full flex justify-center'>
              <img className='h-24' src={waiter2} alt="" />
            </div>
            <div className='w-full flex justify-center mt-3'>Waiter / Helper</div>
          </div>
        </div>
        <div className='bg-[#fff] cursor-pointer hover:scale-110 duration-200 sm:mx-8 rounded-3xl w-48 h-48 sm:w-64 sm:h-64 my-5 sm:my-0 flex justify-center items-center text-xl font-medium tracking-wide shadow-2xl hover:shadow-[#424242]'>
          <div className=''>
            <div className='w-full flex justify-center'>
              <img className='h-24' src={owner2} alt="" />
            </div>
            <div className='w-full flex justify-center mt-3'>Business Owner</div>
          </div>
        </div>
      </div>
    );
  }
  
  

export default FirstP