import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const CouponPopup = React.memo(({ onClose, onFetchCoupons }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneNumberChange = useCallback((e) => {
    setPhoneNumber(e.target.value);
  }, []);

  const handleFetchCoupons = useCallback(() => {
    onFetchCoupons(phoneNumber);
  }, [onFetchCoupons, phoneNumber]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Enter your phone number to fetch coupons</h3>
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6d8ce7] focus:border-[#6d8ce7]"
          placeholder="Phone number"
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6d8ce7]"
          >
            Cancel
          </button>
          <button
            onClick={handleFetchCoupons}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6d8ce7] hover:bg-[#1a3ba2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6d8ce7]"
          >
            Fetch Coupons
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default CouponPopup;