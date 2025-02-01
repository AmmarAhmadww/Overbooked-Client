'use client';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, Star, BookOpen, Users, FolderOpen, Clock, MessageSquare, BookPlus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Toast from './components/Toast';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import LibraryChat from './components/LibraryChat';
import RequestBook from './components/RequestBook';
import LoadingAnimation from './components/LoadingAnimation';
import { motion } from 'framer-motion';
import RatingModal from "./components/RatingModal";
import DefaultBookCover from './components/DefaultBookCover';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ pdfUrl, onClose, bookName, initialPage = 1, onPageChange, isPreview = false }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const zoomPluginInstance = zoomPlugin();

  // Debounce the page change handler
  const handlePageChange = React.useCallback((e) => {
    const currentPage = e.currentPage + 1;
    console.log('Page changed to:', currentPage);
    if (onPageChange) {
      // Use setTimeout to ensure we don't call this too frequently
      setTimeout(() => onPageChange(currentPage), 300);
    }
  }, [onPageChange]);

  return (
    <div className="fixed inset-0 bg-gray-900 z-[9999] flex flex-col">
      <div className="bg-gray-800 p-2 flex justify-between items-center">
        <span className="text-white font-semibold">
          {bookName} - Page {initialPage}
        </span>
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
        >
          Close Reader
        </button>
      </div>

      <div className="flex-1 bg-white overflow-auto">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div className="h-full">
            <Viewer
              fileUrl={pdfUrl}
              plugins={[
                defaultLayoutPluginInstance,
                zoomPluginInstance,
              ]}
              defaultScale={1}
              initialPage={initialPage - 1}
              onPageChange={handlePageChange}
              theme={{
                theme: 'dark',
              }}
              className="h-full overflow-auto"
            />
          </div>
        </Worker>
      </div>
    </div>
  );
};

const BookCard = ({ book, onIssue, onReturn, isIssued, onReadBook, onDelete, isAdmin, onRate }) => {
  const pdfUrl = book.pdf ? `http://localhost:5000${book.pdf}` : null;
  const [showDescription, setShowDescription] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Function to get the correct image URL
  const getCoverUrl = (coverPath) => {
    if (!coverPath) return null;
    // If it's already a full URL, return it
    if (coverPath.startsWith('http')) return coverPath;
    // If it's a path, prepend the server URL
    return `http://localhost:5000${coverPath}`;
  };

  return (
    <div className="bg-[#1E1E1E] rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Book Cover */}
      <div className="relative h-[400px]">
        {!imageError ? (
          <img 
            src={getCoverUrl(book.cover)}
            className="w-full h-full object-cover"
            alt={book.bookName}
            onError={(e) => {
              setImageError(true);
              e.target.onerror = null;
            }}
          />
        ) : (
          <DefaultBookCover />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h4 className="text-xl font-bold text-white mb-2">
            {book.bookName}
          </h4>
          <p className="text-gray-300 text-sm">by {book.author}</p>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-4 space-y-4 bg-[#1E1E1E]">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#242424] p-3 rounded-lg text-center">
            <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <p className="text-white text-sm">{book.rating}/5</p>
            <p className="text-gray-400 text-xs">Rating</p>
          </div>
          <div className="bg-[#242424] p-3 rounded-lg text-center">
            <BookOpen className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            {book.available > 0 ? (
              <>
                <p className="text-white text-sm">{book.available}</p>
                <p className="text-gray-400 text-xs">Available</p>
              </>
            ) : (
              <>
                <p className="text-red-400 text-sm">0</p>
                <p className="text-red-400/70 text-xs">Out of Stock</p>
              </>
            )}
          </div>
          <div className="bg-[#242424] p-3 rounded-lg text-center">
            <FolderOpen className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <p className="text-white text-sm">{book.category}</p>
            <p className="text-gray-400 text-xs">Category</p>
          </div>
        </div>

        {/* Description Section */}
        {book.description && (
          <div>
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="w-full text-cyan-400 hover:text-cyan-300 text-sm font-medium py-2 border border-gray-800 rounded-lg hover:bg-[#242424] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {showDescription ? (
                <>
                  <span>Hide Description</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Show Description</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
            {showDescription && (
              <div className="mt-3 text-sm text-gray-400 border-t border-gray-800 pt-3 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <p className="leading-relaxed">{book.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {isAdmin ? (
            // Admin actions
            <button 
              onClick={() => onDelete(book._id)}
              className="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/50 py-2 px-4 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          ) : (
            // User actions
            <>
              {isIssued ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button
                    onClick={() => onReturn(book._id)}
                    className="flex-1 bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-400 border border-yellow-500/50 py-2 px-4 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
                  >
                    Return Book
                  </button>
                  {pdfUrl && (
                    <button
                      onClick={() => onReadBook(book)}
                      className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/50 py-2 px-4 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Read Book
                    </button>
                  )}
                  <button
                    onClick={() => onRate(book._id)}
                    className="flex-1 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/50 py-2 px-4 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Rate Book
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onIssue(book._id)}
                  disabled={book.available <= 0}
                  className={`w-full py-2 px-4 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2
                    ${book.available > 0 
                      ? "bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/50" 
                      : "bg-gray-600/10 text-gray-400 border border-gray-500/50 cursor-not-allowed"}`}
                >
                  {book.available > 0 ? "Issue Book" : "Out of Stock"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200 flex items-center gap-3`}>
    <div className={`bg-${color}-100 p-2 rounded-lg`}>
      <Icon className={`h-6 w-6 text-${color}-600`} />
    </div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

const Library = ({ user, onUserUpdate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [readingProgress, setReadingProgress] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [authors, setAuthors] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBookForRating, setSelectedBookForRating] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const location = useLocation();
  const bookGridRef = useRef(null);

  const categories = [
    { name: 'Fiction', color: 'blue' },
    { name: 'Non-Fiction', color: 'green' },
    { name: 'Science', color: 'purple' },
    { name: 'History', color: 'yellow' },
    { name: 'Romance', color: 'pink' },
    { name: 'Mystery', color: 'indigo' },
    { name: 'Fantasy', color: 'cyan' },
    { name: 'Biography', color: 'orange' },
    { name: 'Self-Help', color: 'teal' },
    { name: 'Technology', color: 'red' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Filter books based on both search term and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Separate issued and available books
  const issuedBooks = user.issuedBooks || [];
  const availableBooks = filteredBooks.filter(book => 
    !issuedBooks.some(issuedBook => issuedBook.bookID === book._id)
  );

  // Load reading progress when component mounts
  useEffect(() => {
    const loadReadingProgress = async () => {
      try {
        const response = await fetch(`http://localhost:5000/library/reading-progress/${user._id}`);
        if (response.ok) {
          const data = await response.json();
          setReadingProgress(data.readingProgress || {});
        }
      } catch (error) {
        console.error('Failed to load reading progress:', error);
      }
    };

    if (user?._id) {
      loadReadingProgress();
    }
  }, [user?._id]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/library');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data || []);

        // Calculate author statistics
        const authorStats = data.reduce((acc, book) => {
          if (book.author) {
            if (!acc[book.author]) {
              acc[book.author] = {
                name: book.author,
                books: 1,
                color: getRandomColor() // You can define this function or use fixed colors
              };
            } else {
              acc[book.author].books += 1;
            }
          }
          return acc;
        }, {});

        // Convert to array and sort by number of books
        const sortedAuthors = Object.values(authorStats)
          .sort((a, b) => b.books - a.books)
          .slice(0, 4); // Get top 4 authors

        setAuthors(sortedAuthors);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Add this function for random colors (or you can use fixed colors)
  const getRandomColor = () => {
    const colors = ['blue', 'green', 'purple', 'pink', 'indigo', 'cyan', 'orange', 'teal'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 2000);
  };

  const handleIssueBook = async (bookID) => {
    try {
      const response = await fetch(`http://localhost:5000/library/requestBook/${bookID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user._id
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to request book');
      }

      const data = await response.json();
      showToast('Book request submitted successfully', 'success');
    } catch (error) {
      console.error('Error requesting book:', error);
      showToast(error.message, 'error');
    }
  };

  const handleReturnBook = async (bookID, bookName) => {
    try {
      // Check if the book exists in user's issued books
      const issuedBook = user.issuedBooks.find(book => book.bookID === bookID || book._id === bookID);
      
      if (!issuedBook) {
        throw new Error('Book not found in your issued books');
      }

      const response = await fetch('http://localhost:5000/library/returnBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userID: user._id,
          bookID: issuedBook.bookID || bookID, // Use the correct ID
          returnBookName: bookName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to return book');
      }

      const data = await response.json();

      // Update local books state
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book._id === bookID
            ? { ...book, available: book.available + 1, issued: book.issued - 1 }
            : book
        )
      );

      // Update user's issued books in local state
      const updatedUser = {
        ...user,
        issuedBooks: user.issuedBooks.filter(book => (book.bookID || book._id) !== bookID)
      };

      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);

      showToast('Book returned successfully!');
    } catch (error) {
      console.error('Error returning book:', error);
      showToast(error.message || 'Failed to return book', 'error');
    }
  };

  const handleReadBook = (book, isPreview = false) => {
    if (!book?.pdf) {
      setToast({
        show: true,
        message: 'PDF not available for this book',
        type: 'error'
      });
      return;
    }
    setSelectedBook(book);
    setShowPdfViewer(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClosePdf = () => {
    setShowPdfViewer(false);
    setSelectedBook(null);
    document.body.style.overflow = 'auto';
  };

  const handlePageChange = async (bookId, pageNumber) => {
    console.log('Saving progress:', { bookId, pageNumber });

    try {
      const response = await fetch('http://localhost:5000/library/reading-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          bookId: bookId,
          pageNumber: pageNumber
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save reading progress');
      }

      const data = await response.json();
      console.log('Progress saved:', data);

      // Update local state with the confirmed progress
      setReadingProgress(prev => ({
        ...prev,
        [bookId]: pageNumber
      }));

    } catch (error) {
      console.error('Failed to save reading progress:', error);
    }
  };

  // Add category click handler
  const handleCategoryClick = (categoryName) => {
    // If clicking the same category, clear the filter
    setSelectedCategory(categoryName === selectedCategory ? 'All' : categoryName);
  };

  const handleDeleteBook = async (bookID) => {
    if (!user.isAdmin) {
      showToast('Only admins can delete books', 'error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/library/book/${bookID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: user }) // Include user data for admin verification
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete book');
      }

      showToast('Book deleted successfully');
      setBooks(books.filter(book => book._id !== bookID));
    } catch (error) {
      console.error('Error deleting book:', error);
      showToast(error.message || 'Failed to delete book', 'error');
    }
  };

  const handleRateBook = async (bookId, rating) => {
    try {
      const response = await fetch(`http://localhost:5000/library/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          userId: user._id,
          rating
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rate book");
      }

      const data = await response.json();
      
      // Update the books state with the new rating
      setBooks(books.map(book => 
        book._id === bookId 
          ? { ...book, rating: data.newRating }
          : book
      ));

      showToast("Rating submitted successfully", "success");
    } catch (error) {
      console.error("Error rating book:", error);
      showToast(error.message, "error");
    }
  };

  const onRate = (bookId) => {
    const book = books.find(b => b._id === bookId);
    setSelectedBookForRating(book);
    setShowRatingModal(true);
  };

  useEffect(() => {
    if (location.state?.scrollToBookId) {
      const bookElement = document.getElementById(`book-${location.state.scrollToBookId}`);
      if (bookElement) {
        bookElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add highlight animation
        bookElement.classList.add('highlight-book');
        setTimeout(() => {
          bookElement.classList.remove('highlight-book');
        }, 2000);
      }
    }
  }, [location.state?.scrollToBookId, books]);

  useEffect(() => {
    // Force loading animation for 1.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/count');
        if (!response.ok) {
          throw new Error('Failed to fetch user count');
        }
        const data = await response.json();
        setTotalUsers(data.count);
      } catch (error) {
        console.error('Error fetching user count:', error);
        setTotalUsers(0);
      }
    };

    fetchTotalUsers();
  }, []);

  if (isLoading) {
    return <LoadingAnimation onComplete={() => setIsLoading(false)} duration={1500} />;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Please log in</strong>
          <span className="block sm:inline"> to access the library.</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <LoadingAnimation />
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0a0a0a] py-6"
    >
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with new animation */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row justify-between items-center mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Library
          </h1>
          <div className="flex items-center gap-4">
            {user?.isAdmin && (
              <Link to="/addbook">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Book
                </button>
              </Link>
            )}
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 flex items-center gap-2"
            >
              <BookPlus className="h-5 w-5" />
              Request Book
            </button>
          </div>
        </motion.div>

        {/* Stats and Categories Section with new animation */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Library Stats */}
          <motion.div 
            variants={scaleIn}
            className="bg-[#1E1E1E] p-4 rounded-xl shadow-md"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              Library Stats
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#242424] p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">Total Books</span>
                </div>
                <p className="text-2xl font-bold text-white">{books.length}</p>
              </div>
              <div className="bg-[#242424] p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-green-400" />
                  <span className="text-gray-400 text-sm">Books Issued</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {books.reduce((acc, book) => acc + (book.issued || 0), 0)}
                </p>
              </div>
              <div className="bg-[#242424] p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">Available</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {books.reduce((acc, book) => acc + (book.available || 0), 0)}
                </p>
              </div>
              <div className="bg-[#242424] p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-400 text-sm">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {totalUsers || 0}
                </p>
              </div>
              <div className="bg-[#242424] p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FolderOpen className="h-5 w-5 text-orange-400" />
                  <span className="text-gray-400 text-sm">Categories</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {new Set(books.map(book => book.category)).size}
                </p>
              </div>
              <div className="bg-[#242424] p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-cyan-400" />
                  <span className="text-gray-400 text-sm">Authors</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {new Set(books.map(book => book.author)).size}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div 
            variants={scaleIn}
            className="bg-[#1E1E1E] p-4 rounded-xl shadow-md"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-purple-400" />
              Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleCategoryClick('All')}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors
                  ${selectedCategory === 'All' 
                    ? 'bg-purple-600/10 text-purple-400 border border-purple-500/50' 
                    : 'bg-[#242424] text-gray-300 hover:bg-[#2a2a2a]'}`}
              >
                <span className="text-sm">All Categories</span>
              </button>
              {categories.map(category => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors
                    ${selectedCategory === category.name 
                      ? `bg-${category.color}-600/10 text-${category.color}-400 border border-${category.color}-500/50` 
                      : 'bg-[#242424] text-gray-300 hover:bg-[#2a2a2a]'}`}
                >
                  <div className="flex items-center gap-2">
                    {/* Only show dot if it's not Fantasy */}
                    {category.name !== 'Fantasy' && (
                      <div className={`w-2 h-2 rounded-full bg-${category.color}-400`}></div>
                    )}
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {books.filter(book => book.category === category.name).length}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Search Bar with new animation */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between"
        >
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative flex-1 max-w-xl"
          >
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" />
          </motion.div>
        </motion.div>

        {/* Main Content with enhanced animations */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-8"
        >
          {/* Books Grid with enhanced card animations */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={book._id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden"
                  >
                    <BookCard
                      book={book}
                      onIssue={handleIssueBook}
                      onReturn={handleReturnBook}
                      isIssued={issuedBooks.some(issuedBook => issuedBook.bookID === book._id)}
                      onReadBook={handleReadBook}
                      onDelete={() => handleDeleteBook(book._id)}
                      isAdmin={user?.isAdmin}
                      onRate={() => onRate(book._id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center p-8 bg-[#1E1E1E] rounded-xl"
              >
                <BookOpen className="h-16 w-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Books Found</h3>
                <p className="text-gray-500 text-center">
                  {searchTerm 
                    ? `No books found matching "${searchTerm}"`
                    : `No books available in the ${selectedCategory} category`}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 px-6 py-2 bg-purple-600/10 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-600/20 transition-colors duration-300"
                >
                  Show All Books
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Right Sidebar with new animation */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-80 xl:w-96 space-y-6"
          >
            {/* Top Authors with new hover animation */}
            <motion.div 
              variants={scaleIn}
              className="bg-[#1E1E1E] p-5 rounded-xl shadow-md"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Popular Authors
              </h2>
              <div className="space-y-3">
                {authors.map((author) => (
                  <motion.div 
                    key={author.name}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "rgba(255,255,255,0.05)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-[#242424] transition-colors cursor-pointer hover:shadow-lg"
                    onClick={() => setSearchTerm(author.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-${author.color}-500/20 flex items-center justify-center`}>
                        <Users className={`h-4 w-4 text-${author.color}-400`} />
                      </div>
                      <span className="text-gray-300 font-medium">{author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-purple-400 font-medium">
                        {author.books} {author.books === 1 ? 'book' : 'books'}
                      </span>
                      <svg 
                        className="w-4 h-4 text-gray-500" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Library Assistant Button with new animation */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white font-medium p-3 rounded-full shadow-lg transition duration-300 flex items-center gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="hidden sm:inline">Ask Assistant</span>
        </motion.button>

        {/* Library Chat */}
        {showChat && (
          <div className="fixed bottom-12 right-3 z-40">
            <LibraryChat
              books={books}
              onClose={() => setShowChat(false)}
            />
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && selectedBookForRating && (
          <RatingModal
            book={selectedBookForRating}
            onClose={() => setShowRatingModal(false)}
            onRate={(rating) => handleRateBook(selectedBookForRating._id, rating)}
          />
        )}

        {/* Show PDF Viewer */}
        {showPdfViewer && selectedBook && (
          <PDFViewer
            pdfUrl={`http://localhost:5000${selectedBook.pdf}`}
            bookName={selectedBook.bookName}
            initialPage={readingProgress[selectedBook._id] || 1}
            onPageChange={(page) => handlePageChange(selectedBook._id, page)}
            onClose={handleClosePdf}
            isPreview={!issuedBooks.some(issuedBook => issuedBook.bookID === selectedBook._id)}
          />
        )}

        {/* Toast Messages */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: 'success' })}
          />
        )}

        {/* Request Book Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <RequestBook 
                user={user} 
                onClose={() => setShowRequestModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    bookName: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    available: PropTypes.number.isRequired,
    issued: PropTypes.number.isRequired,
    pdf: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
  }).isRequired,
  onIssue: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
  isIssued: PropTypes.bool.isRequired,
  onReadBook: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onRate: PropTypes.func.isRequired,
};

Library.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    issuedBooks: PropTypes.array,
  }),
  onUserUpdate: PropTypes.func.isRequired,
};

export default Library;
