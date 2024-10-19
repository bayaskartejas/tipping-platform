import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Star, ChevronRight, IndianRupee, CreditCard } from 'lucide-react'
import axios from 'axios'
import default_person from "../assets/default-person.png"
import Slider from "react-slick"
import ReactSlider from 'react-slider'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function PaymentPage() {
  const { storeId } = useParams()
  const navigate = useNavigate()
  const [billAmount, setBillAmount] = useState('')
  const [tipAmount, setTipAmount] = useState(0)
  const [customTip, setCustomTip] = useState('')
  const [selectedHelper, setSelectedHelper] = useState(null)
  const [helpers, setHelpers] = useState([])
  const [store, setStore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showGlow, setShowGlow] = useState(false)
  const sliderRef = useRef(null)

  useEffect(() => {
    fetchStoreAndHelpers()
  }, [storeId])

  const fetchStoreAndHelpers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('Fetching store and helpers for storeId:', storeId)
      const storeResponse = await axios.get(`http://localhost:3000/api/store/${storeId}`)
      console.log('Store data:', storeResponse.data)
      setStore(storeResponse.data)
      const helpersResponse = await axios.get(`http://localhost:3000/api/staff/store/${storeId}`)
      console.log('Helpers data:', helpersResponse.data)
      setHelpers(helpersResponse.data)
    } catch (error) {
      console.error('Error fetching store and helpers:', error)
      setError('Failed to load data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onGoBack = () => {
    navigate('/')
  }

  const handleBillAmountChange = (e) => {
    const value = e.target.value
    setBillAmount(value === '' ? '' : Math.max(0, parseFloat(value)))
  }

  const handleTipSliderChange = (value) => {
    setTipAmount(value)
    setCustomTip('')
  }

  const handleCustomTipChange = (e) => {
    const value = e.target.value
    setCustomTip(value)
    setTipAmount(value === '' ? 0 : Math.max(0, parseInt(value)))
  }

  const handleHelperSelect = (helper) => {
    setSelectedHelper(helper)
  }

  const handlePayment = async () => {
    if (totalAmount === 0 || selectedHelper == null) {
      setShowGlow(true)
      setTimeout(() => setShowGlow(false), 1000)
      return
    }

    try {
      const response = await axios.post('http://localhost:3000/api/transaction/upi-payment', {
        storeId: parseInt(storeId),
        staffId: selectedHelper ? selectedHelper.id : null,
        bill: parseFloat(billAmount),
        tip: parseFloat(tipAmount),
        customerName: '', // Add customer details if available
        customerEmail: '',
        customerPhone: '',
      })
      console.log('Payment initiated:', response.data)
      // Handle successful payment initiation (e.g., show QR code, redirect to UPI app)
    } catch (error) {
      console.error('Payment initiation failed:', error)
      // Handle payment initiation failure (e.g., show error message)
    }
  }

  const totalAmount = (parseFloat(billAmount) || 0) + (parseFloat(tipAmount) || 0)

  const sliderSettings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
    beforeChange: (current, next) => handleHelperSelect(helpers[next]),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
        }
      }
    ]
  }

  const nextSlide = () => {
    sliderRef.current.slickNext()
  }

  const prevSlide = () => {
    sliderRef.current.slickPrev()
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
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
        {store && <ProfileHeader store={store} />}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label htmlFor="billAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Bill Amount
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="billAmount"
                id="billAmount"
                className="block w-full rounded-md border-gray-300 pl-10 pr-12 h-8 border-2 focus:border-[#229799] focus:ring-[#229799] sm:text-sm"
                placeholder="Enter bill amount"
                value={billAmount}
                onChange={handleBillAmountChange}
                min="0"
              />
            </div>
          </div>
          <div>
            <label htmlFor="tipAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Tip Amount: ₹{tipAmount}
            </label>
            <ReactSlider
              className="w-full h-10 flex items-center mt-7"
              thumbClassName="w-6 h-6 bg-[#229799] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#229799] cursor-pointer"
              trackClassName="h-2 bg-gray-200 rounded-md"
              min={0}
              max={100}
              value={tipAmount}
              onChange={handleTipSliderChange}
              renderThumb={(props, state) => (
                <div {...props}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#229799] text-white px-2 py-1 rounded text-xs">
                    ₹{state.valueNow}
                  </div>
                </div>
              )}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>₹0</span>
              <span>₹100</span>
            </div>
          </div>
          <div>
            <label htmlFor="customTip" className=" block text-sm font-medium text-gray-700 mb-1">
              Custom Tip
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none  absolute inset-y-0 left-0 flex items-center pl-3">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="customTip"
                id="customTip"
                className="block h-8 border-2 w-full rounded-md border-gray-300 pl-10 pr-12 focus:border-[#229799] focus:ring-[#229799] sm:text-sm"
                placeholder="Enter custom tip"
                value={customTip}
                onChange={handleCustomTipChange}
                min="0"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Helper</h3>
            <div className={`relative rounded-lg ${showGlow ? 'animate-glow' : ''}`}>
              {helpers.length > 0 ? (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 p-2 rounded-full shadow-md"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <Slider ref={sliderRef} {...sliderSettings}>
                    {helpers.map((helper) => (
                      <div key={helper.id} className="px-2">
                        <div className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${
                          selectedHelper && selectedHelper.id === helper.id ? 'scale-110 z-10' : 'scale-90 opacity-50'
                        }`}>
                          <img
                            src={helper.photo || default_person}
                            alt={helper.name}
                            className="w-20 h-20 rounded-full object-cover mb-2"
                          />
                          <span className="font-medium">{helper.name}</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1">{helper.avgRating ? helper.avgRating.toFixed(1) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 p-2 rounded-full shadow-md"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              ) : (
                <div>No helpers available</div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Price Breakup</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Bill Amount:</span>
                <span>₹{billAmount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip Amount:</span>
                <span>₹{tipAmount || 0}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#229799] hover:bg-[#1b7b7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#229799] ${
              totalAmount === 0 || selectedHelper == null ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <CreditCard className="inline-block mr-2" size={20} />
            Pay ₹{totalAmount.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileHeader({ store }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url("${store.coverPhoto || '/placeholder.svg?height=200&width=800'}")` }}
      ></div>
      <div className="p-6 -mt-16 relative">
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={store.logo || '/placeholder.svg?height=100&width=100'}
            alt="Store Logo"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{store.name}</h1>
            <h2 className="text-lg text-gray-600">{store.address}</h2>
            <p className="text-sm text-gray-500 mt-1">UPI: {store.ownerUpi}</p>
            <div className="flex items-center justify-center md:justify-start mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-600">{store.avgRating ? store.avgRating.toFixed(1) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}