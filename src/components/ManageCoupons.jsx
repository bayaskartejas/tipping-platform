import React from 'react'
import { X } from 'lucide-react'

export default function ManageCoupons({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-popup">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Manage Coupons</h2>
        {/* Content for managing coupons will be added here later */}
      </div>
    </div>
  )
}