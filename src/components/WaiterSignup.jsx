import React, { useRef, useState } from 'react';
import axios from "axios"; // Ensure axios is imported
import { useSetRecoilState } from 'recoil';
import { Signin2 } from './States';
import { Loader2 } from 'lucide-react';
import { WarningAlert } from './Alerts';

function WaiterSignup({ setShowWaiterSignup, setShowOtpVerify, setUserType }) {
    const setSignin = useSetRecoilState(Signin2);
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const aadhaarRef = useRef();
    const upiRef = useRef();  
    const genderRef = useRef();
    const ageDayRef = useRef();     
    const ageMonthRef = useRef();
    const ageYearRef = useRef();
    const storeIdRef = useRef(); 
    const numberRef = useRef();
    const [showWarning, setWarning] = useState(false)
    const [warningMessage, setWarningMessage] = useState("")
    const [isLoading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true)
        if (genderRef.current.value === "Select") {
            setWarningMessage("Select gender properly");
            setWarning(true)
            setLoading(false)
            return;
        }

        // Gather the data to be sent to the backend
        const waiterData = {
            storeId: storeIdRef.current.value,
            name: `${firstNameRef.current.value} ${lastNameRef.current.value}`, // Combining first and last name
            email: emailRef.current.value,
            aadhaar: parseInt(aadhaarRef.current.value),
            upi: upiRef.current.value,
            dob: `${ageYearRef.current.value}-${ageMonthRef.current.value}-${ageDayRef.current.value}`, // Format: YYYY-MM-DD
            gender: genderRef.current.value,
            number: parseInt(numberRef.current.value)
        };

        try {
            // Send a POST request to the backend
            const response = await axios.post('https://tipnex-server.tipnex.com/api/staff/register', waiterData);
            sessionStorage.setItem("email", emailRef.current.value)
            sessionStorage.setItem("storeId", storeIdRef.current.value)
            setShowOtpVerify(true); // Show OTP verification component
            setShowWaiterSignup(false); // Close the signup form
            setUserType("staff")
            setLoading(false)
        } catch (error) {
            setWarning(true)
            setWarningMessage(error.response.data.error)
            setLoading(false) 
        }
    }

    return (
        <div>
      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm ">
          <WarningAlert message={warningMessage} onClose={() => setWarning(false)} />
        </div>
      )}
            <div className='bg-white animate-popup w-72 sm:w-96 h-max justify-self-center shadow-lg rounded-lg md:px-7 px-4 py-8 transform transition-transform duration-300 scale-95'>
            <div className='flex justify-between'>
                <h1 className='justify-center flex text-2xl font-medium'>Create an Account</h1> 
                <svg onClick={() => setShowWaiterSignup(false)} className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                    <path d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z"></path>
                </svg>
            </div>
            <div className='text-sm text-slate-500'>For Waiters / Helpers</div>
            <div className='border mt-2'></div>
            <form onSubmit={handleSubmit}>
                <div className='flex mt-3'>
                    <input type="text" className='w-full h-8 mr-2 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' ref={firstNameRef} placeholder='First Name' required />
                    <input type="text" className='w-full h-8 ml-2 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' ref={lastNameRef} placeholder='Last Name' required />
                </div>
                <input type="email" className='w-full h-8 mt-2 border-2 border-gray-300 placeholder:text-gray-500 rounded-md text-sm pl-3' ref={emailRef} placeholder='Email Address' required />
                <input type="number" className='w-full h-8 mt-2 border-2 border-gray-300 placeholder:text-gray-500 rounded-md text-sm pl-3' ref={aadhaarRef} placeholder='Aadhaar Card' required />
                <input type="number" className='w-full h-8 mt-2 border-2 border-gray-300 placeholder:text-gray-500 rounded-md text-sm pl-3' ref={storeIdRef} placeholder='Store ID' required />
                <input type="number" className='w-full h-8 mt-2 border-2 border-gray-300 placeholder:text-gray-500 rounded-md text-sm pl-3' ref={numberRef} placeholder='Mobile Number' required />
                <input type="text" className='w-full h-8 mt-2 border-2 border-gray-300 placeholder:text-gray-500 rounded-md text-sm pl-3' ref={upiRef} placeholder='UPI ID' required />
                <div className='text-sm mt-3 mb-1 text-gray-500'>Date of Birth</div>
                <div className='mb-2 flex'>
                    <select ref={ageDayRef} className="pl-3 md:w-32 w-full md:mr-1 mr-3 md:h-9 h-8 rounded-md bg-white border-2 border-gray-300 text-gray-500 text-sm" aria-label="Day" required>
                        <option value="Day">Day</option>
                        {[...Array(31)].map((_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                        ))}
                    </select>
                    <select ref={ageMonthRef} className="pl-3 w-full h-8 md:w-32 md:mr-1 mr-3 md:h-9 rounded-md bg-white border-2 text-sm border-gray-300 text-gray-500" aria-label="Month" required>
                        <option value="Month">Month</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                    </select>
                    <select ref={ageYearRef} className="pl-3 w-full h-8 md:w-32 md:h-9 rounded-md bg-white border-2 text-sm border-gray-300 text-gray-500" aria-label="Year" required>
                        <option value="Year">Year</option>
                        {[...Array(100)].map((_, i) => (
                            <option key={i + 1920} value={2023 - i}>{2023 - i}</option>
                        ))}
                    </select>
                </div>
                <div className='flex mt-2'>
                    <select ref={genderRef} className='w-full h-8 border-2 border-gray-300 pl-3 rounded-md text-sm text-gray-500' aria-label="Gender" required>
                        <option value="Select">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className='flex justify-center'>
                    <button type='submit' className='flex text-white text-lg bg-[#229799] hover:bg-[#229799] w-full py-2 rounded-md hover:bg-green-101 transition delay-100 hover:shadow-md justify-center mt-4'>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Sign up"}
                    </button>
                </div>
            </form>
            <div className='flex justify-center text-sm text-slate-500 mt-4'>
                <div>Already have an account?</div>
                <button onClick={() => { setShowWaiterSignup(false); setSignin(true) }} className='text-[#229799] font-semibold ml-1'>Sign In</button>
            </div>
        </div>
        </div>
    );
}

export default WaiterSignup;
