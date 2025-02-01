'use client';

import React, { useState, useEffect } from 'react';
import { FilePlus, BookOpen, User, Star, Image as ImageIcon, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from './components/Toast';
import { motion } from 'framer-motion';
import LoadingAnimation from './components/LoadingAnimation';

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
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  
  const navigate = useNavigate();

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "History",
    "Romance",
    "Mystery",
    "Fantasy",
    "Biography",
    "Self-Help",
    "Technology"
  ];

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images
  const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB for PDFs
  const MAX_IMAGE_SIZE_MB = 5;
  const MAX_PDF_SIZE_MB = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCoverFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        if (file.size > MAX_IMAGE_SIZE) {
          setToast({
            show: true,
            message: `Image size should be less than ${MAX_IMAGE_SIZE_MB}MB`,
            type: "error"
          });
          return;
        }

        // Store the actual file
        setCoverFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        setCoverLink('');
      } catch (error) {
        console.error("Error processing image:", error);
        setToast({
          show: true,
          message: "Error processing image file",
          type: "error"
        });
      }
    }
  };

  const handlePdfFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      try {
        if (file.size > MAX_PDF_SIZE) {
          setToast({
            show: true,
            message: `PDF size should be less than ${MAX_PDF_SIZE_MB}MB`,
            type: "error"
          });
          return;
        }
        setPdfFile(file);
      } catch (error) {
        console.error("Error processing PDF:", error);
        setToast({
          show: true,
          message: "Error processing PDF file",
          type: "error"
        });
      }
    }
  };

  // Function to compress image
  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Maximum dimensions - reduce these values for smaller file sizes
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with lower quality (0.5 for more compression)
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }));
            },
            'image/jpeg',
            0.5 // Reduced quality for smaller file size
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Add this function to compress PDFs (if needed)
  const compressPDF = async (file) => {
    // If file is smaller than 1MB, don't compress
    if (file.size <= 1024 * 1024) {
      return file;
    }
    
    // For larger files, convert to base64 and chunk the data
    const base64 = await convertToBase64(file);
    // Only take the first 1MB of the PDF for preview/upload
    const truncatedBase64 = base64.substring(0, 1024 * 1024);
    return truncatedBase64;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create initial FormData with all book information
      const formData = new FormData();
      formData.append('bookName', bookName);
      formData.append('author', author);
      formData.append('rating', rating || '0');
      formData.append('category', category);
      formData.append('available', '5');
      formData.append('total', '5');

      // Append cover file if it exists
      if (coverFile) {
        formData.append('cover', coverFile);
      }

      // Append PDF file if it exists
      if (pdfFile) {
        formData.append('pdf', pdfFile);
      }

      // Send everything in one request
      const response = await fetch('http://localhost:5000/library/add-book', {
        method: 'POST',
        body: formData // Don't set Content-Type header - browser will set it with boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add book');
      }

      const data = await response.json();

      setToast({
        show: true,
        message: 'Book added successfully!',
        type: 'success'
      });

      // Reset form
      setBookName('');
      setAuthor('');
      setRating('');
      setCoverLink('');
      setCoverFile(null);
      setPdfFile(null);
      setCategory('');
      setImagePreview(null);
      e.target.reset();

      // Navigate after showing success message
      setTimeout(() => {
        navigate('/books');
      }, 1500);

    } catch (error) {
      console.error("Submit error:", error);
      setToast({
        show: true,
        message: error.message || 'Failed to add book',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingAnimation onComplete={() => setIsLoading(false)} duration={1500} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Add New{" "}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Book
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-[#121212] rounded-2xl shadow-xl p-8 space-y-6 border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Book Name */}
          <motion.div
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <label className="flex items-center text-gray-300 text-lg font-medium">
              <BookOpen className="w-5 h-5 mr-2 text-cyan-400" />
              Book Name
            </label>
            <input
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                text-gray-100 placeholder-gray-500 transition-all duration-300"
              placeholder="Enter book name"
            />
          </motion.div>

          {/* Author */}
          <motion.div
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <label className="flex items-center text-gray-300 text-lg font-medium">
              <User className="w-5 h-5 mr-2 text-cyan-400" />
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                text-gray-100 placeholder-gray-500 transition-all duration-300"
              placeholder="Enter author's name"
            />
          </motion.div>

          {/* Rating */}
          <motion.div
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <label className="flex items-center text-gray-300 text-lg font-medium">
              <Star className="w-5 h-5 mr-2 text-cyan-400" />
              Rating
            </label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                text-gray-100 placeholder-gray-500 transition-all duration-300"
              placeholder="Rate from 1-5"
            />
          </motion.div>

          {/* Category */}
          <motion.div
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <label className="flex items-center text-gray-300 text-lg font-medium">
              <BookOpen className="w-5 h-5 mr-2 text-cyan-400" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                text-gray-100 transition-all duration-300"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </motion.div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Upload */}
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <label className="flex items-center text-gray-300 text-lg font-medium">
                <ImageIcon className="w-5 h-5 mr-2 text-cyan-400" />
                Cover Image
              </label>
              
              {/* Image Preview */}
              {(imagePreview || coverLink) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4"
                >
                  <img
                    src={imagePreview || coverLink}
                    alt="Book cover preview"
                    className="w-40 h-56 object-cover rounded-lg mx-auto border-2 border-cyan-400"
                    onError={(e) => {
                      e.target.onerror = null;
                      setImagePreview(null);
                      setCoverLink('');
                    }}
                  />
                </motion.div>
              )}

              {/* URL Input */}
              <input
                type="url"
                value={coverLink}
                onChange={(e) => {
                  setCoverLink(e.target.value);
                  setImagePreview(null);
                  setCoverFile(null);
                }}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                  text-gray-100 placeholder-gray-500 transition-all duration-300"
                placeholder="Image URL"
              />

              {/* File Upload Button */}
              <div className="relative">
                <label
                  htmlFor="coverFile"
                  className="cursor-pointer flex items-center justify-center space-x-2 
                    bg-gradient-to-r from-cyan-600 to-cyan-800 text-white py-2 px-4 rounded-xl
                    hover:from-cyan-500 hover:to-cyan-700 transition-all duration-300 w-full"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>{coverFile ? 'Change Image' : 'Choose File'}</span>
                </label>
                <input
                  type="file"
                  id="coverFile"
                  onChange={handleCoverFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              {/* File Name Display */}
              {coverFile && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-400 mt-2 text-center"
                >
                  Selected: {coverFile.name}
                </motion.p>
              )}
            </motion.div>

            {/* PDF Upload */}
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <label className="flex items-center text-gray-300 text-lg font-medium">
                <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                PDF File
              </label>
              <label
                htmlFor="pdfFile"
                className="cursor-pointer flex items-center justify-center space-x-2 
                  bg-gradient-to-r from-cyan-600 to-cyan-800 text-white py-2 px-4 rounded-xl
                  hover:from-cyan-500 hover:to-cyan-700 transition-all duration-300"
              >
                <FilePlus className="w-5 h-5" />
                <span>Choose PDF</span>
              </label>
              <input
                type="file"
                id="pdfFile"
                onChange={handlePdfFileChange}
                accept=".pdf"
                className="hidden"
              />
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div
            className="flex justify-center pt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              disabled={loading}
              className={`w-full max-w-md ${
                loading ? "bg-gray-600" : "bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600"
              } text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform`}
            >
              {loading ? "Adding Book..." : "Add Book"}
            </button>
          </motion.div>
        </motion.form>

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: "", type: "success" })}
          />
        )}
      </div>
    </motion.div>
  );
};

export default AddBook;
