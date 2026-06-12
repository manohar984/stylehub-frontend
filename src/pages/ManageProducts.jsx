import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductTable from '../components/ProductTable';
import { toast } from 'react-toastify';
import { HiClipboardList, HiPlus, HiSearch, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProducts({
        search,
        page,
        limit: 10 // Show 10 per page on admin table
      });
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotalProducts(data.totalProducts || 0);
    } catch (err) {
      console.error('Error loading products for admin:', err);
      toast.error('Failed to load catalog products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]); // Re-fetch on page change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    try {
      await apiService.deleteProduct(id);
      toast.success('Product deleted successfully!');
      
      // If we are deleting the last product of the page, decrement page
      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadProducts();
      }
    } catch (err) {
      console.error('Delete product error:', err);
      const errMsg = err.response?.data?.message || 'Server error deleting product';
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg-200 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Header Actions */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                <HiClipboardList className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <span>Manage Products</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Maintain catalog inventory records, edit pricing, or delete outdated items.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/admin/add-product')}
              className="inline-flex items-center justify-center space-x-1.5 px-4 h-11 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all duration-150 flex-shrink-0"
            >
              <HiPlus className="w-4.5 h-4.5" />
              <span>Create Product</span>
            </button>
          </div>

          {/* Filtering Header panel */}
          <section className="glass-card rounded-2xl p-4 mb-6 transition-colors duration-200">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 transition-all duration-155"
                />
                <HiSearch className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
              <button
                type="submit"
                className="h-10 px-5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-650 transition-all duration-150"
              >
                Apply Filter
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); setPage(1); setTimeout(loadProducts, 0); }}
                  className="h-10 px-4 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
                >
                  Clear
                </button>
              )}
            </form>
          </section>

          {/* Table content listing */}
          {loading ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center">
              <div className="relative w-10 h-10 mb-2">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-650 animate-spin"></div>
              </div>
              <p className="text-xs text-slate-450">Loading database entries...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <ProductTable products={products} onDelete={handleDeleteProduct} />

              {/* Table pagination controls */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-between pt-4">
                  <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">
                    Showing <span className="font-bold">{products.length}</span> of{' '}
                    <span className="font-bold">{totalProducts}</span> total results
                  </p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-150"
                    >
                      <HiChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="inline-flex items-center px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold bg-white dark:bg-darkbg-100 select-none">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-150"
                    >
                      <HiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </nav>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageProducts;
