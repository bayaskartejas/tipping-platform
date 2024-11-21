import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, ChevronRight, IndianRupee, CreditCard, X, Ticket, ChevronDown, Receipt, Clock, MapPin, Phone, HomeIcon } from 'lucide-react';
import axios from 'axios';
import Slider from "react-slick";
import CouponPopup from './CouponPopup';
import { Slider as MUISlider, Tooltip, Paper } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from 'framer-motion';

function ValueLabelComponent(props) {
  const { children, value } = props;
  return (
    <Tooltip enterTouchDelay={0} placement="top" title={`₹${value}`}>
      {children}
    </Tooltip>
  );
}

export default function PaymentPage({ setAmount, setTransaction_id, setPayment_mode, setReceivers_name, setDateAndTime }) {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [billAmount, setBillAmount] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [helpers, setHelpers] = useState([]);
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGlow, setShowGlow] = useState(false);
  const sliderRef = useRef(null);
  const [imageUrls, setImageUrls] = useState("");
  const [staffUrls, setStaffUrls] = useState({});
  const [isPriceBreakupOpen, setIsPriceBreakupOpen] = useState(false);
  const [recommendedTip, setRecommendedTip] = useState(0);
  const [processingCharge, setProcessingCharge] = useState(0);
  const [savings, setSavings] = useState(0);

  // State variables for coupons
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponList, setShowCouponList] = useState(false);

  useEffect(() => {
    localStorage.clear();
    fetchStoreAndHelpers();
  }, [storeId]);

  useEffect(() => {
    if (billAmount && selectedHelper) {
      const amount = parseFloat(billAmount);
      if (amount <= 500) {
        setRecommendedTip(20);
      } else if (amount <= 2000) {
        setRecommendedTip(50);
      } else {
        setRecommendedTip(100);
      }
    } else {
      setRecommendedTip(0);
    }
  }, [billAmount, selectedHelper]);

  useEffect(() => {
    const discount = calculateDiscount();
    if (discount < 20) {
      setProcessingCharge(0);
    } else if (discount <= 50) {
      setProcessingCharge(2);
    } else {
      setProcessingCharge(5);
    }
    setSavings(discount - processingCharge);
  }, [selectedCoupon, billAmount]);

  const fetchStoreAndHelpers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const imageUrlsResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/image-urls/${storeId}`);
      setImageUrls(imageUrlsResponse.data);
      const staffUrlsResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/staff-image-urls/${storeId}`);
      setStaffUrls(staffUrlsResponse.data.staffPhotoUrls);
      const storeResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/${storeId}`);
      setStore(storeResponse.data);
      const helpersResponse = await axios.get(`https://tipnex-server.tipnex.com/api/staff/store/${storeId}`);
      setHelpers(helpersResponse.data);
    } catch (error) {
      console.error('Error fetching store and helpers:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onGoBack = () => {
    navigate('/');
  };

  const handleBillAmountChange = (e) => {
    const value = e.target.value;
    setBillAmount(value === '' ? '' : Math.max(0, parseFloat(value)));
    if (selectedCoupon && selectedCoupon.minimumPurchase > parseFloat(value)) {
      setSelectedCoupon(null);
    }
  };

  const handleTipSliderChange = (_, newValue) => {
    setTipAmount(newValue);
    setCustomTip('');
  };

  const handleCustomTipChange = (e) => {
    const value = e.target.value;
    setCustomTip(value);
    setTipAmount(value === '' ? 0 : Math.max(0, parseInt(value)));
  };

  const handleHelperSelect = (helper) => {
    setSelectedHelper(helper);
  };

  const handlePayment = async () => {
    if (totalAmount === 0 || (selectedHelper == null && helpers.length > 0)) {
      setShowGlow(true);
      setTimeout(() => setShowGlow(false), 1000);
      return;
    }

    try {
      if (selectedCoupon) {
        await axios.post(`https://tipnex-server.tipnex.com/api/customer/update-coupon/${storeId}`, {
          phone: phoneNumber,
          couponId: selectedCoupon.id
        });
      }
      localStorage.setItem("storeId", storeId);
      localStorage.setItem("staffId", selectedHelper.id);
      localStorage.setItem("phone", phoneNumber);
      setTransaction_id("T" + (Math.floor(Math.random() * 100000000)));
      setPayment_mode("UPI");
      setReceivers_name(selectedHelper.name);
      setDateAndTime(Date.now());
      navigate(`/payment-success/${storeId}`);
    } catch (error) {
      console.error('Error updating coupon usage:', error);
      alert('Error processing payment. Please try again.');
    }
  };

  const calculateDiscount = () => {
    if (!selectedCoupon) return 0;
    if (selectedCoupon.discountType === 'percentage') {
      return (parseFloat(billAmount) * selectedCoupon.discountValue) / 100;
    } else {
      return selectedCoupon.discountValue;
    }
  };

  const totalAmount = (parseFloat(billAmount) || 0) + (parseFloat(tipAmount) || 0) - calculateDiscount() + processingCharge;
  setAmount(totalAmount);

  const handleUseCoupons = () => {
    setShowCouponPopup(true);
  };

  const handleFetchCoupons = useCallback(async (phoneNumber) => {
    try {
      setPhoneNumber(phoneNumber);
      const response = await axios.get(`https://tipnex-server.tipnex.com/api/customer/get-coupon-info/${storeId}`, {
        params: { phone: phoneNumber }
      });
      setCoupons(response.data.coupons);
      setShowCouponList(true);
      setShowCouponPopup(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('User not found. Please create an account first.');
      } else {
        console.error('Error fetching coupons:', error);
        alert('Failed to fetch coupons. Please try again.');
      }
    }
  }, [storeId]);

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setShowCouponList(false);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
  };

  const handleCloseCouponPopup = useCallback(() => {
    setShowCouponPopup(false);
  }, []);

  const handleRecommendedTip = () => {
    setTipAmount(recommendedTip);
    setCustomTip('');
  };

  const sliderSettings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
    beforeChange: (current, next) => handleHelperSelect(helpers[next]),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
        }
      }
    ]
  };

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Back Button */}
        <button
          onClick={onGoBack}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <HomeIcon size={20}/>
          <span className="ml-2 text-sm">Tipnex</span>
        </button>

        {/* Store Profile */}
        {store && (
          <Paper elevation={0} className="p-4 rounded-xl">
            <div className="flex items-center space-x-4">
              <img
                src={imageUrls.logoUrl || '/placeholder.svg?height=100&width=100'}
                alt={store.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h1 className="text-xl font-semibold">{store.name}</h1>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin size={16} className="mr-1" />
                  <span className="truncate">{store.address}</span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{store.avgRating ? store.avgRating.toFixed(1) : 'N/A'}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span>Open</span>
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        )}

        {/* Bill Amount */}
        <Paper elevation={0} className="p-4 rounded-xl">
          <label className="text-sm font-medium text-gray-700">Bill Amount</label>
          <div className="mt-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <IndianRupee className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={billAmount}
              onChange={handleBillAmountChange}
              className="block w-full pl-10 pr-3 py-3 text-lg border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="0.00"
            />
          </div>
        </Paper>

          {/* Helper Selection */}
          {helpers.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Choose Helper</h3>
              <div className="relative">
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white shadow-lg border border-gray-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <Slider ref={sliderRef} {...sliderSettings}>
                  {helpers.map((helper) => (
                    <div key={helper.id} className="px-2">
                      <motion.div
                        className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                          selectedHelper && selectedHelper.id === helper.id 
                            ? 'scale-105 bg-teal-50' 
                            : 'scale-95 opacity-60'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="relative">
                          <img
                            src={staffUrls ? staffUrls[helper.id] : default_person}
                            alt={helper.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          {selectedHelper && selectedHelper.id === helper.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 border-2 border-teal-500 rounded-full"
                            />
                          )}
                        </div>
                        <span className="mt-2 text-sm font-medium">{helper.name}</span>
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="ml-1 text-xs text-gray-600">
                            {helper.avgRating ? helper.avgRating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </Slider>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white shadow-lg border border-gray-100"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        {/* Tip Section - Only show if helper is selected */}
        {selectedHelper && (
          <Paper elevation={0} className="p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Tip Amount</h3>
              <span className="text-teal-600">₹{tipAmount}</span>
            </div>
            
            <MUISlider
              value={tipAmount}
              onChange={handleTipSliderChange}
              valueLabelDisplay="auto"
              components={{
                ValueLabel: ValueLabelComponent,
              }}
              step={5}
              marks
              min={0}
              max={100}
              sx={{
                color: '#0D9488',
                '& .MuiSlider-thumb': {
                  width: 28,
                  height: 28,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(13, 148, 136, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  height: 2,     
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  opacity: 0.5,
                  backgroundColor: '#bfdbfe',
                },
                '& .MuiSlider-mark': {
                  backgroundColor: '#bfdbfe',
                  height: 8,
                  width: 20,
                  '&.MuiSlider-markActive': {
                    opacity: 1,
                    backgroundColor: 'currentColor',
                  },
                },
              }}
            />
            {recommendedTip > 0 && (
  
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex justify-between border-2 p-2 rounded-md"
              >
                <div className='text-teal-800 font-medium'>Recommened Tip: </div>
                <button
                  onClick={handleRecommendedTip}
                  className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-teal-200 transition-colors duration-200"
                >
                  ₹{recommendedTip}
                </button>
              </motion.div>
            )}

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Custom Tip</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={customTip}
                  onChange={handleCustomTipChange}
                  className="block w-full pl-10 pr-3 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </Paper>
        )}

        {/* Coupon Section */}
        <Paper elevation={0} className="p-4 rounded-xl">
          <button
            onClick={handleUseCoupons}
            className="w-full py-3 px-4 border-2 border-teal-500 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center"
          >
            <Ticket className="w-5 h-5 mr-2" />
            Use Coupons
          </button>

          {selectedCoupon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-teal-50 rounded-lg flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium text-teal-700">{selectedCoupon.title}</h4>
                <p className="text-sm text-teal-600">Code: {selectedCoupon.couponCode}</p>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="p-2 hover:bg-teal-100 rounded-full"
              >
                <X size={20} className="text-teal-700" />
              </button>
            </motion.div>
          )}
        </Paper>

        {/* Payment Summary */}
        <Paper elevation={0} className="rounded-xl overflow-hidden">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">₹{totalAmount.toFixed(2)}</span>
              <button
                onClick={() => setIsPriceBreakupOpen(!isPriceBreakupOpen)}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                View Detailed Bill
              </button>
            </div>

            {savings > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-teal-600"
              >
                ₹{savings.toFixed(2)} saved on the total!
              </motion.div>
            )}

            <AnimatePresence>
              {isPriceBreakupOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 text-sm border-t pt-4"
                >
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bill Amount</span>
                    <span>₹{billAmount || 0}</span>
                  </div>
                  {selectedHelper && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tip Amount</span>
                      <span>₹{tipAmount || 0}</span>
                    </div>
                  )}
                  {selectedCoupon && (
                    <>
                      <div className="flex justify-between text-teal-600">
                        <span>Discount</span>
                        <span>-₹{calculateDiscount().toFixed(2)}</span>
                      </div>
                      {processingCharge > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Processing Charge</span>
                          <span>₹{processingCharge.toFixed(2)}</span>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handlePayment}
              disabled={totalAmount === 0 || (selectedHelper == null && helpers.length > 0)}
              className={`w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 ${showGlow ? 'animate-pulse' : ''}`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Pay</span>
            </button>
          </div>
        </Paper>
      </div>
      {/* Popups */}
      <AnimatePresence>
        {showCouponPopup && (
          <CouponPopup 
            onClose={handleCloseCouponPopup} 
            onFetchCoupons={handleFetchCoupons} 
            setPhoneNumber={setPhoneNumber}
          />
        )}
        {showCouponList && <CouponList />}
      </AnimatePresence>

      <style jsx global>{`
        .helper-main-swiper {
          height: 300px;
        }
        .helper-thumb-swiper {
          height: 100px;
        }
        .swiper-slide-thumb-active {
          opacity: 1 !important;
          border: 2px solid #0D9488;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}