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

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ pdfUrl, onClose, bookName, initialPage = 1, onPageChange }) => {
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

const BookCard = ({ book, onIssue, onReturn, isIssued, onReadBook, onDelete, isAdmin }) => {
  const pdfUrl = book.pdf ? `http://localhost:5000${book.pdf}` : null;

  return (
    <div 
      id={`book-${book._id}`} 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[280px]"
    >
      {/* Book Cover with Gradient Overlay */}
      <div className="relative h-[420px]">
        <img 
          src={book.cover} 
          className="w-full h-full object-cover bg-gray-50"
          alt={book.bookName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x600?text=No+Cover+Available';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h4 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {book.bookName}
          </h4>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-5 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-sm text-gray-600">Rating</p>
            <p className="font-semibold">{book.rating}/5</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600">Available</p>
            <p className="font-semibold">{book.available}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600">Issued</p>
            <p className="font-semibold">{book.issued}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-indigo-500" />
            </div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-semibold">{book.category}</p>
          </div>
        </div>

        {/* Read Count Badge */}
        {book.readCount > 0 && (
          <div className="flex justify-center">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Read {book.readCount} times
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {pdfUrl && isIssued ? (
            <button
              onClick={onReadBook}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Read Book
            </button>
          ) : pdfUrl && (
            <button
              className="w-full bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg cursor-not-allowed"
              disabled
            >
              Issue to Read
            </button>
          )}
          
          {isIssued ? (
            <>
              <div className="py-2 px-3 bg-blue-100 text-blue-800 rounded-md text-sm font-medium text-center">
                Already Issued
              </div>
              <button 
                onClick={() => onReturn(book._id, book.bookName)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                Return Book
              </button>
            </>
          ) : book.available <= 0 ? (
            <button 
              className="w-full bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg cursor-not-allowed"
              disabled
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={() => onIssue(book._id)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Request Book
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => onDelete(book._id)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
              Delete Book
            </button>
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

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [readingProgress, setReadingProgress] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
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

  // Filter books based on both search term and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
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

  const handleReadBook = (book) => {
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
    setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
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
        </div>

        {/* Stats and Categories Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Library Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard 
                title="Total Books" 
                value={books.length} 
                icon={BookOpen}
                color="blue"
              />
              <StatCard 
                title="Books Issued" 
                value={issuedBooks.length} 
                icon={Users}
                color="green"
              />
              <StatCard 
                title="Available Books" 
                value={availableBooks.length} 
                icon={BookOpen}
                color="purple"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-indigo-600" />
              Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((category) => {
                const count = books.filter(book => book.category === category.name).length;
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex items-center justify-between p-2 rounded-lg 
                      ${selectedCategory === category.name 
                        ? `bg-${category.color}-100 text-${category.color}-800` 
                        : 'bg-gray-50 hover:bg-gray-100'} 
                      transition-colors cursor-pointer`}
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs bg-${category.color}-100 text-${category.color}-700`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-8">
          {/* Books Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {filteredBooks.map((book) => (
              <div className="flex justify-center" key={book._id}>
                <BookCard
                  book={book}
                  onIssue={handleIssueBook}
                  onReturn={handleReturnBook}
                  isIssued={issuedBooks.some(issuedBook => issuedBook.bookID === book._id)}
                  onReadBook={() => handleReadBook(book)}
                  onDelete={() => handleDeleteBook(book._id)}
                  isAdmin={user?.isAdmin}
                />
              </div>
            ))}
          </div>

          {/* Right Sidebar - Recent Activity */}
          <div className="w-full lg:w-80 xl:w-96 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {Object.entries(readingProgress).slice(0, 3).map(([bookId, page]) => {
                  const book = books.find(b => b._id === bookId);
                  return book ? (
                    <div key={bookId} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <img 
                        src={book.cover} 
                        alt={book.bookName} 
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{book.bookName}</p>
                        <p className="text-xs text-gray-600">Page {page}</p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Top Authors */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Popular Authors
              </h2>
              <div className="space-y-3">
                {authors.map((author) => (
                  <div 
                    key={author.name}
                    className={`flex items-center justify-between p-3 rounded-lg bg-${author.color}-50 hover:bg-${author.color}-100 transition-colors cursor-pointer`}
                    onClick={() => setSearchTerm(author.name)}
                  >
                    <span className="text-gray-700">{author.name}</span>
                    <span className={`text-sm text-${author.color}-600`}>
                      {author.books} {author.books === 1 ? 'book' : 'books'}
                    </span>
                  </div>
                ))}
                {authors.length === 0 && (
                  <div className="text-gray-500 text-center py-2">
                    No authors found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Show PDF Viewer */}
        {showPdfViewer && selectedBook && (
          <PDFViewer
            pdfUrl={`http://localhost:5000${selectedBook.pdf}`}
            bookName={selectedBook.bookName}
            initialPage={readingProgress[selectedBook._id] || 1}
            onPageChange={(page) => handlePageChange(selectedBook._id, page)}
            onClose={handleClosePdf}
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

        {/* Library Assistant Button - Fixed Position */}
        <div className="fixed bottom-3 right-3 z-40">
          <button
            onClick={() => setShowChat(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-2.5 sm:px-3 rounded-full shadow-lg transition duration-300 flex items-center gap-1 text-xs sm:text-sm"
          >
            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Ask Assistant</span>
            <span className="sm:hidden">Ask</span>
          </button>
        </div>

        {/* Library Chat - Fixed Position */}
        {showChat && (
          <div className="fixed bottom-12 right-3 z-40">
            <LibraryChat
              books={books}
              onClose={() => setShowChat(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    bookName: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    available: PropTypes.number.isRequired,
    issued: PropTypes.number.isRequired,
    pdf: PropTypes.string,
  }).isRequired,
  onIssue: PropTypes.func,
  onReturn: PropTypes.func,
  isIssued: PropTypes.bool.isRequired,
  onReadBook: PropTypes.func,
  onDelete: PropTypes.func,
  isAdmin: PropTypes.bool.isRequired,
};

Library.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    issuedBooks: PropTypes.array,
  }),
  onUserUpdate: PropTypes.func.isRequired,
};

export default Library;
