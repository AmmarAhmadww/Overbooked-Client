import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import LoadingAnimation from './components/LoadingAnimation';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Force loading animation for 1.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const glitchContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const glitchItem = {
    hidden: { 
      y: 20, 
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
      }
    }
  };

  if (isLoading) {
    return <LoadingAnimation onComplete={() => setIsLoading(false)} duration={1500} />;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-white text-center py-28 relative overflow-hidden"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-6xl font-extrabold mb-8 leading-tight">
              Your Digital Library
              <br />
              <span className="text-cyan-400">Reimagined</span>
            </h2>
            <p className="text-2xl leading-relaxed mb-12 max-w-3xl mx-auto text-gray-300">
              Discover thousands of books, manage your reading list, and connect with fellow readers. 
              Your next great read is just a click away.
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/books"
                className="bg-cyan-500 text-white py-4 px-8 rounded-full font-semibold shadow-lg hover:bg-cyan-600 transition duration-300 text-lg"
              >
                Browse Books
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="bg-transparent border-2 border-cyan-400 text-cyan-400 py-4 px-8 rounded-full font-semibold hover:bg-cyan-400 hover:text-black transition duration-300 text-lg"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="py-20 bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-4xl font-bold text-center text-white mb-16">
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
                <div key={index} className="text-center p-6 rounded-xl hover:bg-[#1a1a1a] transition duration-300 border border-gray-800">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h4 className="text-2xl font-semibold mb-4 text-white">{feature.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "10,000+", label: "Books Available" },
                { number: "5,000+", label: "Active Readers" },
                { number: "1,000+", label: "Digital Books" },
                { number: "24/7", label: "Library Access" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-cyan-900 to-cyan-800 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h3 className="text-4xl font-bold mb-6">Ready to Start Reading?</h3>
            <p className="text-xl mb-8 text-gray-300">
              Join thousands of readers who have already discovered their next favorite book.
            </p>
            <Link
              to="/register"
              className="inline-block bg-cyan-400 text-black py-4 px-8 rounded-full font-semibold hover:bg-cyan-300 transition duration-300 text-lg"
            >
              Create Your Account
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0a0a0a] text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
              <div>
                <h4 className="text-2xl font-bold mb-4 text-cyan-400">Overbooked</h4>
                <p className="text-gray-400">Your digital library solution for the modern age.</p>
              </div>
              <div>
                <h5 className="font-semibold mb-4 text-white">Quick Links</h5>
                <ul className="space-y-2">
                  <li><Link to="/books" className="text-gray-400 hover:text-cyan-400">Browse Books</Link></li>
                  {!user && (
                    <>
                      <li><Link to="/register" className="text-gray-400 hover:text-cyan-400">Sign Up</Link></li>
                      <li><Link to="/login" className="text-gray-400 hover:text-cyan-400">Login</Link></li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-4 text-white">Support</h5>
                <ul className="space-y-2">
                  <li><a href="/help" className="text-gray-400 hover:text-cyan-400">Help Center</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-cyan-400">Contact Us</a></li>
                  <li><a href="/faq" className="text-gray-400 hover:text-cyan-400">FAQs</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-4 text-white">Connect</h5>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-cyan-400">Twitter</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-cyan-400">Facebook</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-cyan-400">Instagram</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-400">
                &copy; 2024 <span className="font-bold text-cyan-400">Overbooked</span>. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;
  