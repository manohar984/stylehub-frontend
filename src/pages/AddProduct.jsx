import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import { HiPlusCircle, HiArrowLeft, HiUpload, HiPlus } from 'react-icons/hi';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle local image file preview selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error('Only image files (JPEG, JPG, PNG, WEBP) are allowed!');
        return;
      }
      setImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!name.trim() || !description.trim() || !category.trim() || !price || stock === '') {
      toast.error('Please fill in all product fields!');
      return;
    }

    if (parseFloat(price) < 0) {
      toast.error('Price cannot be a negative value!');
      return;
    }

    if (parseInt(stock) < 0) {
      toast.error('Stock count cannot be a negative value!');
      return;
    }

    if (!image) {
      toast.error('Please upload a product cover image!');
      return;
    }

    setLoading(true);

    try {
      // Package as Multipart FormData
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('image', image);

      await apiService.createProduct(formData);
      toast.success('Product uploaded successfully!');
      navigate('/admin/manage-products');
    } catch (error) {
      console.error('Add product error:', error);
      const errMsg = error.response?.data?.message || 'Server error creating product';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg-200 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8 flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/manage-products')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 transition-all duration-150"
              title="Go Back"
            >
              <HiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                <HiPlusCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <span>Add New Product</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Upload and list a new item to the StyleHub store collection.
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="max-w-4xl rounded-3xl glass-card border border-slate-200/50 dark:border-slate-800/40 p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Image upload preview box */}
              <div className="flex flex-col space-y-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wider">
                  Product Image
                </span>
                
                <div className="relative group flex-1 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer transition-all duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-15"
                  />
                  
                  {imagePreview ? (
                    <div className="relative w-full h-full min-h-[300px]">
                      <img
                        src={imagePreview}
                        alt="Product upload preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <span className="px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-md">
                          Replace Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="p-4 bg-indigo-55/20 text-indigo-600 dark:text-indigo-400 rounded-full">
                        <HiUpload className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-350">Upload a file</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          PNG, JPG, JPEG, WEBP up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Metadata Fields */}
              <div className="space-y-5">
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter product title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all duration-150"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shoes, Jackets, Watches"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all duration-150"
                    list="category-suggestions"
                  />
                  <datalist id="category-suggestions">
                    <option value="Apparel" />
                    <option value="Accessories" />
                    <option value="Footwear" />
                    <option value="Electronics" />
                  </datalist>
                </div>

                {/* Price and Stock Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      placeholder="99.99"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all duration-150"
                    />
                  </div>
                  
                  {/* Stock */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="10"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all duration-150"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    required
                    placeholder="Enter short details about the product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all duration-150 resize-none text-sm"
                  ></textarea>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150 pt-1"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  ) : (
                    <>
                      <HiPlus className="w-4 h-4" />
                      <span>Save and Publish</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
