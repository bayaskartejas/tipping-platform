import React from 'react'
import waiter from "../assets/waiter.png"
import waiter2 from "../assets/waiter2.png"
import customer from "../assets/customer.png"
import customer2 from "../assets/customer2.png"
import owner from "../assets/owner.png"
import owner2 from "../assets/owner2.png"
function FirstP() {
  return (
    <div className='sm:flex w-full grid justify-center'>
        <div className='bg-[#48CFCB] sm:mx-8 rounded-3xl w-48 h-48 sm:w-64 sm:h-64 my-5 sm:my-0 flex justify-center items-center text-white text-xl font-medium tracking-wide shadow-2xl'>
            <div className=''>
                <div className='w-full flex justify-center'><img className='h-24' src={customer2} alt="" /></div> <div className='w-full flex justify-center mt-3'>Customer</div>
            </div>
        </div>
        <div className='bg-[#48CFCB] sm:mx-8 rounded-3xl w-48 h-48 sm:w-64 sm:h-64 my-5 sm:my-0 text-white text-xl font-medium tracking-wide flex items-center justify-center shadow-2xl'>
            <div className=''>
                <div className='w-full flex justify-center'><img className='h-24' src={waiter2} alt="" /></div> <div className='w-full flex justify-center mt-3'>Waiter / Helper</div>
            </div>
        </div>
        <div className='bg-[#48CFCB] sm:mx-8 rounded-3xl w-48 h-48 sm:w-64 sm:h-64 my-5 sm:my-0 flex justify-center items-center text-white text-xl font-medium tracking-wide shadow-2xl'>
            <div className=''>
                    <div className='w-full flex justify-center'><img className='h-24' src={owner2} alt="" /></div> <div className='w-full flex justify-center mt-3'>Business Owner</div>
            </div>
        </div>
    </div>
  )
}

export default FirstP