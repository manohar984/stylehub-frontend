import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiChartBar, 
  HiPlusCircle, 
  HiClipboardList, 
  HiLogout, 
  HiUser 
} from 'react-icons/hi';

const Sidebar = () => {
  const { logout, admin } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: HiChartBar
    },
    {
      name: 'Add Product',
      path: '/admin/add-product',
      icon: HiPlusCircle
    },
    {
      name: 'Manage Products',
      path: '/admin/manage-products',
      icon: HiClipboardList
    }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-darkbg-100 border-r border-slate-200/60 dark:border-slate-800/60 transition-colors duration-200">
      <div className="flex flex-col h-full md:min-h-[calc(100vh-64px)] justify-between p-4 md:p-6">
        <div className="space-y-6">
          {/* User Profile Info */}
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
              <HiUser className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Logged In As</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">{admin?.username || 'admin'}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="pt-4 md:pt-0 border-t border-slate-100 dark:border-slate-800/60 md:border-none mt-6">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/15 transition-all duration-200"
          >
            <HiLogout className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
