import React from 'react';
import { apiService } from '../services/api';
import { HiInbox } from 'react-icons/hi';

const ProductCard = ({ product }) => {
  const serverBase = apiService.getServerURL();
  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `${serverBase}${product.image}`)
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group flex flex-col h-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-500">
      
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] w-full bg-slate-150 dark:bg-slate-800/20 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Availability Banner */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-4 py-2 rounded-full text-[10px] font-extrabold bg-red-650 text-white shadow-lg shadow-red-600/30 tracking-widest uppercase border border-red-500/30">
              Sold Out
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute top-4 right-4">
            <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-widest shadow-md">
              Only {product.stock} Left
            </span>
          </div>
        ) : null}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col p-6 space-y-4">
        <div className="flex-1 space-y-1">
          {/* Category Tag */}
          <p className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            {product.category}
          </p>
          
          {/* Product Name */}
          <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors duration-250">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-450 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Pricing and Stock Detail */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <HiInbox className="w-3.5 h-3.5 text-slate-350" />
            <span>{product.stock} Units</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
