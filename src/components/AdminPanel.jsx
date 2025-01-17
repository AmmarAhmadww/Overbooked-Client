import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Toast from './Toast';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const AdminPanel = ({ user }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(true);
  const [bookRequests, setBookRequests] = useState([]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchPendingRequests();
      fetchBookRequests();
    }
  }, [user]);

  const fetchPendingRequests = async () => {
    if (!user?._id) return;

    try {
      const response = await fetch("http://localhost:5000/admin/pending-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user._id })
      });

      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        message: "Error loading requests",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/library/book-requests');
      if (!response.ok) throw new Error('Failed to fetch book requests');
      const data = await response.json();
      setBookRequests(data);
    } catch (error) {
      console.error('Error fetching book requests:', error);
    }
  };

  const handleRequest = async (bookID, requestID, userID, status) => {
    try {
      const response = await fetch("http://localhost:5000/admin/handle-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookID, requestID, userID, status })
      });

      if (!response.ok) throw new Error("Failed to handle request");

      setToast({
        show: true,
        message: `Request ${status} successfully`,
        type: "success"
      });

      fetchPendingRequests();
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        message: "Error handling request",
        type: "error"
      });
    }
  };

  const handleBookRequest = async (requestId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/library/book-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update request');

      setToast({
        show: true,
        message: `Request ${status} successfully`,
        type: 'success'
      });

      fetchBookRequests();
    } catch (error) {
      setToast({
        show: true,
        message: error.message,
        type: 'error'
      });
    }
  };

  if (!user?.isAdmin) {
    return <Navigate to="/library" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs>
        <TabList>
          <Tab>Issue Requests</Tab>
          <Tab>Book Requests</Tab>
        </TabList>

        <TabPanel>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Books Waiting to be Issued</h2>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-600">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingRequests.map(book => (
                    <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg">
                      <div className="flex">
                        <div className="flex-shrink-0 w-48">
                          <img 
                            src={book.cover} 
                            alt={book.bookName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold text-gray-900">{book.bookName}</h3>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              Available: {book.available}
                            </span>
                          </div>
                          
                          <div className="mt-4 space-y-4">
                            {book.requests.map(request => (
                              <div key={request._id} className="bg-gray-50 rounded-lg p-4">
                                <div className="sm:flex sm:justify-between sm:items-center">
                                  <div className="mb-4 sm:mb-0">
                                    <div className="flex items-center">
                                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      <p className="ml-2 text-sm font-medium text-gray-900">{request.user.username}</p>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                      <p className="flex items-center">
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {request.user.email}
                                      </p>
                                      <p className="flex items-center mt-1">
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(request.requestDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-3">
                                    <button
                                      onClick={() => handleRequest(book._id, request._id, request.user._id, "approved")}
                                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRequest(book._id, request._id, request.user._id, "declined")}
                                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Requested Books</h2>
            </div>
            
            <div className="p-6">
              {bookRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No book requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookRequests.map((request) => (
                    <div key={request._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{request.bookName}</h3>
                          <p className="text-gray-600">by {request.author}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Requested by: {request.userName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Reason: {request.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBookRequest(request._id, 'approved')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleBookRequest(request._id, 'rejected')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabPanel>
      </Tabs>
      
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default AdminPanel; 