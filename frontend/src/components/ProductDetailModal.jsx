import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close-btn absolute-close" onClick={onClose}>
          <X size={28} />
        </button>

        <div className="product-detail-layout">
          {/* Left Column - Image */}
          <div className="product-detail-image-wrapper">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
            ) : (
              <div className="product-detail-placeholder">
                <ShoppingBag size={64} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <span>Görsel Yok</span>
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="product-detail-info">
            <div>
              <span className="product-detail-category">{product.category}</span>
              <h2 className="product-detail-title">{product.name}</h2>
              <div className="product-detail-price-row">
                <span className="product-detail-price">
                  {product.price ? formatPrice(product.price) : 'Fiyat Belirtilmemiş'}
                </span>
                <span className={`status-badge ${product.inStock ? 'status-in-stock' : 'status-out-stock'}`}>
                  {product.inStock ? 'Stokta Var' : 'Tükendi'}
                </span>
              </div>
            </div>

            <div className="product-detail-desc-container">
              <h4>Ürün Açıklaması</h4>
              <p className="product-detail-desc">
                {product.description || 'Bu ürün için detaylı bir açıklama girilmemiş.'}
              </p>
            </div>

            <div className="product-detail-actions">
              <button 
                className="btn btn-add-cart w-full btn-large" 
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
