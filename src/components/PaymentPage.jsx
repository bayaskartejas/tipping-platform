import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, ChevronRight, IndianRupee, CreditCard, X, Ticket, ChevronDown, Receipt } from 'lucide-react';
import axios from 'axios';
import default_person from "../assets/default-person.png";
import Slider from "react-slick";
import CouponPopup from './CouponPopup';
import ReactSlider from 'react-slider';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentPage({setAmount, setTransaction_id, setPayment_mode, setReceivers_name, setDateAndTime}) {
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
  const [staffUrls, setStaffUrls] = useState();
  const [isPriceBreakupOpen, setIsPriceBreakupOpen] = useState(false);

  // State variables for questions
  const [showQuestions, setShowQuestions] = useState(true);
  const [paidByCash, setPaidByCash] = useState(null);
  const [wantToTip, setWantToTip] = useState(null);
  const [wantToReview, setWantToReview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // State variables for coupons
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponList, setShowCouponList] = useState(false);
  const handleCloseCouponPopup = useCallback(() => {
    setShowCouponPopup(false);
  }, []);

  useEffect(()=>{
    localStorage.clear()
  },[])
  
  useEffect(() => {
    fetchStoreAndHelpers();
  }, [storeId]);

  const fetchStoreAndHelpers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching store and helpers for storeId:', storeId);
      const imageUrlsResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/image-urls/${storeId}`);
      setImageUrls(imageUrlsResponse.data);
      const staffUrlsResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/staff-image-urls/${storeId}`);
      setStaffUrls(staffUrlsResponse.data.staffPhotoUrls);
      console.log("StaffUrl", staffUrlsResponse.data.staffPhotoUrls);
      const storeResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/${storeId}`);
      console.log('Store data:', storeResponse.data);
      setStore(storeResponse.data);
      const helpersResponse = await axios.get(`https://tipnex-server.tipnex.com/api/staff/store/${storeId}`);
      console.log('Helpers data:', helpersResponse.data);
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

  const handleTipSliderChange = (value) => {
    setTipAmount(value);
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
      localStorage.setItem("storeId", storeId)
      localStorage.setItem("staffId", selectedHelper.id)
      localStorage.setItem("phone", phoneNumber)
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

  const totalAmount = (parseFloat(billAmount) || 0) + (parseFloat(tipAmount) || 0) - calculateDiscount();
  setAmount(totalAmount)

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

  // Functions for handling questions
  const handlePaidByCash = (answer) => {
    setPaidByCash(answer);
    if (answer) {
      setCurrentQuestion(1);
    } else {
      setShowQuestions(false);
    }
  };

  const handleWantToTip = (answer) => {
    setWantToTip(answer);
    if (answer) {
      setShowQuestions(false);
    } else {
      setCurrentQuestion(2);
    }
  };

  const handleWantToReview = (answer) => {
    setWantToReview(answer);
    if (answer) {
      navigate("/review");
    } else {
      setShowQuestions(false);
    }
  };

  // Functions for handling coupons
  const handleUseCoupons = () => {
    setShowCouponPopup(true);
  };

  const handleFetchCoupons = useCallback(async (phoneNumber) => {
    try {
      setPhoneNumber(phoneNumber)
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
    setShowCouponPopup(false);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
  };

  const QuestionBox = ({ question, onYes, onNo }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 mb-4"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">{question}</h3>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => onYes()}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <ThumbsUp className="mr-2" size={18} />
          Yes
        </button>
        <button
          onClick={() => onNo()}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <ThumbsDown className="mr-2" size={18} />
          No
        </button>
      </div>
    </motion.div>
  );

  const CouponList = () => (
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
                <h4 className="text-lg font-semibold text-[#229799]">{coupon.title}</h4>
                <p className="text-sm text-gray-600">{coupon.description}</p>
              </div>
              <Ticket className="text-[#229799]" size={24} />
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <p>Discount: {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</p>
              <p>Min. Purchase: ₹{coupon.minimumPurchase}</p>
            </div>
          </motion.div>
        ))}
        <button
          onClick={() => setShowCouponList(false)}
          className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#229799] hover:bg-[#1b7b7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#229799]"
        >
          Close
        </button>
      </div>
    </motion.div>
  );

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
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ChevronLeft size={20} />
          <span className="ml-1 text-sm">Back</span>
        </button>

        {/* Profile Header */}
        {store && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-4">
              <img
                src={imageUrls.logoUrl || '/placeholder.svg?height=100&width=100'}
                alt={store.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">{store.name}</h1>
                <p className="text-sm text-gray-500 truncate">{store.address}</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">
                    {store.avgRating ? store.avgRating.toFixed(1) : 'N/A'}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">UPI: {store.ownerUpi}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Payment Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          {/* Bill Amount Input */}
          <div>
            <label htmlFor="billAmount" className="text-sm font-medium text-gray-700">
              Bill Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                name="billAmount"
                id="billAmount"
                className="border-2 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="0.00"
                value={billAmount}
                onChange={handleBillAmountChange}
              />
            </div>
          </div>

          {/* Tip Slider */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Tip Amount: ₹{tipAmount}
            </label>
            <ReactSlider
              className="w-full h-2 mt-10 bg-gray-200 rounded-md"
              thumbClassName="w-6 h-6 bg-white border-2 border-teal-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 -mt-2"
              trackClassName="h-2 bg-teal-500 rounded-md"
              min={0}
              max={100}
              value={tipAmount}
              onChange={handleTipSliderChange}
              renderThumb={(props, state) => (
                <div {...props}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    ₹{state.valueNow}
                  </div>
                </div>
              )}
            />
          </div>

          {/* Custom Tip Input */}
          <div>
            <label htmlFor="customTip" className="text-sm font-medium text-gray-700">
              Custom Tip
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                name="customTip"
                id="customTip"
                className="border-2 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter custom amount"
                value={customTip}
                onChange={handleCustomTipChange}
              />
            </div>
          </div>

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

          {/* Coupon Button */}
          <button
            onClick={handleUseCoupons}
            className="w-full py-2 px-4 border-2 border-teal-500 rounded-lg text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors duration-200"
          >
            <Ticket className="inline-block w-4 h-4 mr-2" />
            Use Coupons
          </button>

          {/* Selected Coupon */}
          {selectedCoupon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-teal-50 rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-medium text-teal-700">{selectedCoupon.title}</h4>
                <p className="text-xs text-teal-600">Code: {selectedCoupon.couponCode}</p>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="p-1 hover:bg-teal-100 rounded-full transition-colors duration-200"
              >
                <X size={16} className="text-teal-700" />
              </button>
            </motion.div>
          )}

          {/* Price Breakup */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setIsPriceBreakupOpen(!isPriceBreakupOpen)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">
                  To Pay: ₹{totalAmount.toFixed(2)}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isPriceBreakupOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isPriceBreakupOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bill Amount</span>
                      <span className="text-gray-900">₹{billAmount || 0}</span>
                    </div>
                    {selectedCoupon && (
                      <div className="flex justify-between text-teal-600">
                        <span>Discount</span>
                        <span>-₹{calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tip Amount</span>
                      <span className="text-gray-900">₹{tipAmount || 0}</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between font-medium">
                      <span>Total Amount</span>
                      <div>
                        {selectedCoupon && (
                          <span className="line-through text-gray-400 mr-2">
                            ₹{(parseFloat(billAmount) + parseFloat(tipAmount)).toFixed(2)}
                          </span>
                        )}
                        <span className="text-gray-900">₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={totalAmount === 0 || (selectedHelper == null && helpers.length > 0)}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Pay ₹{totalAmount.toFixed(2)}</span>
          </button>
        </div>
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
    </div>
  );
}