import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, ChevronRight, IndianRupee, CreditCard, X, Ticket, ChevronDown, Receipt, Clock, MapPin, Phone, HomeIcon, UserMinus } from 'lucide-react';
import axios from 'axios';
import Slider from "react-slick";
import CouponPopup from '../popups/CouponPopup';
import { Slider as MUISlider, Tooltip, Paper } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../assets/tipnex.png"

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

  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponList, setShowCouponList] = useState(false);

  const contentRef = useRef(null);

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

  useEffect(() => {
    if (contentRef.current) {
      if (selectedHelper) {
        contentRef.current.scrollTo({
          top: contentRef.current.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        contentRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedHelper]);

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
    if (totalAmount === 0) {
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
      localStorage.setItem("staffId", selectedHelper ? selectedHelper.id : null);
      localStorage.setItem("phone", phoneNumber);
      setTransaction_id("T" + (Math.floor(Math.random() * 100000000)));
      setPayment_mode("UPI");
      setReceivers_name(selectedHelper ? selectedHelper.name : store.name);
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

  const handleUnselectHelper = () => {
    setSelectedHelper(null);
    setTipAmount(0);
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
    ],
    arrows: false // Remove default arrows
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
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <div ref={contentRef} className="flex-grow overflow-y-auto p-4 pb-24">
        <div className="max-w-lg mx-auto space-y-4">
          <button
            onClick={onGoBack}
            className="flex items-center text-[#1a3ba2] hover:text-[#6d8ce7]"
          >
            <img src={logo} alt="Tipnex" className="h-6" />
          </button>

          {store && (
            <Paper elevation={0} className="rounded-xl">
              <div className='p-4'>
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
              </div>

              <div className="p-4 rounded-xl">
                <label className="text-sm font-medium text-[#1a3ba2]">Bill Amount</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <IndianRupee className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={billAmount}
                    onChange={handleBillAmountChange}
                    className="block w-full pl-10 pr-3 py-3 text-lg border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a3ba2] border-2"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </Paper>
          )}
          
          {helpers.length > 0 && (
            <motion.div
              animate={{
                y: selectedHelper ? 0 : '20%',
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#1a3ba2]">Choose Helper</h3>
                <AnimatePresence>
                  {selectedHelper && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={handleUnselectHelper}
                      className="flex items-center px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <UserMinus size={16} className="mr-1" />
                      Unselect
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
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
                            ? 'scale-105 bg-[#6d8ce7]/10' 
                            : 'scale-95 opacity-60'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="relative">
                          <img
                            src={staffUrls ? staffUrls[helper.id] : '/placeholder.svg?height=64&width=64'}
                            alt={helper.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          {selectedHelper && selectedHelper.id === helper.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 border-2 border-[#1a3ba2] rounded-full"
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
            </motion.div>
          )}

          {selectedHelper && (
            <Paper elevation={0} className="p-4 rounded-xl">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-medium">
                  Tip Amount paying to{' '}
                  <span className="text-[#1a3ba2]">{selectedHelper.name}</span>
                </h3>
                <span className="text-[#1a3ba2]">₹{tipAmount}</span>
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
                  color: '#1a3ba2',
                  '& .MuiSlider-thumb': {
                    width: 28,
                    height: 28,
                    backgroundColor: '#fff',
                    border: '2px solid currentColor',
                    '&:hover': {
                      boxShadow: '0 0 0 8px rgba(26, 59, 162, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    height: 2,     
                  },
                  '& .MuiSlider-rail': {
                    height: 4,
                    opacity: 0.5,
                    backgroundColor: '#6d8ce7',
                  },
                  '& .MuiSlider-mark': {
                    backgroundColor: '#6d8ce7',
                    height: 8,
                    width: 15,
                    '&.MuiSlider-markActive': {
                      opacity: 1,
                      backgroundColor: 'currentColor',
                    },
                  },
                }}
              />

              {recommendedTip > 0 && tipAmount === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex justify-between border-2 p-2 rounded-md"
                >
                  <div className="text-[#1a3ba2] font-medium">Recommended Tip: </div>
                  <button
                    onClick={handleRecommendedTip}
                    className="bg-[#6d8ce7]/10 text-[#1a3ba2] px-3 py-1 rounded-full text-sm font-medium hover:bg-[#6d8ce7]/20 transition-colors duration-200"
                  >
                    ₹{recommendedTip}
                  </button>
                </motion.div>
              )}

              <div className="mt-4 grid grid-cols-5 gap-3">
                <div className="col-span-5">
                  <label className="text-sm font-medium text-[#1a3ba2]">Custom Tip</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <IndianRupee className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={customTip}
                      onChange={handleCustomTipChange}
                      className="block w-full pl-8 pr-3 py-2 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a3ba2] border"
                      placeholder="Enter amount"  
                    />
                  </div>
                </div>
              </div>
            </Paper>
          )}
          <div className="">
            <label className="text-sm font-medium text-transparent">Coupons</label>
            <button
              onClick={handleUseCoupons}
              className="w-full h-[38px] border border-[#1a3ba2] rounded-lg text-[#1a3ba2] hover:bg-[#6d8ce7]/10 transition-colors flex items-center justify-center"
            >
              <Ticket className="w-4 h-4 mr-1" />
              <span className="text-sm"> Apply Coupons</span>
            </button>
          </div>

          {selectedCoupon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-[#6d8ce7]/10 rounded-lg flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium text-[#1a3ba2]">{selectedCoupon.title}</h4>
                <p className="text-sm text-[#1a3ba2]">Code: {selectedCoupon.couponCode}</p>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="p-2 hover:bg-[#6d8ce7]/20 rounded-full"
              >
                <X size={20} className="text-[#1a3ba2]" />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_12px_-2px_rgba(0,0,0,0.1)] rounded-t-xl">
        <div className="p-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="text-xl font-semibold">₹{totalAmount.toFixed(2)}</span>
              <button
                onClick={() => setIsPriceBreakupOpen(!isPriceBreakupOpen)}
                className="block text-sm text-[#1a3ba2] hover:text-[#6d8ce7] font-medium"
              >
                View Detailed Bill
              </button>
            </div>
            <button
              onClick={handlePayment}
              disabled={totalAmount === 0}
              className="flex-1 ml-4 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium rounded-2xl transition-all duration-200 text-center shadow-lg disabled:cursor-not-allowed"
            >
              Pay
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isPriceBreakupOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.3, ease: "easeInOut" }
                }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
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
                      <div className="flex justify-between text-[#1a3ba2]">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showCouponPopup && (
          <CouponPopup 
            onClose={handleCloseCouponPopup} 
            onFetchCoupons={handleFetchCoupons} 
            setPhoneNumber={setPhoneNumber}
          />
        )}
        {showCouponList && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Coupons</h3>
              {coupons.filter(coupon => parseFloat(billAmount) >= coupon.minimumPurchase).map((coupon) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-100 rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSelectCoupon(coupon)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-[#1a3ba2]">{coupon.title}</h4>
                      <p className="text-sm text-gray-600">{coupon.description}</p>
                    </div>
                    <Ticket className="text-[#1a3ba2]" size={24} />
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>Discount: {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</p>
                    <p>Min. Purchase: ₹{coupon.minimumPurchase}</p>
                  </div>
                </motion.div>
              ))}
              <button
                onClick={() => setShowCouponList(false)}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a3ba2] hover:bg-[#6d8ce7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a3ba2]"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
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
          border: 2px solid #1a3ba2;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}