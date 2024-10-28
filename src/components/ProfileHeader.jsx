import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Edit2, Check, X } from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function ProfileHeader({ staffData, fetchStaffData, imageUrls }) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [name, setName] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(file)
        setShowConfirmation(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirmImage = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/api/staff/update-logo', {
        logoFile: selectedImage ? {
          contentType: selectedImage.type
        } : null,
        number: staffData.number
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })

      await axios.put(response.data.logoPutUrl, selectedImage, {
        headers: { 'Content-Type': selectedImage.type }
      })
      setShowConfirmation(false)
      setLoading(false)
      window.location.reload();
    } catch (error) {
      console.error('Error updating logo:', error)
    }
  }

  const handleCancelImage = () => {
    setLoading(false)
    setSelectedImage(null)
    setShowConfirmation(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={imageUrls}
            alt="Helper Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          {isHovered && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <Edit2 className="text-white" size={24} />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-800">{staffData ? staffData.name : "Heello"}</h1>
              </div>
          </div>
          {/* Ensure this div has no width issue */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="Collected Tips" value="$1,234.56" />
            <Card title="Payout" value="$987.65" />
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className='text-red-600'>{selectedImage.size > 5 * 1024 * 1024 ? "File size should not be more than 5 MB" : ""}</div>
          {loading ? <Loader2 className="animate-spin h-12 w-12 mb-4" /> : <></>}
            <div className="flex justify-center mb-4">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Image"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <p className="text-center">Confirm to update your logo?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button disabled={selectedImage.size > 5 * 1024 * 1024} onClick={handleConfirmImage} className="bg-[#229799] text-white px-4 py-2 rounded">Confirm</button>
              <button onClick={handleCancelImage} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-100 rounded-lg p-4 flex-1">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <p className="text-2xl font-bold text-[#229799]">{value}</p>
    </div>
  )
}
