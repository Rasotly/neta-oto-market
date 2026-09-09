import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-card-content">
        {product.imageUrl ? (
          <div className="product-image-wrapper">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
          </div>
        ) : (
          <div className="product-image-wrapper">
            <span className="product-image-placeholder">Görsel Yok</span>
          </div>
        )}
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description || 'Açıklama girilmemiş.'}</p>
        
        <p className="product-price">
          {product.price ? `${product.price} ₺` : 'Fiyat Belirtilmemiş'}
        </p>
        <p className="product-meta"><strong>Kategori:</strong> {product.category}</p>
        <div className="product-meta">
          <strong>Durum:</strong>{' '}
          <span className={`status-badge ${product.inStock ? 'status-in-stock' : 'status-out-stock'}`}>
            {product.inStock ? 'Stokta Var' : 'Tükendi'}
          </span>
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <button 
        className="btn btn-add-cart w-full mt-auto" 
        disabled={!product.inStock}
        onClick={() => addToCart(product)}
      >
        {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
      </button>
    </div>
  );
};

export default ProductCard;
