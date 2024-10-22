import React, { useState, useEffect } from 'react'
import { ChevronLeft, Ticket } from 'lucide-react'
import ProfileHeaderO from './ProfileHeaderO'
import StaffPerformanceGraph from './StaffPerformanceGraph'
import RestaurantReviews from './RestaurantReviews'
import ManageCoupons from './ManageCoupons'
import axios from 'axios'
import { 
  Typography, 
  Box, 
  Avatar, 
  Paper, 
  Alert
} from '@mui/material';

export default function OwnerProfile({ onGoBack, user }) {
  const [showManageCoupons, setShowManageCoupons] = useState(false)
  const [storeData, setStoreData] = useState(null)
  const [profileData, setProfileData] = useState(null);
  const [imageUrls, setImageUrls] = useState({ logoUrl: null, ownerPhotoUrl: null });
  const [error, setError] = useState(null);

  const fetchStoreData = async () => {
    const token = localStorage.getItem("token")
    console.log('Token before fetching:', token);
      try {
        const response = await axios.get('http://localhost:3000/api/store/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },{ storeId: localStorage.getItem("storeId")})
        setStoreData(response.data)
      } catch (error) {
        console.error('Error fetching store data:', error)
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
        const profileResponse = await axios.get(`http://localhost:3000/api/store/${storeId}`);
        setProfileData(profileResponse.data);

        const imageUrlsResponse = await axios.get(`http://localhost:3000/api/store/image-urls/${storeId}`);
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
  
  return (  
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1>Welcome, {user.name}</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center mb-4">
          <button
            onClick={onGoBack}
            className="flex items-center text-[#229799] hover:text-[#1b7b7d] transition-colors duration-300"
          >
            <ChevronLeft size={20} />
            <span className="ml-1">Go Back</span>
          </button>
        </div>
        <div className="relative">
          <ProfileHeaderO storeData={storeData} imageUrls={imageUrls} profileData={profileData}/>
          <button
            onClick={() => setShowManageCoupons(true)}
            className="absolute top-4 right-4 bg-[#229799] text-white sm:px-4 px-3 sm:py-2 py-1 rounded-md hover:bg-[#1b7b7d] transition-colors duration-300 flex items-center"
          >
            <Ticket className="mr-2" size={20} />
            Manage Coupons
          </button>
        </div>
        <StaffPerformanceGraph profileData={profileData}/>
        <RestaurantReviews />
      </div>
      {showManageCoupons && (
        <ManageCoupons onClose={() => setShowManageCoupons(false)} storeId={storeData?.id} />
      )}
    </div>
  )
}