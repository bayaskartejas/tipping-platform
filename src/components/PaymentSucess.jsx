import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { jsPDF } from 'jspdf'; 
import { useNavigate } from 'react-router-dom';
import { div } from 'framer-motion/client';


const ReviewConsent = ({setShowReviewConsent}) => {
const navigate = useNavigate()
const onConsent = (review) =>{
    setShowReviewConsent(false)
    if(review){
        navigate("/review")
    }
}

  return (
    <div className='fixed z-50 top-0 left-0 right-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300'>
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-[90%] text-center animate-popup">
        <h2 className="text-2xl font-bold text-[#229799] mb-4">Would You Like to Leave a Review?</h2>
        <p className="text-gray-600 mb-6">
          We'd love to hear your feedback on the restaurant, staff, and platform experience!
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => onConsent(true)}
            className="w-full bg-[#229799] text-white py-2 rounded-lg hover:bg-[#1b7b7d] transition duration-300"
          >
            Yes, I’d love to review
          </button>
          <button
            onClick={() => onConsent(false)}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-300"
          >
            No, Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentSuccess = ({amount, transaction_id, payment_mode, receivers_name, dateAndTime}) => {
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });
  const [showReviewConsent, setShowReviewConsent] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(()=>{
    setTimeout(()=>{
        setShowReviewConsent(true)
    },3000)
  },[])
  
  
  // Function to generate and download the PDF receipt
  const downloadReceipt = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Payment Receipt', 20, 20);

    doc.setFontSize(12);
    doc.text(`Amount Paid: ₹${amount}`, 20, 30);
    doc.text(`Transaction ID: ${transaction_id}`, 20, 40);
    doc.text(`Payment Mode: ${payment_mode}`, 20, 50);
    doc.text(`Receiver's Name: ${receivers_name}`, 20, 60);
    doc.text(`Date & Time: ${dateAndTime}`, 20, 70);

    doc.save('receipt.pdf'); // Save the PDF with a filename
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    {showReviewConsent && (
        <ReviewConsent setShowReviewConsent={setShowReviewConsent}/>
    )}
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-[#26a69a] rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#26a69a] mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Your transaction has been processed</p>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid</span>
            <span className="font-semibold">₹{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID</span>
            <span>{transaction_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Mode</span>
            <span>{payment_mode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Receiver's Name</span>
            <span>{receivers_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
        </div>
        <div className="space-y-4">
          <button onClick={downloadReceipt} className="w-full bg-[#26a69a] text-white py-2 px-4 rounded-md hover:bg-[#00897b] transition duration-300 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Receipt
          </button>
          <button onClick={()=>{navigate("/")}} className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;