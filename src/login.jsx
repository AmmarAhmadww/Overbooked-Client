import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";

/**
 * Login component that handles user authentication
 * @param {Object} props - Component props
 * @param {Function} props.onLogin - Callback function to handle successful login
 */
const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Handles input field changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles form submission and user authentication
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
        navigate("/");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
          Login to your account
        </h2>
        <p className="mt-4 text-center text-lg text-gray-400">
          Or{" "}
          <Link
            to="/register"
            className="font-medium text-cyan-400 hover:text-cyan-300"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-[#121212] py-10 px-6 shadow-xl sm:rounded-lg sm:px-12 border border-gray-800">
          {error && (
            <div
              className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline text-base">{error}</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="emailOrUsername"
                className="block text-base font-medium text-gray-300"
              >
                Email or Username
              </label>
              <div className="mt-2">
                <input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  required
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-md shadow-sm placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
                  placeholder="Enter your email or username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-md shadow-sm placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-[#121212]"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
