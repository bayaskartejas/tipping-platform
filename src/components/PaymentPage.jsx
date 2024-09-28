import React, { useState, useEffect } from 'react'
import { ChevronLeft, Star, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import axios from 'axios'

const helpers = [
  { id: 1, name: 'Alice', rating: 4.5, photo: '/placeholder.svg?height=100&width=100', upiId: 'alice@upi' },
  { id: 2, name: 'Bob', rating: 4.2, photo: '/placeholder.svg?height=100&width=100', upiId: 'bob@upi' },
  { id: 3, name: 'Charlie', rating: 4.8, photo: '/placeholder.svg?height=100&width=100', upiId: 'charlie@upi' },
  { id: 4, name: 'Diana', rating: 4.3, photo: '/placeholder.svg?height=100&width=100', upiId: 'diana@upi' },
  { id: 5, name: 'Eva', rating: 4.6, photo: '/placeholder.svg?height=100&width=100', upiId: 'eva@upi' },
  { id: 6, name: 'Frank', rating: 4.1, photo: '/placeholder.svg?height=100&width=100', upiId: 'frank@upi' },
  { id: 7, name: 'Grace', rating: 4.7, photo: '/placeholder.svg?height=100&width=100', upiId: 'grace@upi' },
  { id: 8, name: 'Henry', rating: 4.4, photo: '/placeholder.svg?height=100&width=100', upiId: 'henry@upi' },
  { id: 9, name: 'Ivy', rating: 4.9, photo: '/placeholder.svg?height=100&width=100', upiId: 'ivy@upi' },
  { id: 10, name: 'Jack', rating: 4.0, photo: '/placeholder.svg?height=100&width=100', upiId: 'jack@upi' },
]

export default function PaymentPage({ onGoBack }) {
  const [billAmount, setBillAmount] = useState('')
  const [tipAmount, setTipAmount] = useState(0)
  const [customTip, setCustomTip] = useState('')
  const [selectedHelper, setSelectedHelper] = useState(null)
  const [currentHelperIndex, setCurrentHelperIndex] = useState(0)

  const handleBillAmountChange = (e) => {
    const value = e.target.value
    setBillAmount(value === '' ? '' : Math.max(0, parseFloat(value)))
  }

  const handleTipSliderChange = (e) => {
    setTipAmount(parseInt(e.target.value))
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
    try {
      const response = await axios.post('/api/process-payment', {
        billAmount,
        tipAmount,
        helperUpiId: selectedHelper ? selectedHelper.upiId : null,
      })
      console.log('Payment processed:', response.data)
      // Handle successful payment (e.g., show success message, redirect)
    } catch (error) {
      console.error('Payment failed:', error)
      // Handle payment failure (e.g., show error message)
    }
  }

  const totalAmount = (parseFloat(billAmount) || 0) + (parseFloat(tipAmount) || 0)

  const nextHelper = () => {
    setCurrentHelperIndex((prevIndex) => (prevIndex + 1) % helpers.length)
  }

  const prevHelper = () => {
    setCurrentHelperIndex((prevIndex) => (prevIndex - 1 + helpers.length) % helpers.length)
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
        <ProfileHeader />
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label htmlFor="billAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Bill Amount
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="billAmount"
                id="billAmount"
                className="block bg-slate-100 h-10 border-2 w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-[#229799] focus:ring-[#229799] sm:text-sm"
                placeholder="Bill Amount in ₹"
                value={billAmount}
                onChange={handleBillAmountChange}
                min="0"
              />
            </div>
          </div>
          <div>
            <label htmlFor="tipAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Tip Amount: <strong className='font-semibold'>₹{tipAmount}</strong>
            </label>
            <input
              type="range"
              name="tipAmount"
              id="tipAmount"
              min="0"
              max="100"
              value={tipAmount}
              onChange={handleTipSliderChange}
              className={`w-full h-2  bg-gray-200 rounded-lg appearance-none cursor-pointer ${
                customTip !== '' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={customTip !== ''}
            />
            <div className="flex justify-between mt-2">
              <span>₹0</span>
              <span>₹100</span>
            </div>
          </div>
          <div>
            <label htmlFor="customTip" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Tip
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="customTip"
                id="customTip"
                className="border-2 h-10 bg-slate-100 block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-[#229799] focus:ring-[#229799] sm:text-sm"
                placeholder="Custom Tip"
                value={customTip}
                onChange={handleCustomTipChange}
                min="0"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Helper</h3>
            <div className="relative">
              <div className="flex items-center justify-center space-x-4 overflow-hidden">
                {!selectedHelper && (
                  <button
                    onClick={prevHelper}
                    className="absolute left-0 z-10 bg-white bg-opacity-50 p-2 rounded-full shadow-md"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                {[
                  helpers[(currentHelperIndex - 1 + helpers.length) % helpers.length],
                  helpers[currentHelperIndex],
                  helpers[(currentHelperIndex + 1) % helpers.length],
                ].map((helper, index) => (
                  <div
                    key={helper.id}
                    className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${
                      index === 1 ? 'scale-110 z-10' : 'scale-90 opacity-50'
                    } ${selectedHelper && selectedHelper.id !== helper.id ? 'hidden' : ''}`}
                    onClick={() => handleHelperSelect(helper)}
                  >
                    <img
                      src={helper.photo}
                      alt={helper.name}
                      className="w-20 h-20 rounded-full object-cover mb-2"
                    />
                    <span className="font-medium">{helper.name}</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{helper.rating}</span>
                    </div>
                  </div>
                ))}
                {!selectedHelper && (
                  <button
                    onClick={nextHelper}
                    className="absolute right-0 z-10 bg-white bg-opacity-50 p-2 rounded-full shadow-md"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>
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
            disabled={totalAmount === 0}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#229799] hover:bg-[#1b7b7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#229799] ${
              totalAmount === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Pay ₹{totalAmount.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileHeader() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url("/placeholder.svg?height=200&width=800")` }}
      ></div>
      <div className="p-6 -mt-16 relative">
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
          <img
            src="/placeholder.svg?height=100&width=100"
            alt="Owner Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">John Doe</h1>
            <h2 className="text-lg text-gray-600">Tasty Bites Restaurant</h2>
            <p className="text-sm text-gray-500 mt-1">UPI: tastybites@upi</p>
            <div className="flex items-center justify-center md:justify-start mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-600">4.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}