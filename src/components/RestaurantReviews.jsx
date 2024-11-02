import React, { useRef, useEffect, useState } from 'react'
import { Star, X } from 'lucide-react'

export default function RestaurantReviews({storeData}) {
const [showAllRestReviews, setShowAllRestReviews] = useState(false)
const scrollRef = useRef(null)
let reviews;
// reviews = [
//   { id: 1, user: 'Alice Johnson', rating: 5, content: 'Excellent food and atmosphere! Will definitely come back.' },
//   { id: 2, user: 'Bob Smith', rating: 4, content: 'Great service and delicious dishes. Highly recommended.' },
//   { id: 3, user: 'Charlie Brown', rating: 5, content: 'The best restaurant in town. Love the ambiance.' },
//   { id: 4, user: 'Diana Ross', rating: 4, content: 'Fantastic menu with a wide variety of options. Enjoyed my meal.' },
//   { id: 5, user: 'Eva Green', rating: 5, content: 'Impeccable service and mouth-watering cuisine. A must-visit!' },
//   { id: 6, user: 'Frank Sinatra', rating: 4, content: 'Cozy atmosphere and friendly staff. Food was delightful.' },
//   { id: 7, user: 'Grace Kelly', rating: 5, content: 'An unforgettable dining experience. Will be back soon!' },
//   { id: 8, user: 'Henry Ford', rating: 4, content: 'Impressive wine selection and tasty appetizers. Great place for a date.' },
//   { id: 9, user: 'Irene Adler', rating: 5, content: "The chef's special was out of this world. Highly impressed." },
//   { id: 10, user: 'Jack Sparrow', rating: 4, content: 'Arrr! The seafood platter was a treasure trove of flavors!' },
// ]

  useEffect(() => {
    const el = scrollRef.current
    let scrollInterval
    console.log(storeData);
    

    if (el) {
      scrollInterval = setInterval(() => {
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
          el.scrollTo({ left: 0, behavior: 'auto' }) // Scroll back to the start instantly
        } else {
          el.scrollBy({ left: 1, behavior: 'auto' }) // Scroll slowly
        } 
      }, 30) // Adjust the speed by modifying this value
    }

    return () => clearInterval(scrollInterval)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-full relative">
      <h2 className="text-2xl font-bold mb-4">Restaurant Reviews</h2>
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex items-center space-x-2 md:text-left text-center w-full md:w-auto">
          <span className="text-3xl font-bold text-gray-800">{storeData.avgRating}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= storeData.avgRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <div ref={scrollRef} className="flex-grow overflow-x-hidden w-full">
          <div className="flex space-x-4 pb-4 w-max">
            {storeData.reviews.map((review) => (
              <ReviewCard key={Math.random()} review={review} />
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => setShowAllRestReviews(true)}
        className="mt-4 bg-[#229799] text-white px-4 py-2 rounded-md hover:bg-[#1b7b7d] transition-colors duration-300"
      >
        See all reviews
      </button>
      {showAllRestReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowAllRestReviews(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
            {storeData.reviews.map((review) => (
              <ReviewCard key={Math.random()} review={review} fullWidth />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review, fullWidth }) {
  return (
    <div className={`bg-gray-100 rounded-lg p-4 ${fullWidth ? 'w-full mb-4' : 'min-w-[14rem] w-[14rem] max-w-[14rem] flex-shrink-0'}`}>
      <div className="flex items-center space-x-2 mb-2">
        <span className="font-medium">{review.user}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600">{review.content}</p>
    </div>
  )
}