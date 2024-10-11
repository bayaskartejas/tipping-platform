import React from 'react'
import { ChevronLeft } from 'lucide-react'
import ProfileHeader from './ProfileHeader'
import RatingAndReviews from './RatingAndReviews'
import PerformanceGraph from './PerformanceGraph'

export default function HelperProfile({ onGoBack, user }) {
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
        <ProfileHeader />
        <RatingAndReviews />
        <PerformanceGraph />
      </div>
    </div>
  )
}