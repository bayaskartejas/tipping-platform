import React, { useState } from 'react'
import { useRef } from 'react';
import axios from "axios"
function WaiterSignup({setToSignup, setToSignin, setToOtpPage, newOtp, setNewOtp}) {
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const genderRef = useRef()
    const ageRef = useRef()
    
    function handleSubmit(e){
      e.preventDefault();
      if( genderRef.current.value == "Male" || genderRef.current.value == "Female" ){
      }
      else{
        alert("Select gender properly");
      }
      axios.post("https://apti-server.tejascodes.com/otp", {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        age: parseInt(ageRef.current.value),
        gender: genderRef.current.value
    })
    .then((res)=>{
        setNewOtp(res.data.otp)
        setToOtpPage(true)    
        setToSignup(false)        
    })
    .catch((e)=>{
        alert(e.response.data.msg);
    })
    }
  
    return <div className='bg-white animate-popup w-96 h-[350px] justify-self-center shadow-lg rounded-lg md:px-7 px-4 py-8 transform transition-transform duration-300 scale-95'>
      <div className='flex justify-between'>
        <h1 className='justify-center flex text-2xl font-medium'>Create an Account</h1> 
        <svg onClick={()=>{setToSignup(false)}} className=' cursor-pointer' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
          <path d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z"></path>
        </svg>
      </div>
      <div className='mt-2'>
      </div>
      <form onSubmit={handleSubmit} action="">
      <div className='flex mt-3'>
        <input type="text" name="" id="" className='w-full h-8 mr-2 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' ref={firstNameRef} placeholder='First Name' required/>
        <input type="text" name="" id="" className='w-full h-8 ml-2 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm'ref={lastNameRef} placeholder='Last Name' required/>
      </div>
      <input type="text" name="" id="" className='w-full h-8 mt-2 border-2 border-gray-300 placeholder:text-gray-500 rounded-md text-sm pl-3' ref={emailRef} placeholder='Email' required/>
      <input type="password" name="" id="" className='w-full h-8 mt-2 border-2 border-gray-300 placeholder:text-gray-500 rounded-md text-sm pl-3' ref={passwordRef} placeholder='Password' required/>
      <div className='flex mt-2'>
        <input type="number" name="" id="" className='w-full h-8 mr-2 border-2 pl-3  border-gray-300 placeholder:text-gray-500 rounded-md text-sm' ref={ageRef} placeholder='Age' required/>
        <select ref={genderRef} name="" id="" className='w-full h-8 ml-2 border-2  border-gray-300 pl-3 rounded-md text-sm' aria-label="Gender" required>
          <option value="Select">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>  
      <div className='flex justify-center'>
        <button type='submit' className='flex text-white text-lg bg-[#48CFCB] hover:bg-[#229799] w-full py-2 rounded-md hover:bg-green-101 transition delay-100 hover:shadow-md justify-center mt-4'>Sign up</button>
      </div>
      </form>
      <div className='flex justify-center text-sm text-slate-500 mt-1.5'>
        already have an account?
        <div onClick={()=>{ setToSignin(true); setToSignup(false)}} className='ml-1 text-blue-600 cursor-pointer'>Sign in</div>
      </div>
  
    </div>
  } 

  

export default WaiterSignup