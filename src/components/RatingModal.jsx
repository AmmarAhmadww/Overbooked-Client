import React, { useState } from "react";
import PropTypes from "prop-types";
import { Star } from "lucide-react";

const RatingModal = ({ book, onClose, onRate, currentRating = 0 }) => {
  const [rating, setRating] = useState(currentRating);
  const [hover, setHover] = useState(0);

  const handleSubmit = async () => {
    await onRate(rating);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] rounded-xl shadow-xl p-6 max-w-md w-full border border-gray-800">
        <h3 className="text-2xl font-bold text-white mb-4">Rate this Book</h3>
        
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={book.cover} 
              alt={book.bookName} 
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h4 className="text-lg font-semibold text-white">{book.bookName}</h4>
              <p className="text-gray-400">by {book.author}</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none transform transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hover || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-gray-400 mb-6">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!rating}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              rating
                ? "bg-cyan-500 hover:bg-cyan-600 text-black"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
};

RatingModal.propTypes = {
  book: PropTypes.shape({
    bookName: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onRate: PropTypes.func.isRequired,
  currentRating: PropTypes.number,
};

export default RatingModal; 