import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { HiLockClosed, HiUser, HiOutlineShieldCheck } from 'react-icons/hi';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, bypass login screen
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Check URL query parameters for notifications (e.g., expired sessions)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('message') === 'session_expired') {
      toast.warning('Session expired. Please log in again.');
      // Clean query string
      navigate('/admin', { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple verification
    if (!username.trim() || !password) {
      toast.error('Please fill in all credential fields!');
      return;
    }

    setLoading(true);

    try {
      const data = await apiService.loginAdmin({ username, password });
      
      // Update Context
      login(data.token);
      
      toast.success('Access Granted! Welcome to StyleHub Dashboard.');
      
      // Redirect to dashboard or previously requested protected URL
      const origin = location.state?.from?.pathname || '/admin/dashboard';
      navigate(origin, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.message || 'Invalid username or password';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg-200 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-between pb-12">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-up">
          
          {/* Logo / Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-600/20 mb-3">
              <HiOutlineShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Portal</h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              StyleHub Enterprise Product Management System
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl glass-card border border-slate-200/50 dark:border-slate-800/40 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all duration-150"
                  />
                  <HiUser className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all duration-150"
                  />
                  <HiLockClosed className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150 mt-6"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </form>
          </div>

          {/* Quick Info Hint */}
          <div className="text-center mt-6">
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800/40 px-3 py-1.5 rounded-full border border-slate-250/20 dark:border-slate-800/20">
              Demo Credentials: <span className="font-bold text-slate-650 dark:text-slate-300">admin</span> / <span className="font-bold text-slate-650 dark:text-slate-300">admin123</span>
            </span>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
