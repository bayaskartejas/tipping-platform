import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Edit2, Check, X } from 'lucide-react'

export default function ProfileHeader() {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [name, setName] = useState("John Doe")
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState("")
  const fileInputRef = useRef(null)

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        setShowConfirmation(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirmImage = async () => {
    try {
      const formData = new FormData()
      formData.append('image', fileInputRef.current.files[0])

      await axios.post('/api/update-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setShowConfirmation(false)
    } catch (error) {
      console.error('Error updating profile image:', error)
    }
  }

  const handleCancelImage = () => {
    setSelectedImage(null)
    setShowConfirmation(false)
  }

  const handleEditName = () => {
    setIsEditingName(true)
    setTempName(name)
  }

  const handleSaveName = async () => {
    try {
      await axios.post('/api/update-profile-name', { name: tempName })
      setName(tempName)
      setIsEditingName(false)
    } catch (error) {
      console.error('Error updating profile name:', error)
    }
  }

  const handleCancelNameEdit = () => {
    setIsEditingName(false)
    setTempName("")
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
            src={selectedImage || "/placeholder.svg?height=100&width=100"}
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
            {isEditingName ? (
              <div className="flex items-center space-x-2 w-full max-w-xs flex-shrink-0">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="text-2xl font-bold text-gray-800 border-b-2 border-[#229799] focus:outline-none w-full"
                />
                <button onClick={handleSaveName} className="text-[#229799] hover:text-[#1b7b7d]">
                  <Check size={20} />
                </button>
                <button onClick={handleCancelNameEdit} className="text-red-500 hover:text-red-600">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
                <button onClick={handleEditName} className="text-[#229799] hover:text-[#1b7b7d]">
                  <Edit2 size={20} />
                </button>
              </div>
            )}
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
            <div className="flex justify-center mb-4">
              <img
                src={selectedImage}
                alt="Selected Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmImage}
                className="bg-[#229799] text-white px-4 py-2 rounded-md hover:bg-[#1b7b7d] transition-colors duration-300"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelImage}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-300"
              >
                Cancel
              </button>
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
