import React, { useState } from "react";
import { Bell, Trash2, BookPlus, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'NEW_BOOK':
      return <BookPlus className="h-5 w-5 text-green-500" />;
    case 'BOOK_DELETED':
      return <Trash2 className="h-5 w-5 text-red-500" />;
    default:
      return <BookOpen className="h-5 w-5 text-blue-500" />;
  }
};

const Notifications = ({ notifications, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const navigate = useNavigate();

  const handleNotificationClick = async (notification) => {
    try {
      // Mark notification as read
      await fetch(`http://localhost:5000/notifications/${notification._id}/read`, {
        method: "POST"
      });

      // If it's a new book notification and has a bookId, navigate to it
      if (notification.type === 'NEW_BOOK' && notification.bookId) {
        navigate('/books', { 
          state: { 
            scrollToBookId: notification.bookId,
            highlightBookId: notification.bookId 
          } 
        });
      }

      // Close the notifications dropdown
      setIsOpen(false);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'NEW_BOOK':
        return 'border-l-4 border-green-500';
      case 'BOOK_DELETED':
        return 'border-l-4 border-red-500';
      default:
        return 'border-l-4 border-blue-500';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-yellow-300 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={onClear}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  } ${getNotificationStyle(notification.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <NotificationIcon type={notification.type} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications; 