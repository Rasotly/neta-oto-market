import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product, onClick, onEdit, onDelete }) => {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(product);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(product);
  };

  return (
    <div className="product-card" onClick={() => onClick(product)} style={{ cursor: 'pointer', position: 'relative' }}>
      
      {/* Admin Actions */}
      {isAdmin && (
        <div className="card-admin-actions">
          <button className="admin-btn admin-btn-edit" onClick={handleEdit} title="Düzenle">
            <Edit2 size={16} />
          </button>
          <button className="admin-btn admin-btn-delete" onClick={handleDelete} title="Sil">
            <Trash2 size={16} />
          </button>
        </div>
      )}

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
          {product.price ? formatPrice(product.price) : 'Fiyat Belirtilmemiş'}
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
        onClick={handleAddToCart}
      >
        {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
      </button>
    </div>
  );
};

export default ProductCard;
