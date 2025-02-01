import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Users, FolderOpen } from 'lucide-react';
import Toast from './Toast';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { motion } from 'framer-motion';
import LoadingAnimation from './LoadingAnimation';
import * as pdfjs from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ pdfUrl, onClose, bookName, initialPage = 1, onPageChange }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const zoomPluginInstance = zoomPlugin();

  const handlePageChange = React.useCallback((e) => {
    const currentPage = e.currentPage + 1;
    if (onPageChange) {
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
              plugins={[defaultLayoutPluginInstance, zoomPluginInstance]}
              defaultScale={1}
              initialPage={initialPage - 1}
              onPageChange={handlePageChange}
              theme={{ theme: 'dark' }}
              className="h-full overflow-auto"
            />
          </div>
        </Worker>
      </div>
    </div>
  );
};

const MyBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [readingProgress, setReadingProgress] = useState(() => {
    const savedProgress = localStorage.getItem('readingProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [visibleDescriptions, setVisibleDescriptions] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [bookPages, setBookPages] = useState({});
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!initialLoading) {
      let mounted = true;

      const loadIssuedBooks = async () => {
        if (!user?._id) {
          navigate('/login');
          return;
        }

        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5000/library/issued-books/${user._id}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch issued books');
          }
          
          const data = await response.json();
          console.log('Fetched issued books:', data);
          
          if (mounted) {
            setIssuedBooks(data);
            setError('');
          }
        } catch (error) {
          console.error('Error fetching issued books:', error);
          if (mounted) {
            setError(error.message);
            setToast({
              show: true,
              message: 'Failed to load issued books',
              type: 'error'
            });
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

      loadIssuedBooks();

      return () => {
        mounted = false;
      };
    }
  }, [user?._id, navigate, initialLoading]);

  useEffect(() => {
    if (!initialLoading && user?._id) {
      let mounted = true;

      const loadReadingProgress = async () => {
        try {
          const response = await fetch(`http://localhost:5000/library/reading-progress/${user._id}`);
          if (!response.ok) throw new Error('Failed to fetch reading progress');
          
          const data = await response.json();
          if (mounted) {
            const progressMap = {};
            data.forEach(item => {
              progressMap[item.bookId] = item.page;
            });
            setReadingProgress(prev => ({
              ...prev,
              ...progressMap
            }));
            // Save to localStorage
            localStorage.setItem('readingProgress', JSON.stringify(progressMap));
          }
        } catch (error) {
          console.error('Error loading reading progress:', error);
        }
      };

      loadReadingProgress();
      return () => {
        mounted = false;
      };
    }
  }, [user?._id, initialLoading]);

  useEffect(() => {
    const loadPageCounts = async () => {
      const pageCounts = {};
      for (const issuedBook of issuedBooks) {
        if (issuedBook.bookDetails?.pdf) {
          try {
            const pdfUrl = `http://localhost:5000${issuedBook.bookDetails.pdf}`;
            console.log('Loading PDF:', pdfUrl); // Debug log
            const pageCount = await getTotalPages(pdfUrl);
            if (pageCount) {
              pageCounts[issuedBook.bookID] = pageCount;
              console.log(`Book ${issuedBook.bookID} has ${pageCount} pages`); // Debug log
            }
          } catch (error) {
            console.error(`Error loading pages for book ${issuedBook.bookID}:`, error);
          }
        }
      }
      console.log('Final page counts:', pageCounts); // Debug log
      setBookPages(pageCounts);
    };

    if (issuedBooks.length > 0) {
      loadPageCounts();
    }
  }, [issuedBooks]);

  useEffect(() => {
    console.log('Current bookPages state:', bookPages);
  }, [bookPages]);

  const returnBook = async (bookID) => {
    try {
      const response = await fetch('http://localhost:5000/library/returnBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookID,
          userID: user._id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to return book');
      }

      setIssuedBooks(prevBooks => 
        prevBooks.filter(book => book.bookID !== bookID)
      );

      setToast({
        show: true,
        message: 'Book returned successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error returning book:', error);
      setToast({
        show: true,
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleReadBook = (book) => {
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
  };

  const handleClosePdf = () => {
    setShowPdfViewer(false);
    setSelectedBook(null);
  };

  const saveReadingActivity = async (bookId, page) => {
    try {
      const response = await fetch('http://localhost:5000/library/reading-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          bookId: bookId,
          page: page,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save reading activity');
      }
    } catch (error) {
      console.error('Error saving reading activity:', error);
      setToast({
        show: true,
        message: 'Failed to save reading progress',
        type: 'error'
      });
    }
  };

  const handlePageChange = (bookId, page) => {
    const newProgress = {
      ...readingProgress,
      [bookId]: page
    };
    
    setReadingProgress(newProgress);
    
    localStorage.setItem('readingProgress', JSON.stringify(newProgress));
    
    saveReadingActivity(bookId, page);
  };

  const toggleDescription = (bookId) => {
    setVisibleDescriptions(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const getTotalPages = async (pdfUrl) => {
    try {
      console.log('Fetching PDF from:', pdfUrl);
      const loadingTask = pdfjs.getDocument({
        url: pdfUrl,
        worker: new pdfjs.PDFWorker({
          workerSrc: 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'
        })
      });
      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;
      console.log('Page count:', pageCount);
      return pageCount;
    } catch (error) {
      console.error('Error getting PDF pages:', error);
      return null;
    }
  };

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

  if (initialLoading || loading) {
    return <LoadingAnimation onComplete={() => setInitialLoading(false)} duration={1200} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black py-4"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-4xl font-bold text-white mb-6"
        >
          My Issued Books
        </motion.h1>
        
        {issuedBooks.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl shadow-md">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">You haven't issued any books yet.</p>
            <button
              onClick={() => navigate('/books')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6"
          >
            {issuedBooks.map((issuedBook) => {
              const book = issuedBook.bookDetails || {};
              const currentPage = readingProgress[issuedBook.bookID] || 0;
              const totalPages = bookPages[issuedBook.bookID] || 0;
              const progressPercentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
              
              console.log(`Rendering book ${issuedBook.bookID}:`, { 
                currentPage, 
                totalPages, 
                progressPercentage 
              }); // Debug log

              return (
                <motion.div
                  key={issuedBook.bookID}
                  variants={itemVariants}
                  className="bg-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden flex flex-col hover:scale-105 transition-transform duration-300"
                >
                  {/* Book Cover */}
                  <div className="relative h-[400px]">
                    <img 
                      src={book?.cover ? 
                        (book.cover.startsWith('http') ? book.cover : `http://localhost:5000${book.cover}`)
                        : 'https://via.placeholder.com/400x600?text=No+Cover+Available'
                      } 
                      alt={book?.bookName || 'Book Cover'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x600?text=No+Cover+Available';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-60" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-2xl font-bold text-white mb-2">
                        {book?.bookName || 'Unknown Title'}
                      </h4>
                      <p className="text-gray-200 text-base">
                        by {book?.author || 'Unknown Author'}
                      </p>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="p-6 space-y-4 flex-1 bg-[#1a1a1a]">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-[#242424] p-3 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <Star className="h-5 w-5 text-yellow-400" />
                        </div>
                        <p className="text-lg font-medium text-white">{book?.rating || 0}/5</p>
                        <p className="text-xs text-gray-400">Rating</p>
                      </div>
                      <div className="bg-[#242424] p-3 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <FolderOpen className="h-5 w-5 text-blue-400" />
                        </div>
                        <p className="text-lg font-medium text-white">{book?.category || 'N/A'}</p>
                        <p className="text-xs text-gray-400">Category</p>
                      </div>
                      <div className="bg-[#242424] p-3 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <BookOpen className="h-5 w-5 text-green-400" />
                        </div>
                        <p className="text-lg font-medium text-white">
                          {currentPage}
                        </p>
                        <p className="text-xs text-gray-400">Current Page</p>
                      </div>
                    </div>

                    {/* Progress Report */}
                    <div className="p-4 bg-[#242424] rounded-lg">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Reading Progress</span>
                        <span>
                          {currentPage} / {totalPages > 0 ? totalPages : 'Loading...'} pages
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <p className="text-right text-xs text-gray-500 mt-1">
                        {totalPages > 0 ? `${progressPercentage}% Complete` : 'Loading progress...'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => returnBook(issuedBook.bookID)}
                        className="flex-1 bg-transparent hover:bg-yellow-600/10 text-yellow-500 border border-yellow-600/50 font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                      >
                        Return Book
                      </button>
                      
                      {book?.pdf && (
                        <button
                          onClick={() => handleReadBook({
                            ...book,
                            _id: issuedBook.bookID
                          })}
                          className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/50 font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        >
                          <BookOpen className="h-4 w-4" />
                          Read Book
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {showPdfViewer && selectedBook && (
          <PDFViewer
            pdfUrl={`http://localhost:5000${selectedBook.pdf}`}
            bookName={selectedBook.bookName}
            initialPage={readingProgress[selectedBook._id] || 1}
            onPageChange={(page) => handlePageChange(selectedBook._id, page)}
            onClose={handleClosePdf}
          />
        )}

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: 'success' })}
          />
        )}
      </div>
    </motion.div>
  );
};

export default MyBooks; 