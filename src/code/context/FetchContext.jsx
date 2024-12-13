import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const FetchContext = createContext();

export const useFetch = () => useContext(FetchContext);

const api = axios.create({
  baseURL: 'https://tipnex-server.tipnex.com/api',
});

export const FetchProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint, method = 'GET', data = null) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response;
      if (method === 'GET') {
        response = await api.get(endpoint, config);
      } else if (method === 'POST') {
        response = await api.post(endpoint, data, config);
      } else if (method === 'PUT') {
        response = await api.put(endpoint, data, config);
      } else if (method === 'DELETE') {
        response = await api.delete(endpoint, config);
      }

      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.response ? error.response.data : 'An error occurred');
      throw error;
    }
  };

  const getStoreAndHelpers = async (storeId) => {
    try {
      const [imageUrlsResponse, staffUrlsResponse, storeResponse, helpersResponse] = await Promise.all([
        fetchData(`/store/image-urls/${storeId}`),
        fetchData(`/store/staff-image-urls/${storeId}`),
        fetchData(`/store/${storeId}`),
        fetchData(`/staff/store/${storeId}`),
      ]);

      return {
        imageUrls: imageUrlsResponse,
        staffUrls: staffUrlsResponse.staffPhotoUrls,
        store: storeResponse,
        helpers: helpersResponse,
      };
    } catch (error) {
      console.error('Error fetching store and helpers:', error);
      throw error;
    }
  };

  const updateCouponUsage = async (storeId, phone, couponId) => {
    try {
      await fetchData(`/customer/update-coupon/${storeId}`, 'POST', { phone, couponId });
    } catch (error) {
      console.error('Error updating coupon usage:', error);
      throw error;
    }
  };

  const fetchCoupons = async (storeId, phone) => {
    try {
      const response = await fetchData(`/customer/get-coupon-info/${storeId}`, 'GET', { params: { phone } });
      return response.coupons;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  };

  return (
    <FetchContext.Provider value={{ loading, error, setError, fetchData, getStoreAndHelpers, updateCouponUsage, fetchCoupons }}>
      {children}
    </FetchContext.Provider>
  );
};