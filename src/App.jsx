import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './code/context/AuthContext';
import { PaymentProvider } from './code/context/PaymentContext';
import { FetchProvider } from './code/context/FetchContext';
import { StateProvider } from './code/context/StateContext';
import './App.css';
import MainLanding from './code/pages/MainLanding';
import HelperProfile from './code/pages/HelperProfile';
import CustomerProfile from './code/pages/CustomerProfile';
import OwnerProfile from './code/pages/OwnerProfile';
import PaymentPage from './code/pages/PaymentPage';
import Login from './code/pages/Login';
import ReviewPage from './code/components/ReviewCard';
import PaymentSuccess from './code/pages/PaymentSucess';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import night from "./assets/night.jpg";
import CouponSuccess from './code/popups/CouponSuccess';
import PaymentUnsuccessful from './code/pages/PaymentUnsuccessful';
import Random from './Random';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const notify = () => toast("Wow so easy!");

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user || user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <FetchProvider>
          <StateProvider>
            <ThemeProvider theme={theme}>
              <div className='bg-gray-bg font-poppins w-full min-h-screen'>
                <Routes>
                  <Route path="/" element={<MainLanding />} />
                  <Route path="/random" element={<Random />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/staff"
                    element={
                      <ProtectedRoute requiredRole="staff">
                        <HelperProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer"
                    element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/store"
                    element={
                      <ProtectedRoute requiredRole="store">
                        <OwnerProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/pay/:storeId" element={<PaymentPage />} />
                  <Route path="/payment-success/:storeId" element={<PaymentSuccess />} />
                  <Route path="/payment-error/:storeId" element={<PaymentUnsuccessful />} />
                  <Route
                    path="/review"
                    element={
                      <div className='h-screen flex relative bg-cover bg-center' style={{ backgroundImage: `url(${night})` }}>
                        <ReviewPage />
                      </div>
                    }
                  />
                  <Route
                    path="/coupon-success"
                    element={
                      <div className='h-screen flex relative bg-cover bg-center' style={{ backgroundImage: `url(${night})` }}>
                        <CouponSuccess />
                      </div>
                    }
                  />
                </Routes>
              </div>
            </ThemeProvider>
          </StateProvider>
        </FetchProvider>
      </PaymentProvider>
    </AuthProvider>
  );
}

export default App;