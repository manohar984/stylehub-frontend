import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  HiCollection, 
  HiTag, 
  HiDatabase, 
  HiClock, 
  HiTrendingUp,
  HiOutlineEmojiSad
} from 'react-icons/hi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to fetch dashboard statistics. Verify that the backend server is running and database is connected.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg-200 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Dashboard Panel */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time operational status and catalog statistics.
              </p>
            </div>
            {stats && (
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                stats.dbStatus === 'Connected' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30'
                  : 'bg-red-50 text-red-650 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${stats.dbStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span>Database: {stats.dbStatus}</span>
              </span>
            )}
          </div>

          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
              </div>
              <p className="text-sm text-slate-400">Loading system metrics...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 dark:bg-red-950/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-3xl">
              <div className="flex items-center space-x-3 mb-2 font-bold text-lg">
                <HiOutlineEmojiSad className="w-6 h-6" />
                <span>Operational Error</span>
              </div>
              <p className="text-sm leading-relaxed">{error}</p>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              
              {/* Analytics KPI Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Total Products */}
                <div className="rounded-2xl glass-card p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Products</p>
                    <h3 className="text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5">{stats.totalProducts}</h3>
                  </div>
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <HiCollection className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 2: Total Categories */}
                <div className="rounded-2xl glass-card p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Categories</p>
                    <h3 className="text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5">{stats.totalCategories}</h3>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl text-purple-600 dark:text-purple-400 shadow-sm">
                    <HiTag className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 3: Recent Uploads */}
                <div className="rounded-2xl glass-card p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Recent Activity</p>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white mt-3 truncate max-w-[150px]">
                      {stats.recentProducts.length > 0 ? stats.recentProducts[0].name : 'None'}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Last Item Uploaded</p>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl text-amber-600 dark:text-amber-400 shadow-sm">
                    <HiClock className="w-6 h-6" />
                  </div>
                </div>

                {/* Card 4: Database Health */}
                <div className="rounded-2xl glass-card p-6 border border-slate-200/50 dark:border-slate-800/40 shadow-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Database Status</p>
                    <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-450 mt-2.5">
                      {stats.dbStatus === 'Connected' ? 'Online' : 'Offline'}
                    </h3>
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    stats.dbStatus === 'Connected' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450' 
                      : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                  }`}>
                    <HiDatabase className="w-6 h-6" />
                  </div>
                </div>
              </section>

              {/* Data Visualization Section */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Category Product Distribution Chart */}
                <div className="rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-xl lg:col-span-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-slate-850 dark:text-white mb-6">
                      <HiTrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="font-bold text-base">Category Distribution</h4>
                    </div>

                    {stats.categoryStats.length === 0 ? (
                      <p className="text-sm text-slate-400 dark:text-slate-500 py-12 text-center">
                        No category data found.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {stats.categoryStats.map((item, index) => {
                          const percentage = stats.totalProducts > 0 
                            ? Math.round((item.count / stats.totalProducts) * 100) 
                            : 0;
                          
                          // Color sequence for bars
                          const colors = [
                            'bg-indigo-600 dark:bg-indigo-500', 
                            'bg-purple-600 dark:bg-purple-500', 
                            'bg-emerald-600 dark:bg-emerald-500',
                            'bg-amber-600 dark:bg-amber-500', 
                            'bg-sky-600 dark:bg-sky-500'
                          ];
                          const activeColor = colors[index % colors.length];

                          return (
                            <div key={item.category} className="space-y-1">
                              <div className="flex justify-between text-xs font-bold text-slate-650 dark:text-slate-350">
                                <span>{item.category}</span>
                                <span>{item.count} items ({percentage}%)</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${activeColor} transition-all duration-500`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Uploads Table */}
                <div className="rounded-2xl glass-card border border-slate-200/50 dark:border-slate-800/40 p-6 shadow-xl lg:col-span-2">
                  <div className="flex items-center space-x-2 text-slate-850 dark:text-white mb-6">
                    <HiClock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-base">Recent Product Uploads</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                          <th className="py-2.5">Product</th>
                          <th className="py-2.5">Category</th>
                          <th className="py-2.5">Price</th>
                          <th className="py-2.5">Stock</th>
                          <th className="py-2.5 text-right">Created Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                        {stats.recentProducts.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-10 text-center text-slate-400">
                              No recent uploads found.
                            </td>
                          </tr>
                        ) : (
                          stats.recentProducts.map((prod) => (
                            <tr key={prod._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10">
                              <td className="py-3 font-bold text-slate-800 dark:text-slate-200 max-w-[150px] truncate">
                                {prod.name}
                              </td>
                              <td className="py-3 text-slate-500 dark:text-slate-400">
                                {prod.category}
                              </td>
                              <td className="py-3 font-extrabold text-slate-900 dark:text-white">
                                {formatPrice(prod.price)}
                              </td>
                              <td className="py-3">
                                {prod.stock <= 0 ? (
                                  <span className="text-red-500 dark:text-red-400 font-bold uppercase tracking-wider text-[10px]">Out</span>
                                ) : (
                                  prod.stock
                                )}
                              </td>
                              <td className="py-3 text-right text-slate-450 dark:text-slate-500 font-normal">
                                {formatDate(prod.createdAt)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </section>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
