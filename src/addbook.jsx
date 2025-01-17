'use client';

import React, { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from './components/Toast';

const AddBook = () => {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');
  const [coverLink, setCoverLink] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const navigate = useNavigate();

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCoverFile(file);
      setCoverLink(''); // Clear cover link if file is selected
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    
    // Add book details
    formData.append('bookName', bookName);
    formData.append('author', author);
    formData.append('rating', rating || '0');
    formData.append('available', '5');
    formData.append('total', '5');
    formData.append('category', category);

    // Add cover and PDF files if they exist
    if (coverFile) {
      formData.append('cover', coverFile);
    } else if (coverLink) {
      formData.append('coverLink', coverLink);
    }

    if (pdfFile) {
      formData.append('pdf', pdfFile);
    }

    // Add user data
    formData.append('user', JSON.stringify(user));

    try {
      const response = await fetch('http://localhost:5000/library/add-book', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add book');
      }

      setToast({
        show: true,
        message: 'Book added successfully!',
        type: 'success'
      });

      // Clear form
      setBookName('');
      setAuthor('');
      setRating('');
      setCoverLink('');
      setCoverFile(null);
      setPdfFile(null);
      setCategory('');
      e.target.reset();

      // Navigate to books page after a short delay to show the success message
      setTimeout(() => {
        navigate('/books');
      }, 1500);

    } catch (error) {
      setToast({
        show: true,
        message: error.message,
        type: 'error'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Add New Book</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {/* Book Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="bookName">
            Book Name
          </label>
          <input
            type="text"
            id="bookName"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter book name"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="author">
            Author
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter author's name"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="rating">
            Rating (Optional)
          </label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter rating (1-5)"
          />
        </div>

        {/* Book Cover */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Book Cover (Optional)</label>
          <div className="mt-2 space-y-2">
            <input
              type="url"
              value={coverLink}
              onChange={(e) => setCoverLink(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter image URL (optional)"
            />
            <div className="flex items-center justify-between space-x-4">
              <label
                htmlFor="coverFile"
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2"
              >
                <FilePlus className="w-4 h-4" />
                <span>Choose Cover</span>
              </label>
              <input
                type="file"
                id="coverFile"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Book PDF */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Book PDF (Optional)</label>
          <div className="flex items-center justify-between space-x-4">
            <label
              htmlFor="pdfFile"
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2"
            >
              <FilePlus className="w-4 h-4" />
              <span>Choose PDF</span>
            </label>
            <input
              type="file"
              id="pdfFile"
              accept=".pdf"
              onChange={handlePdfFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="category">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Category</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold py-2 px-6 rounded-lg transition duration-300`}
          >
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
        </div>
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

export default AddBook;
