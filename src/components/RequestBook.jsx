import React, { useState } from 'react';
import { BookPlus, Search } from 'lucide-react';
import Toast from './Toast';

const RequestBook = ({ user, onClose }) => {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!bookName || !author || !description) {
      setToast({
        show: true,
        message: 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    if (!user) {
      setToast({
        show: true,
        message: 'Please login to request books',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/library/request-new-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          userName: user.username,
          userEmail: user.email,
          bookName,
          author,
          description,
          status: 'pending'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit request');
      }

      setToast({
        show: true,
        message: 'Book request submitted successfully!',
        type: 'success'
      });

      // Clear form and close modal after success
      setTimeout(() => {
        setBookName('');
        setAuthor('');
        setDescription('');
        onClose();
      }, 2000);
    } catch (error) {
      setToast({
        show: true,
        message: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <BookPlus className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Request a New Book</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Name *
          </label>
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter book name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author *
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter author name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Why do you want this book? *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Briefly describe why you'd like this book added to the library"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold py-2 px-4 rounded-lg transition duration-300`}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default RequestBook; 