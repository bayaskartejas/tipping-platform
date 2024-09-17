import React, { useRef, useEffect, useState } from 'react'
import { Star, X } from 'lucide-react'

const reviews = [
  { id: 1, name: 'Alice', rating: 5, comment: 'Excellent service!' },
  { id: 2, name: 'Bob', rating: 4, comment: 'Very attentive and friendly.' },
  { id: 3, name: 'Charlie', rating: 5, comment: 'Made our evening special.' },
  { id: 4, name: 'Diana', rating: 4, comment: 'Great recommendations.' },
  { id: 5, name: 'Eve', rating: 5, comment: 'Always smiling and helpful.' },
  { id: 6, name: 'Frank', rating: 4, comment: 'Prompt and efficient service.' },
  { id: 7, name: 'Grace', rating: 5, comment: 'Went above and beyond.' },
  { id: 8, name: 'Henry', rating: 4, comment: 'Very professional.' },
  { id: 9, name: 'Ivy', rating: 5, comment: 'Made us feel welcome.' },
  { id: 10, name: 'Jack', rating: 4, comment: 'Knowledgeable about the menu.' },
]

export default function RatingAndReviews() {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    let scrollInterval

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
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex items-center space-x-2 md:text-left text-center w-full md:w-auto">
          <span className="text-3xl font-bold text-gray-800">4.5</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <div ref={scrollRef} className="flex-grow overflow-x-hidden w-full">
          <div className="flex space-x-4 pb-4 w-max">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => setShowAllReviews(true)}
        className="mt-4 bg-[#229799] text-white px-4 py-2 rounded-md hover:bg-[#1b7b7d] transition-colors duration-300"
      >
        See all reviews
      </button>
      {showAllReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowAllReviews(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} fullWidth />
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
        <span className="font-medium">{review.name}</span>
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
      <p className="text-sm text-gray-600">{review.comment}</p>
    </div>
  )
}