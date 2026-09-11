import React from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product, onClick }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = isFavorite(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success('Ürün sepete eklendi!', {
      style: {
        background: '#fff',
        color: '#4b5563',
        border: '1px solid #e5e7eb',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    });
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div className="product-card" onClick={() => onClick(product)} style={{ cursor: 'pointer' }}>
      {/* Favorite Button */}
      <button 
        className={`card-favorite-btn ${isFav ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        title="Favorilere Ekle"
      >
        <Heart size={20} fill={isFav ? 'var(--accent)' : 'none'} color={isFav ? 'var(--accent)' : 'var(--text)'} />
      </button>

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

        <div className="product-category-badge">{product.category}</div>
        
        <h3 className="product-title">{product.name}</h3>
        {product.description && (
          <p className="product-desc">{product.description}</p>
        )}
        
        <div className="price-stock-row">
          {product.price ? (
            <p className="product-price">
              {formatPrice(product.price).replace(' ₺', '')} <span className="price-currency">₺</span>
            </p>
          ) : (
            <p className="product-price" style={{ fontSize: '1rem', color: '#6b7280' }}>Fiyat Yok</p>
          )}

          <div className={`product-stock-indicator ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            <span className="stock-dot"></span>
            {product.inStock ? 'Stokta' : 'Tükendi'}
          </div>
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <button 
        className="btn-add-cart" 
        disabled={!product.inStock}
        onClick={handleAddToCart}
      >
        {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
      </button>
    </div>
  );
};

export default ProductCard;
