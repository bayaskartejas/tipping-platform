import React from 'react'

const transactionData = [
  { id: 1, paidBill: 50.00, paidTip: 7.50, restaurantName: "Tasty Bites" },
  { id: 2, paidBill: 35.00, paidTip: 5.25, restaurantName: "Burger Palace" },
  { id: 3, paidBill: 80.00, paidTip: 12.00, restaurantName: "Sushi Haven" },
  { id: 4, paidBill: 25.00, paidTip: 3.75, restaurantName: "Pizza Corner" },
  { id: 5, paidBill: 60.00, paidTip: 9.00, restaurantName: "Taco Fiesta" },
  { id: 6, paidBill: 45.00, paidTip: 6.75, restaurantName: "Noodle House" },
  { id: 7, paidBill: 70.00, paidTip: 10.50, restaurantName: "Steak & Grill" },
  { id: 8, paidBill: 30.00, paidTip: 4.50, restaurantName: "Salad Bar" },
  { id: 9, paidBill: 55.00, paidTip: 8.25, restaurantName: "Seafood Shack" },
  { id: 10, paidBill: 40.00, paidTip: 6.00, restaurantName: "Breakfast Spot" },
]

export default function TransactionHistory() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Restaurant/Store</th>
            <th className="p-2 text-right">Paid Bill</th>
            <th className="p-2 text-right">Paid Tip</th>
          </tr>
        </thead>
        <tbody className=''>
          {transactionData.map((transaction) => (
            <tr key={transaction.id} className="border-b hover:bg-black hover:bg-opacity-20">
              <td className="p-2">{transaction.restaurantName}</td>
              <td className="p-2 text-right">${transaction.paidBill.toFixed(2)}</td>
              <td className="p-2 text-right">${transaction.paidTip.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}