import React, { useState } from 'react'
import { ChevronLeft, Ticket } from 'lucide-react'
import ProfileHeaderO from './ProfileHeaderO'
import StaffPerformanceGraph from './StaffPerformanceGraph'
import RestaurantReviews from './RestaurantReviews'
import ManageCoupons from './ManageCoupons'

export default function OwnerProfile({ onGoBack }) {
  const [showManageCoupons, setShowManageCoupons] = useState(false)

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
        <div className="relative">
          <ProfileHeaderO />
          <button
            onClick={() => setShowManageCoupons(true)}
            className="absolute top-4 right-4 bg-[#229799] text-white sm:px-4 px-3 sm:py-2 py-1 rounded-md hover:bg-[#1b7b7d] transition-colors duration-300 flex items-center"
          >
            <Ticket className="mr-2" size={20} />
            Manage Coupons
          </button>
        </div>
        <StaffPerformanceGraph />
        <RestaurantReviews />
      </div>
      {showManageCoupons && (
        <ManageCoupons onClose={() => setShowManageCoupons(false)} />
      )}
    </div>
  )
}