import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Edit2, Check, X, Camera, Edit } from 'lucide-react'
import defaultPerson from "../../assets/default-person.png"
import { Loader2 } from 'lucide-react'


export default function ProfileHeaderO({storeData, imageUrls, profileData}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isCoverHovered, setIsCoverHovered] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedCoverImage, setSelectedCoverImage] = useState(null)
  const [selectedImagePath, setSelectedImagePath] = useState(null)
  const [selectedCoverImagePath, setSelectedCoverImagePath] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCoverConfirmation, setShowCoverConfirmation] = useState(false)
  const [storeName, setStoreName] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingStoreName, setIsEditingStoreName] = useState(false)
  const [tempName, setTempName] = useState("")
  const [tempStoreName, setTempStoreName] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const coverFileInputRef = useRef(null)

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(file)
        setSelectedImagePath(reader.result)
        setShowConfirmation(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedCoverImage(file)
        setSelectedCoverImagePath(reader.result)
        setShowCoverConfirmation(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirmImage = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('storeId', localStorage.getItem("storeId"))
      formData.append('ownerPhotoFile', selectedImage)

      const response = await axios.post('https://tipnex-server.tipnex.com/api/store/update-ownerPhoto', {
        ownerPhotoFile: selectedImage ? {
          contentType: selectedImage.type
        } : null,
        storeId : storeData.storeId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Upload the image to the provided URL
      await axios.put(response.data.ownerPhotoPutUrl, selectedImage, {
        headers: { 'Content-Type': selectedImage.type }
      })

      setShowConfirmation(false)
      setLoading(false)
      // Refresh the page or update the image URL
      window.location.reload()
    } catch (error) {
      console.error('Error updating image:', error)
    }
  }

  const handleConfirmCoverImage = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('storeId', localStorage.getItem("storeId"))
      formData.append('coverFile', selectedCoverImage)

      const response = await axios.post('https://tipnex-server.tipnex.com/api/store/update-cover', {
        cover: selectedCoverImage ? {
          contentType: selectedCoverImage.type
        } : null,
        storeId : storeData.storeId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Upload the image to the provided URL
      await axios.put(response.data.coverPutUrl, selectedCoverImage, {
        headers: { 'Content-Type': selectedCoverImage.type }
      })

      setShowCoverConfirmation(false)
      setLoading(false)
      // Refresh the page or update the image URL
      window.location.reload()
    } catch (error) {
      console.error('Error updating cover image:', error)
    }
  }

  const handleCancelImage = () => {
    setLoading(false)
    setSelectedImage(null)
    setSelectedImagePath(null)
    setShowConfirmation(false)
  }

  const handleCancelCoverImage = () => {
    setLoading(false)
    setSelectedCoverImage(null)
    setSelectedCoverImagePath(null)
    setShowCoverConfirmation(false)
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

  const handleEditStoreName = () => {
    setIsEditingStoreName(true)
    setTempStoreName(storeName)
  }

  const handleSaveStoreName = async () => {
    try {
      await axios.post('/api/update-store-name', { storeName: tempStoreName })
      setStoreName(tempStoreName)
      setIsEditingStoreName(false)
    } catch (error) {
      console.error('Error updating store name:', error)
    }
  }

  const handleCancelStoreNameEdit = () => {
    setIsEditingStoreName(false)
    setTempStoreName("")
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="relative h-48 bg-cover bg-center bg-slate-200"
        style={{ backgroundImage: `url(${imageUrls.coverUrl || "/placeholder.svg?height=200&width=800"})` }}
        onMouseEnter={() => setIsCoverHovered(true)}
        onMouseLeave={() => setIsCoverHovered(false)}
      >
        {isCoverHovered && (
          <div
            className="absolute inset-0 flex text-white items-center justify-center bg-black bg-opacity-50 cursor-pointer"
            onClick={() => coverFileInputRef.current.click()}
          > 
            Add a cover image
            <Camera className="text-white ml-2" size={24} />
          </div>
        )}
        <input
          type="file"
          ref={coverFileInputRef}
          onChange={handleCoverImageChange}
          className="hidden"
          accept="image/*"
        />
      </div>
      <div className="p-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={imageUrls.ownerPhotoUrl || defaultPerson}
              alt="Owner Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg z-20"
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
          <div className="flex items-center space-x-2 mt-2">
  {isEditingName ? (
    <>
      <input
        type="text"
        value={tempName}
        onChange={(e) => setTempName(e.target.value)}
        className="w-40 sm:w-64 text-2xl font-bold text-gray-800 border-b-2 border-[#229799] focus:outline-none bg-transparent"
      />
      <button onClick={handleSaveName} className="text-[#229799] hover:text-[#1b7b7d]">
        <Check size={20} />
      </button>
      <button onClick={handleCancelNameEdit} className="text-red-500 hover:text-red-600">
        <X size={20} />
      </button>
    </>
  ) : (
    <>
      <h1 className="text-2xl font-bold text-gray-800">{profileData.ownerName}</h1>
      <button className="text-[#229799] hover:text-[#1b7b7d]"></button>
    </>
  )}
</div>
<div className="flex items-center space-x-2 mt-2">
  {isEditingStoreName ? (
    <>
      <input
        type="text"
        value={tempStoreName}
        onChange={(e) => setTempStoreName(e.target.value)}
        className="w-40 sm:w-64 text-lg text-gray-600 border-b-2 border-[#229799] focus:outline-none bg-transparent"
      />
      <button onClick={handleSaveStoreName} className="text-[#229799] hover:text-[#1b7b7d]">
        <Check size={20} />
      </button>
      <button onClick={handleCancelStoreNameEdit} className="text-red-500 hover:text-red-600">
        <X size={20} />
      </button>
    </>
  ) : (
    <>
      <h2 className="text-lg text-gray-600">{profileData.ownerUpi}</h2>
      <button className="text-[#229799] hover:text-[#1b7b7d]">
      </button>
    </>
  )}
</div>

          </div>
        </div>
      </div>
      {/* Confirmation modals */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            {loading ? <Loader2 className="animate-spin h-12 w-12 mb-4" /> : <></>}
            <div className="flex justify-center mb-4">
              <img
                src={selectedImagePath}
                alt="Selected Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <p className="text-center">Confirm to update your profile image?</p>
            <div className="flex justify-center space-x-4 mt-2">
              <button onClick={handleConfirmImage} className="bg-[#229799] text-white px-4 py-2 rounded">Confirm</button>
              <button onClick={handleCancelImage} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showCoverConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          {loading ? <Loader2 className="animate-spin h-12 w-12 mb-4" /> : <></>}
            <div className="flex justify-center mb-4">
              <img
                src={selectedCoverImagePath}
                alt="Selected Cover"
                className="w-full h-48 object-cover"
              />
            </div>
            <p className="text-center">Confirm to update your cover image?</p>
            <div className="flex justify-center space-x-4 mt-2">
              <button onClick={handleConfirmCoverImage} className="bg-[#229799] text-white px-4 py-2 rounded">Confirm</button>
              <button onClick={handleCancelCoverImage} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}