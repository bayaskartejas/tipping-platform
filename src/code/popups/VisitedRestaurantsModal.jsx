import React from 'react'
import { X } from 'lucide-react'
import { div } from 'framer-motion/client'

const visitedRestaurants = [
  { id: 1, name: "Tasty Bites", visits: 5 },
  { id: 2, name: "Burger Palace", visits: 3 },
  { id: 3, name: "Sushi Haven", visits: 2 },
  { id: 4, name: "Pizza Corner", visits: 4 },
  { id: 5, name: "Taco Fiesta", visits: 1 },
  { id: 6, name: "Noodle House", visits: 2 },
  { id: 7, name: "Steak & Grill", visits: 3 },
  { id: 8, name: "Salad Bar", visits: 1 },
  { id: 9, name: "Seafood Shack", visits: 2 },
  { id: 10, name: "Breakfast Spot", visits: 6 },
]

export default function VisitedRestaurantsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Visited Restaurants</h2>
        <ul className="space-y-2">
          {visitedRestaurants.length>0 ? <div>{visitedRestaurants.map((restaurant) => (
            <li key={restaurant.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="font-medium">{restaurant.name}</span>
              <span className="bg-[#229799] text-white px-2 py-1 rounded-full text-sm">
                {restaurant.visits} {restaurant.visits === 1 ? 'visit' : 'visits'}
              </span>
            </li>
          ))}</div>:<>No Restaurants visited</>}
        </ul>
      </div>
    </div>
  )
}