import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";

const Header = ({ user }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Set up WebSocket or polling for real-time notifications
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:5000/notifications/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const clearNotifications = async () => {
    try {
      await fetch(`http://localhost:5000/notifications/${user._id}/clear`, {
        method: "POST",
      });
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Overbooked
        </Link>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Notifications 
                notifications={notifications} 
                onClear={clearNotifications}
              />
              <span className="text-gray-600">
                {user.username}
                {user.isAdmin && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Admin
                  </span>
                )}
              </span>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/books"
                className="text-gray-600 hover:text-gray-900"
              >
                Browse Books
              </Link>
              <Link
                to="/my-books"
                className="text-gray-600 hover:text-gray-900"
              >
                My Books
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.reload();
                }}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 