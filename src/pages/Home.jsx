import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { HiSearch, HiAdjustments, HiChevronLeft, HiChevronRight, HiOutlineEmojiSad } from 'react-icons/hi';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [activeSearch, setActiveSearch] = useState(''); // Debounced search trigger

  // Load products when query parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await apiService.getProducts({
          search: activeSearch,
          category,
          sort,
          page,
          limit: 8
        });
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.totalProducts || 0);
        
        // Dynamically set active categories, keeping 'All' as the first choice
        if (data.categories) {
          setCategories(['All', ...data.categories]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeSearch, category, sort, page]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(search);
    setPage(1); // Reset to page 1
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setActiveSearch('');
    setCategory('All');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg-200 text-slate-800 dark:text-slate-100 transition-colors duration-200 pb-12">
      <Navbar />

      {/* Premium Dark Hero Section */}
      <header className="relative py-8 bg-slate-50 dark:bg-darkbg-200 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 md:p-12 shadow-xl border border-slate-800/80">
            {/* Ambient Lighting Blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex px-3 py-1 rounded-full text-[9px] font-extrabold tracking-widest bg-white/10 text-indigo-300 border border-white/5 uppercase">
                StyleHub Collection 2026
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight md:leading-none">
                Curated Essentials for the <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Modern Wardrobe.
                </span>
              </h1>
              <p className="max-w-md text-xs md:text-sm text-slate-300 font-light leading-relaxed">
                Discover a high-end luxury storefront layout, meticulously structured for premium items, instant search response times, and interactive category selection filters.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Search and Filters Drawer */}
        <section className="glass-card rounded-3xl p-5 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center transition-colors duration-200">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search products by name, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-24 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 transition-all duration-200"
            />
            <HiSearch className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 h-8 px-4 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-150"
            >
              Search
            </button>
          </form>

          {/* Sorting and Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center space-x-2 text-sm">
              <HiAdjustments className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">Sort By:</span>
            </div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="h-11 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/65 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-500 transition-all duration-200"
            >
              <option value="newest">Newest Uploads</option>
              <option value="oldest">Oldest Uploads</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            {(activeSearch || category !== 'All') && (
              <button
                onClick={handleClearFilters}
                className="h-11 px-4 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all duration-150"
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {/* Category Pills Navigation */}
        <section className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap shadow-sm border ${
                  category === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-600/10'
                    : 'bg-white dark:bg-darkbg-100 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/60 hover:border-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        {loading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
            </div>
            <p className="text-sm text-slate-400">Loading StyleHub catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-white dark:bg-darkbg-100 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
              <HiOutlineEmojiSad className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Products Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm text-center">
              We couldn't find matches for your search keywords. Try adjusting your query or category selection!
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-bold rounded-2xl shadow-lg shadow-indigo-600/10 transition-all duration-150"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            {/* Catalog Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-bold text-slate-900 dark:text-white">{products.length}</span> of{' '}
                <span className="font-bold text-slate-900 dark:text-white">{totalProducts}</span> products
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center space-x-1 px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800/60 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
                >
                  <HiChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="hidden sm:flex space-x-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-150 ${
                        page === p
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center space-x-1 px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
                >
                  <span>Next</span>
                  <HiChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
