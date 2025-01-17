import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Users, FolderOpen } from 'lucide-react';
import Toast from './Toast';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';

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
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [readingProgress, setReadingProgress] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user._id) {
      navigate('/login');
      return;
    }
    fetchIssuedBooks();
  }, [user, navigate]);

  const fetchIssuedBooks = async () => {
    try {
      if (!user || !user._id) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`http://localhost:5000/library/issued-books/${user._id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch issued books");
      }
      
      const data = await response.json();
      console.log("Fetched issued books:", data);
      setIssuedBooks(data);
    } catch (error) {
      console.error("Error fetching issued books:", error);
      setToast({
        show: true,
        message: error.message || "Failed to fetch issued books",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async (bookID) => {
    try {
      const response = await fetch('http://localhost:5000/library/returnBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookID, userID: user._id }),
      });

      if (!response.ok) throw new Error('Failed to return book');

      setToast({
        show: true,
        message: 'Book returned successfully!',
        type: 'success'
      });

      fetchIssuedBooks();
    } catch (error) {
      console.error("Error returning book:", error);
      setToast({
        show: true,
        message: error.message || 'Failed to return book',
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

  const handlePageChange = (bookId, page) => {
    setReadingProgress(prev => ({
      ...prev,
      [bookId]: page
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Issued Books</h1>
        
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : issuedBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">You haven't issued any books yet.</p>
            <button
              onClick={() => navigate('/books')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {issuedBooks.map((issuedBook) => {
              const book = issuedBook.bookDetails || {};
              return (
                <div key={issuedBook.bookID} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative h-[420px]">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {book?.bookName || 'Unknown Title'}
                      </h4>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center">
                          <Star className="h-5 w-5 text-yellow-400" />
                        </div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="font-semibold">{book?.rating || 0}/5</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-600">Author</p>
                        <p className="font-semibold line-clamp-1">{book?.author || 'Unknown'}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-center">
                          <FolderOpen className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold">{book?.category || 'Uncategorized'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => returnBook(issuedBook.bookID)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300"
                      >
                        Return Book
                      </button>
                      
                      {book?.pdf && (
                        <button
                          onClick={() => handleReadBook({
                            ...book,
                            _id: issuedBook.bookID
                          })}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                        >
                          <BookOpen className="h-5 w-5" />
                          Read Book
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
    </div>
  );
};

export default MyBooks; 