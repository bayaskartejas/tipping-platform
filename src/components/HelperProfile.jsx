import React, { useState, useEffect } from 'react'
import { ChevronLeft, LogOut } from 'lucide-react'
import ProfileHeader from './ProfileHeader'
import RatingAndReviews from './RatingAndReviews'
import PerformanceGraph from './PerformanceGraph'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Typography, Alert } from '@mui/material'
import LoadingOverlay from './LoadingOverlay'

export default function HelperProfile({ onGoBack }) {
const token = localStorage.getItem("token")
const [staffData, setStaffData] = useState()
const [profileData, setProfileData] = useState()
const [error, setError] = useState("")
const [imageUrls, setImageUrls] = useState("")
const [loading, setLoading] = useState()
const navigate = useNavigate()

const fetchStaffData = async () => {
  console.log('Token before fetching:', token);
    try {
      const response = await axios.get('http://localhost:3000/api/staff/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setStaffData(response.data)
      const imageUrlsResponse = await axios.get(`http://localhost:3000/api/staff/image-urls/${response.data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setImageUrls(imageUrlsResponse.data.photoUrl);
    } catch (error) {
      console.error('Error fetching staff data:', error)
      navigate("/")
    } 
  }

  useEffect(() => {
    fetchStaffData();
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
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
        <ProfileHeader staffData={staffData} fetchStaffData={fetchStaffData} imageUrls={imageUrls}/>
        <RatingAndReviews staffData={staffData}/>
        <PerformanceGraph />
      </div>
    </div>
  )
}