import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PDFViewer = ({ pdfUrl, onClose, bookName, isPreview = false }) => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPreview) {
      loadPreviewPages();
    }
  }, [pdfUrl, isPreview]);

  const loadPreviewPages = async () => {
    try {
      const bookId = pdfUrl.split('/').pop().split('.')[0];
      const response = await fetch(`http://localhost:5001/library/preview-pages/${bookId}`);
      const data = await response.json();
      setPages(data.pages);
    } catch (error) {
      console.error('Error loading preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(curr => curr + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(curr => curr - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-[9999] flex flex-col">
      <div className="bg-[#1E1E1E] p-4 flex justify-between items-center border-b border-gray-800">
        <div>
          <span className="text-white font-semibold">{bookName}</span>
          {isPreview && (
            <span className="ml-4 text-yellow-400 text-sm">
              Preview Version (First 10 pages only)
            </span>
          )}
        </div>
        <div className="flex gap-4">
          {isPreview && (
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
            >
              Issue to Read Full Book
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg transition-all duration-300"
          >
            Close Reader
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#1E1E1E] overflow-hidden relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white">Loading preview...</div>
          </div>
        ) : (
          <>
            {/* Page Navigation */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-2 bg-gray-800 rounded-full disabled:opacity-50"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
              <button
                onClick={handleNextPage}
                disabled={currentPage === pages.length - 1}
                className="p-2 bg-gray-800 rounded-full disabled:opacity-50"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Page Display */}
            <div className="h-full flex items-center justify-center p-4">
              {pages.length > 0 ? (
                <img
                  src={`data:image/png;base64,${pages[currentPage]}`}
                  alt={`Page ${currentPage + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-white">No preview available</div>
              )}
            </div>

            {/* Page Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg text-white">
              Page {currentPage + 1} of {pages.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFViewer; 