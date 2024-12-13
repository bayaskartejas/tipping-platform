import React, { createContext, useState, useContext } from 'react';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export function PaymentProvider({ children }) {
  const [amount, setAmount] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [receiversName, setReceiversName] = useState('');
  const [dateAndTime, setDateAndTime] = useState(null);

  const value = {
    amount,
    setAmount,
    transactionId,
    setTransactionId,
    paymentMode,
    setPaymentMode,
    receiversName,
    setReceiversName,
    dateAndTime,
    setDateAndTime,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}