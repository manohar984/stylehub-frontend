import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { HiPencilAlt, HiTrash, HiExclamation } from 'react-icons/hi';

const ProductTable = ({ products, onDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const serverBase = apiService.getServerURL();

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowConfirmModal(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setShowConfirmModal(false);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete._id);
      closeDeleteModal();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-darkbg-100 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-100/30 dark:shadow-none transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-800/25">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Image</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Category</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Price</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Stock</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Created Date</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-darkbg-100">
                  No products found. Start by adding some!
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const imageUrl = product.image 
                  ? (product.image.startsWith('http') ? product.image : `${serverBase}${product.image}`)
                  : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&q=80';

                return (
                  <tr key={product._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150">
                    {/* Thumbnail Image */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/60 border border-slate-200/40 dark:border-slate-800/40">
                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">{product.name}</div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                      {formatPrice(product.price)}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.stock <= 0 ? (
                        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 uppercase tracking-wider">
                          Out of Stock
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 uppercase tracking-wider">
                          Low Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="text-sm text-slate-600 dark:text-slate-450">{product.stock}</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(product.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center items-center space-x-2">
                        <Link
                          to={`/admin/edit-product/${product._id}`}
                          className="p-2 rounded-lg text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all duration-150"
                          title="Edit Product"
                        >
                          <HiPencilAlt className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-2 rounded-lg text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-150"
                          title="Delete Product"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            onClick={closeDeleteModal}
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-[2px] transition-opacity duration-300"
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl scale-100 transform transition-transform duration-300">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-450 mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-2xl">
                <HiExclamation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Product</h3>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{productToDelete?.name}"</span>? This operation will remove the item permanently from the database and delete its stored image.
            </p>
            
            <div className="flex space-x-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-750 shadow-lg shadow-red-600/20 transition-all duration-150"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
