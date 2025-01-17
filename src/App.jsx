import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Home from './home';
import Login from './login';
import Register from './register';
import Library from './books';
import Addbook from './addbook';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Help from './pages/Help';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import MyBooks from './components/MyBooks';
import Notifications from './components/Notifications';
import AboutUs from './pages/AboutUs';

const App = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Set up polling for real-time notifications
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
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
    if (!user) return;

    try {
      await fetch(`http://localhost:5000/notifications/${user._id}/clear`, {
        method: "POST",
      });
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/library/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: user._id }),
      });

      if (response.ok) {
        localStorage.removeItem('user');
        setUser(null);
        setNotifications([]); // Clear notifications on logout
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-white">
          <Link to="/" className="text-3xl font-extrabold tracking-wide">
            Overbooked
          </Link>
          <ul className="flex items-center space-x-8 text-lg">
            <li>
              <Link to="/" className="hover:text-yellow-300 transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/books" className="hover:text-yellow-300 transition duration-300">
                Books
              </Link>
            </li>
            <li>
              <Link to="/my-books" className="hover:text-yellow-300 transition duration-300">
                My Books
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Notifications 
                    notifications={notifications} 
                    onClear={clearNotifications}
                  />
                </li>
                <li>
                  <span className="text-yellow-300">Welcome, {user.username}!</span>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="ml-4 bg-yellow-300 text-blue-800 px-3 py-1 rounded hover:bg-yellow-400 transition duration-300"
                    >
                      Admin Panel
                    </Link>
                  )}
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-yellow-300 transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/register" className="hover:text-yellow-300 transition duration-300">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-yellow-300 transition duration-300">
                    Login
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/about" className="hover:text-yellow-300 transition duration-300">
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books" element={<Library user={user} onUserUpdate={handleUserUpdate} />} />
        <Route path="/addbook" element={<Addbook user={user} />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/admin" element={<AdminPanel user={user} />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </div>
  );
};

export default App;
