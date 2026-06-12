import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import { HiPencilAlt, HiArrowLeft, HiUpload, HiCheck } from 'react-icons/hi';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null); // Selected new file
  const [existingImage, setExistingImage] = useState(''); // Current server path
  const [imagePreview, setImagePreview] = useState(null); // Local preview url

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load existing product metadata
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await apiService.getProductById(id);
        setName(product.name || '');
        setDescription(product.description || '');
        setCategory(product.category || '');
        setPrice(product.price ? product.price.toString() : '');
        setStock(product.stock !== undefined ? product.stock.toString() : '');
        setExistingImage(product.image || '');
      } catch (err) {
        console.error('Error fetching product details:', err);
        toast.error('Failed to retrieve product metadata.');
        navigate('/admin/manage-products');
      } finally {
        setFetching(false);
      }
    };
    loadProduct();
  }, [id, navigate]);

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

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('stock', stock);
      if (image) {
        formData.append('image', image);
      }

      await apiService.updateProduct(id, formData);
      toast.success('Product updated successfully!');
      navigate('/admin/manage-products');
    } catch (error) {
      console.error('Update product error:', error);
      const errMsg = error.response?.data?.message || 'Server error updating product';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Determine current image thumbnail source
  const serverBase = apiService.getServerURL();
  const currentImageSrc = imagePreview 
    ? imagePreview
    : (existingImage 
        ? (existingImage.startsWith('http') ? existingImage : `${serverBase}${existingImage}`)
        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
      );

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
                <HiPencilAlt className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <span>Edit Product Details</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Modify attributes or swap the display cover for this item.
              </p>
            </div>
          </div>

          {fetching ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center">
              <div className="relative w-10 h-10 mb-2">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-650 animate-spin"></div>
              </div>
              <p className="text-xs text-slate-450">Retrieving item info...</p>
            </div>
          ) : (
            /* Form Area */
            <div className="max-w-4xl rounded-3xl glass-card border border-slate-200/50 dark:border-slate-800/40 p-8 shadow-xl animate-fade-in">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column: Image upload preview box */}
                <div className="flex flex-col space-y-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Product Image
                  </span>
                  
                  <div className="relative group flex-1 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 cursor-pointer transition-all duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-15"
                    />
                    
                    <div className="relative w-full h-full min-h-[300px]">
                      <img
                        src={currentImageSrc}
                        alt="Product visual view"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <span className="px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-md">
                          Replace Image
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Metadata Fields */}
                <div className="space-y-5">
                  {/* Product Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-405 uppercase tracking-wider">
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
                    />
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
                    className="w-full h-11 inline-flex items-center justify-center space-x-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150 pt-1"
                  >
                    {loading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    ) : (
                      <>
                        <HiCheck className="w-4 h-4" />
                        <span>Update and Save</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditProduct;
