import React, { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import ProfileHeaderC from './ProfileHeaderC'
import TransactionHistory from './TransactionHistory'
import CouponsModal from './CouponsModal'
import VisitedRestaurantsModal from './VisitedRestaurantsModal'

export default function CustomerProfile({ onGoBack }) {
  const [showCoupons, setShowCoupons] = useState(false)
  const [showVisitedRestaurants, setShowVisitedRestaurants] = useState(false)

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
        <ProfileHeaderC />
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowCoupons(true)}
            className="bg-[#229799] text-white px-4 py-2 rounded-md hover:bg-[#1b7b7d] transition-colors duration-300"
          >
            Coupons
          </button>
          <button
            onClick={() => setShowVisitedRestaurants(true)}
            className="bg-[#229799] text-white px-4 py-2 rounded-md hover:bg-[#1b7b7d] transition-colors duration-300"
          >
            Visited Restaurants
          </button>
        </div>
        <TransactionHistory />
        {showCoupons && <CouponsModal onClose={() => setShowCoupons(false)} />}
        {showVisitedRestaurants && <VisitedRestaurantsModal onClose={() => setShowVisitedRestaurants(false)} />}
      </div>
    </div>
  )
}