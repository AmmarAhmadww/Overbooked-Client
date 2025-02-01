import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Register component that handles user registration using email
 */
const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    isAdmin: false,
    adminCode: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /**
   * Handles input field changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Handles form submission and user registration
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
          Create a new account
        </h2>
        <p className="mt-4 text-center text-lg text-gray-400">
          Or{' '}
          <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-[#121212] py-8 px-6 shadow-xl rounded-lg sm:px-10 border border-gray-800">
          {error && (
            <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full bg-[#1a1a1a] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full bg-[#1a1a1a] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full bg-[#1a1a1a] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="isAdmin"
                name="isAdmin"
                type="checkbox"
                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 bg-[#1a1a1a] border-gray-700 rounded"
                checked={formData.isAdmin}
                onChange={handleChange}
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-300">
                Register as Administrator
              </label>
            </div>

            {formData.isAdmin && (
              <div>
                <label htmlFor="adminCode" className="block text-sm font-medium text-gray-300">
                  Admin Registration Code
                </label>
                <input
                  id="adminCode"
                  name="adminCode"
                  type="password"
                  className="mt-1 block w-full bg-[#1a1a1a] border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  value={formData.adminCode}
                  onChange={handleChange}
                  placeholder="Enter admin code"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-[#121212]"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
