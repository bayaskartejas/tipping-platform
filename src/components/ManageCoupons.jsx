import React from 'react'
import { X } from 'lucide-react'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function ManageCoupons({ onClose, storeId }) {
  const [coupons, setCoupons] = useState([])
  const [newCoupon, setNewCoupon] = useState({ discount: '', validity: '' })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/coupon/store`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setCoupons(response.data)
    } catch (error) {
      console.error('Error fetching coupons:', error)
    }
  }
  const handleCreateCoupon = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/api/coupon/generate', {
        ...newCoupon,
        storeId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setCoupons([...coupons, response.data])
      setNewCoupon({ discount: '', validity: '' })
    } catch (error) {
      console.error('Error creating coupon:', error)
    }
  }
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
        <form onSubmit={handleCreateCoupon} className="mb-6">
          <div className="sm:flex space-x-4">
            <input
              type="number"
              placeholder="Discount (%)"
              value={newCoupon.discount}
              onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
              className="flex-1 p-2 border rounded w-32"
            />
            <input
              type="date"
              value={newCoupon.validity}
              onChange={(e) => setNewCoupon({ ...newCoupon, validity: e.target.value })}
              className="flex-1 p-2 border rounded w-32"
            />
          </div>
          <button type="submit" className="bg-[#229799] text-white px-4 py-2 rounded flex justify-center w-full mt-5">
              Create Coupon
            </button>
        </form>
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="border p-4 rounded">
              <p>Code: {coupon.code}</p>
              <p>Discount: {coupon.discount}%</p>
              <p>Valid until: {new Date(coupon.validity).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}