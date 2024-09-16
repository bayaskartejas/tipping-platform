import { useState, useRef } from 'react'
import { Camera, X } from 'lucide-react'
import { Signin2 } from './States';
import { useSetRecoilState } from 'recoil';
export default function OwnerSignup({ setShowOwnerSignup, setShowOtpVerify }) {
  const [storeLogo, setStoreLogo] = useState(null)
  const [ownerSelfie, setOwnerSelfie] = useState(null)
  const fileInputRefLogo = useRef(null)
  const fileInputRefSelfie = useRef(null)
  const setSignin = useSetRecoilState(Signin2)
  const handleSubmit = (e) => {
    e.preventDefault()
    setShowOtpVerify(true)
    setShowOwnerSignup(false)
  }

  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='bg-white max-h-screen overflow-auto animate-popup w-96 h-[700px] justify-self-center shadow-lg rounded-lg md:px-7 px-4 py-5 transform transition-transform duration-300 scale-95'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-medium'>Create Owner Account</h1>
        <X className="cursor-pointer" size={24} onClick={() => setShowOwnerSignup(false)} />
      </div>
      <div className='text-sm text-slate-500'>For Store Owners</div>
      <div className='border mt-1'></div>
      <form onSubmit={handleSubmit} className="space-y-2 mt-3">
        <input type="text" className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='Store Name' required/>
        <textarea className='w-full h-20 border-2 border-gray-300 placeholder:text-gray-500 p-3 rounded-md text-sm' placeholder='Store Address' required></textarea>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRefLogo}
              onChange={(e) => handleFileChange(e, setStoreLogo)}
              className="hidden"
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => fileInputRefLogo.current.click()}
              className="bg-[#229799] text-white px-3 py-2 rounded-md text-sm flex items-center"
            >
              <Camera size={16} className="mr-2" />
              Upload Store Logo
            </button>
          </div>
          {storeLogo && (
            <img src={storeLogo} alt="Store Logo" className="w-16 h-16 rounded-full object-cover" />
          )}
        </div>
        <input type="text" className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='Owner Name' required/>
        <div className='flex space-x-4'>
          <select className="w-1/3 h-8 border-2 border-gray-300 pl-3 rounded-md text-sm text-gray-500" aria-label="Day" name="day" required>
            <option value="">Day</option>
            {[...Array(31)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select className="w-1/3 h-8 border-2 border-gray-300 pl-3 rounded-md text-sm text-gray-500" aria-label="Month" name="month" required>
            <option value="">Month</option>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
              <option key={i} value={i + 1}>{month}</option>
            ))}
          </select>
          <select className="w-1/3 h-8 border-2 border-gray-300 pl-3 rounded-md text-sm text-gray-500" aria-label="Year" name="year" required>
            <option value="">Year</option>
            {[...Array(100)].map((_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
            ))}
          </select>
        </div>
        <select className='w-full h-8 border-2 border-gray-300 pl-3 rounded-md text-sm text-gray-500' aria-label="Gender" required>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="tel" className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='Mobile Number' required/>
        <input type="text" className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='Aadhaar Number' required/>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRefSelfie}
              onChange={(e) => handleFileChange(e, setOwnerSelfie)}
              className="hidden"
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => fileInputRefSelfie.current.click()}
              className="bg-[#229799] text-white px-3 py-2 rounded-md text-sm flex items-center"
            >
              <Camera size={16} className="mr-2" />
              Upload Selfie
            </button>
          </div>
          {ownerSelfie && (
            <img src={ownerSelfie} alt="Owner Selfie" className="w-16 h-16 rounded-full object-cover" />
          )}
        </div>
        <input type="text" className='w-full h-8 border-2 border-gray-300 placeholder:text-gray-500 pl-3 rounded-md text-sm' placeholder='UPI ID' required/>
        <button type='submit' className='flex text-white text-lg bg-[#229799] hover:bg-[#1b7b7d] w-full py-2 rounded-md transition delay-100 hover:shadow-md justify-center'>Sign up</button>
      </form>
      <div className='flex justify-center text-sm text-slate-500 mt-4'>
        Already have an account?
        <div onClick={() => {setSignin(true); setShowOwnerSignup(false)}} className='ml-1 text-blue-600 cursor-pointer'>Sign in</div>
      </div>
    </div>
  )
}