import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove('access_token'); 
    setIsMenuOpen(false);
    navigate('/signup');
  };

  useEffect(() => {
    const token = Cookies.get('access_token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <header className="hidden md:block py-4 bg-purple-200">
        <nav className="flex justify-between items-center w-full px-12">
          <h1 className="text-2xl font-bold text-purple-700">MindWell AI</h1>
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className="text-lg text-purple-700 no-underline hover:text-purple-800 hover:underline focus:outline-none transition duration-300"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-lg text-purple-700 no-underline hover:text-purple-800 hover:underline focus:outline-none transition duration-300"
            >
              About
            </Link>
            <Link 
              to="/resources" 
              className="text-lg text-purple-700 no-underline hover:text-purple-800 hover:underline focus:outline-none transition duration-300"
            >
              Resources
            </Link>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout} 
                className="text-lg text-purple-700 no-underline hover:text-purple-800 focus:outline-none transition duration-300"
              >
                Log Out
              </button>
            ) : (
              <Link 
                to="/signup" 
                className="text-lg text-purple-700 no-underline hover:text-purple-800 hover:underline focus:outline-none transition duration-300"
              >
                Sign Up
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Header for Small Screens */}
      <header className="block md:hidden py-4 bg-purple-200">
        <nav className="flex justify-between items-center w-full px-4">
          <h1 className="text-2xl font-bold text-purple-700">MindWell AI</h1>
          <div className="flex items-center">
            <button 
              onClick={toggleMenu} 
              className="text-purple-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 mx-4 w-48 bg-white rounded-lg shadow-lg z-10">
          <div className="p-4 space-y-2">
            <Link 
              to="/" 
              className="block text-lg text-purple-700 no-underline hover:text-purple-800 hover:underline focus:outline-none transition duration-300 w-full text-left"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block text-lg text-purple-700 no-underline hover:text-purple-800 hover:underline focus:outline-none transition duration-300 w-full text-left"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/resources" 
              className="block text-lg text-purple-700 no-underline hover:text-purple-800 hover:underline focus:outline-none transition duration-300 w-full text-left"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout} 
                className="block text-lg text-purple-700 no-underline hover:text-purple-800 focus:outline-none transition duration-300 w-full text-left"
              >
                Log Out
              </button>
            ) : (
              <Link 
                to="/signup" 
                className="block text-lg text-purple-700 no-underline hover:text-purple-800 hover:underline focus:outline-none transition duration-300 w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
