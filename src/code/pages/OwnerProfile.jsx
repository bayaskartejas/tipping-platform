import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, Ticket, Edit2, LogOut } from 'lucide-react'
import ProfileHeaderO from '../sections/ProfileHeaderO'
import StaffPerformanceGraph from '../components/StaffPerformanceGraph'
import RestaurantReviews from '../components/RestaurantReviews'
import ManageCoupons from '../popups/ManageCoupons'
import CouponSuccess from '../popups/CouponSuccess'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { 
  Typography, 
  Box, 
  Avatar, 
  Paper, 
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom'
import LoadingOverlay from '../components/LoadingOverlay'

export default function OwnerProfile({ onGoBack, user }) {
  const [showManageCoupons, setShowManageCoupons] = useState(false)
  const [storeData, setStoreData] = useState(null)
  const [profileData, setProfileData] = useState(null);
  const [imageUrls, setImageUrls] = useState({ logoUrl: null, ownerPhotoUrl: null });
  const [error, setError] = useState(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const logoFileInputRef = useRef()
  const [selectedLogoImage, setSelectedLogoImage] = useState(null)
  const [showLogoConfirmation, setShowLogoConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [showCouponSuccess, setShowCouponSuccess] = useState(false)
  const [couponDetails, setCouponDetails] = useState({})
  const token = localStorage.getItem("token")

  const fetchStoreData = async () => {
    console.log('Token before fetching:', token);
      try {
        const response = await axios.get('https://tipnex-server.tipnex.com/api/store/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setStoreData(response.data)
      } catch (error) {
        console.error('Error fetching store data:', error)
        navigate("/login")
      } 
    }

    useEffect(() => {
      fetchStoreData();
    }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const storeId = localStorage.getItem('storeId');
        if (!storeId) {
          setError('Store ID not found. Please log in again.');
          return;
        }
        const profileResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/${storeId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfileData(profileResponse.data);

        const imageUrlsResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/image-urls/${storeId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setImageUrls(imageUrlsResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while fetching profile data');
      }
    };
    fetchProfileData();
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!profileData) {
    return <Typography>Loading...</Typography>;
  }

  const handleLogoImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedLogoImage(file)
        setShowLogoConfirmation(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirmLogo = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('storeId', localStorage.getItem("storeId"))
      formData.append('logoFile', selectedLogoImage)

      const response = await axios.post('https://tipnex-server.tipnex.com/api/store/update-logo', {
        logoFile: selectedLogoImage ? {
          contentType: selectedLogoImage.type
        } : null,
        storeId : storeData.storeId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Upload the image to the provided URL
      await axios.put(response.data.logoPutUrl, selectedLogoImage, {
        headers: { 'Content-Type': selectedLogoImage.type }
      })

      setShowLogoConfirmation(false)
      setLoading(false)
      // Refresh the page or update the image URL
      fetchStoreData()
      const imageUrlsResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/image-urls/${localStorage.getItem("storeId")}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setImageUrls(imageUrlsResponse.data);
    } catch (error) {
      console.error('Error updating logo:', error)
    }
  }

  const handleCancelLogo = () => {
    setLoading(false)
    setSelectedLogoImage(null)
    setShowLogoConfirmation(false)
  }

  const handleLogout = () => {
    navigate("/")
    localStorage.removeItem("token"),
    localStorage.removeItem("storeId")
    localStorage.removeItem("role")
    setTimeout(()=>{
      setLoading(true)
    }, 700)
    setLoading(false)
    
  } 
  
  return (  
    <div className="min-h-screen bg-gray-100 p-4 md:p-8"> 
    {showCouponSuccess ? <CouponSuccess couponDetails={couponDetails} onBack={()=>{setShowCouponSuccess(false); setCouponDetails({})}} onCreateAnother={()=> {setShowManageCoupons(true); setShowCouponSuccess(false)}}/> : <></>}
    {loading ? <LoadingOverlay /> : <></>}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={()=>{navigate("/")}}
            className="flex items-center text-[#229799] hover:text-[#1b7b7d] transition-colors duration-300"
          >
            <ChevronLeft size={20} />
            <span className="ml-1">Go Back</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center text-[#229799] hover:text-[#1b7b7d] transition-colors duration-300"
          >
            <span className="mr-2">Log out</span>
            <LogOut size={20} />
            
          </button>
        </div>
        <div className="relative">
          <ProfileHeaderO storeData={storeData} imageUrls={imageUrls} profileData={profileData} />
          <button
            onClick={() => setShowManageCoupons(true)}
            className="absolute top-4 right-4 bg-[#229799] text-white sm:px-4 px-3 sm:py-2 py-1 rounded-md hover:bg-[#1b7b7d] transition-colors duration-300 flex items-center"
          >
            <Ticket className="mr-2" size={20} />
            Manage Coupons
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden py-5 h-max">
          <div>
            <div className='flex justify-center sm:text-2xl text-lg font-normal text-slate-600'>{storeData?.name}</div>
            <div className='flex justify-center sm:space-x-10 space-x-2 mt-5'>
              <div 
                className="relative sm:h-48 sm:w-48 w-32 h-32 bg-cover bg-center bg-slate-200 rounded-full"
                style={{ backgroundImage: `url(${imageUrls.logoUrl || "/placeholder.svg?height=200&width=800"})` }}
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
              >
                {isLogoHovered && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                    onClick={() => logoFileInputRef.current.click()}
                  > 
                    <Edit2 className="text-white ml-2" size={24} />
                  </div>
                )}
                <input
                  type="file"
                  ref={logoFileInputRef}
                  onChange={handleLogoImageChange}
                  className="hidden"
                  accept="image/*"
                />  
              </div>
              <div className='flex items-center'>
                <button 
                  className='sm:p-3 p-1 w-max rounded-lg border-2 border-slate-400 hover:bg-slate-100 flex items-center'
                  onClick={() => logoFileInputRef.current.click()}
                >
                  Change Logo <Edit2 className='ml-2' size={15}/>
                </button>
              </div>
            </div>
          </div>
        </div>
        <StaffPerformanceGraph profileData={profileData}/>
        <RestaurantReviews storeData={storeData}/>
      </div>
      {showManageCoupons && (
        <ManageCoupons onClose={() => setShowManageCoupons(false)} storeId={storeData?.id} setShowCouponSuccess={setShowCouponSuccess} setCouponDetails={setCouponDetails}/>
      )}
      {showLogoConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className='text-red-600'>{selectedLogoImage.size > 5 * 1024 * 1024 ? "File size should not be more than 5 MB" : ""}</div>
          {loading ? <Loader2 className="animate-spin h-12 w-12 mb-4" /> : <></>}
            <div className="flex justify-center mb-4">
              <img
                src={URL.createObjectURL(selectedLogoImage)}
                alt="Selected Logo"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <p className="text-center">Confirm to update your logo?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button disabled={selectedLogoImage.size > 5 * 1024 * 1024} onClick={handleConfirmLogo} className="bg-[#229799] text-white px-4 py-2 rounded">Confirm</button>
              <button onClick={handleCancelLogo} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
            </div>d
          </div>
        </div>
      )}
    </div>
  )
}