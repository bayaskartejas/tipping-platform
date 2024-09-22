import React, { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'

const coupons = [
  { id: 1, discount: 15, restaurantName: "Tasty Bites", validity: "2023-12-31", code: "TB15OFF2023" },
  { id: 2, discount: 20, restaurantName: "Burger Palace", validity: "2023-11-30", code: "BP20OFF2023" },
  { id: 3, discount: 10, restaurantName: "Sushi Haven", validity: "2023-10-31", code: "SH10OFF2023" },
  { id: 4, discount: 25, restaurantName: "Pizza Corner", validity: "2023-09-30", code: "PC25OFF2023" },
  { id: 5, discount: 30, restaurantName: "Taco Fiesta", validity: "2023-08-31", code: "TF30OFF2023" },
  { id: 6, discount: 15, restaurantName: "Noodle House", validity: "2023-07-31", code: "NH15OFF2023" },
  { id: 7, discount: 20, restaurantName: "Steak & Grill", validity: "2023-06-30", code: "SG20OFF2023" },
  { id: 8, discount: 10, restaurantName: "Salad Bar", validity: "2023-05-31", code: "SB10OFF2023" },
  { id: 9, discount: 25, restaurantName: "Seafood Shack", validity: "2023-04-30", code: "SS25OFF2023" },
  { id: 10, discount: 30, restaurantName: "Breakfast Spot", validity: "2023-03-31", code: "BS30OFF2023" },
]

export default function CouponsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Your Coupons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CouponCard({ coupon }) {
  const [showCode, setShowCode] = useState(false)

  // Function to generate random gradient with safe contrasting colors
  const getRandomGradient = () => {
    const gradients = [
      'from-pink-500 to-red-500',
      'from-green-500 to-teal-500',
      'from-blue-500 to-indigo-500',
      'from-purple-600 to-pink-600',
      'from-yellow-500 to-orange-500',
      'from-teal-500 to-cyan-500',
      'from-red-600 to-yellow-600',
      'from-indigo-600 to-blue-600',
    ]
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]
    return randomGradient
  }

  return (
    <div className={`relative bg-gradient-to-r ${getRandomGradient()} text-white rounded-lg p-4 shadow-md coupon-card`}>
      <div className="text-left">
        <h3 className="text-lg font-semibold mb-2">{coupon.restaurantName}</h3>
        <p className="text-4xl font-bold mb-2">{coupon.discount}% OFF</p>
        <p className="mb-2">Valid until: {coupon.validity}</p>
        <div className="flex items-center justify-between">
          <p className="font-mono">
            {showCode ? coupon.code : '*'.repeat(coupon.code.length)}
          </p>
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-white hover:text-gray-200"
          >
            {showCode ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
