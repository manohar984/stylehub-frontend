import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMoon, HiSun, HiShieldCheck, HiOutlineShoppingBag } from 'react-icons/hi';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-darkbg-100/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
              <HiOutlineShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-700 dark:from-white dark:to-indigo-400 bg-clip-text text-transparent">
              StyleHub<span className="text-indigo-600 dark:text-indigo-400">.</span>
            </span>
          </Link>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>

            {/* Admin Portal Redirection */}
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                {!isAdminPath ? (
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center space-x-1 px-4 h-10 text-sm font-semibold rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-900/30 transition-all duration-200"
                  >
                    <HiShieldCheck className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <button
                    onClick={logout}
                    className="px-4 h-10 text-sm font-semibold rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-all duration-200"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
