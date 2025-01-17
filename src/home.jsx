import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-green-400 text-white text-center py-28">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-6xl font-extrabold mb-8 leading-tight">
            Your Digital Library
            <br />
            <span className="text-yellow-300">Reimagined</span>
          </h2>
          <p className="text-2xl leading-relaxed mb-12 max-w-3xl mx-auto">
            Discover thousands of books, manage your reading list, and connect with fellow readers. 
            Your next great read is just a click away.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/books"
              className="bg-yellow-300 text-blue-800 py-4 px-8 rounded-full font-semibold shadow-lg hover:bg-yellow-400 transition duration-300 text-lg"
            >
              Browse Books
            </Link>
            {!user && (
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white py-4 px-8 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300 text-lg"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Why Choose Overbooked?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Vast Collection",
                description: "Access thousands of books across multiple genres and categories.",
                icon: "📚"
              },
              {
                title: "Easy Management",
                description: "Keep track of your borrowed books and reading history effortlessly.",
                icon: "✨"
              },
              {
                title: "Digital Access",
                description: "Read your favorite books anytime, anywhere with our digital collection.",
                icon: "💻"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-xl transition duration-300">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Books Available" },
              { number: "5,000+", label: "Active Readers" },
              { number: "1,000+", label: "Digital Books" },
              { number: "24/7", label: "Library Access" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold mb-6">Ready to Start Reading?</h3>
          <p className="text-xl mb-8">
            Join thousands of readers who have already discovered their next favorite book.
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-blue-600 py-4 px-8 rounded-full font-semibold hover:bg-yellow-300 transition duration-300 text-lg"
          >
            Create Your Account
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div>
              <h4 className="text-2xl font-bold mb-4">Overbooked</h4>
              <p className="text-gray-300">Your digital library solution for the modern age.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><Link to="/books" className="text-gray-300 hover:text-white">Browse Books</Link></li>
                {!user && (
                  <>
                    <li><Link to="/register" className="text-gray-300 hover:text-white">Sign Up</Link></li>
                    <li><Link to="/login" className="text-gray-300 hover:text-white">Login</Link></li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2">
                <li><a href="/help" className="text-gray-300 hover:text-white">Help Center</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white">Contact Us</a></li>
                <li><a href="/faq" className="text-gray-300 hover:text-white">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Facebook</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-blue-500 text-center">
            <p className="text-gray-300">
              &copy; 2024 <span className="font-bold">Overbooked</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
  