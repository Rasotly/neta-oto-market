import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={24} className="accent-icon" />
            <h2>Sepetim</h2>
          </div>
          <button className="icon-btn close-drawer" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="drawer-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <ShoppingBag size={48} />
              <p>Sepetiniz şu an boş.</p>
              <button className="btn btn-primary" onClick={onClose}>Alışverişe Devam Et</button>
            </div>
          ) : (
            <ul className="cart-items-list" style={{ gap: '0' }}>
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item" style={{ display: 'flex', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #e5e7eb' }}>
                  <div className="cart-item-img-wrapper" style={{ flexShrink: 0, marginRight: '1rem' }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="cart-item-img-placeholder">Görsel Yok</div>
                    )}
                  </div>
                  
                  <div className="cart-item-info" style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#111827' }}>{item.name}</h4>
                    <p className="cart-item-price" style={{ color: '#f97316', fontWeight: '600', margin: '0 0 0.75rem 0' }}>{item.price ? formatPrice(item.price) : 'Fiyat Yok'}</p>
                    
                    <div className="quantity-controls" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', border: '1px solid #d1d5db', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}><Minus size={14} /></button>
                      <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}><Plus size={14} /></button>
                    </div>
                  </div>

                  <button 
                    className="remove-item-btn" 
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: '#ef4444', marginLeft: '0.5rem' }}
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Ara Toplam:</span>
              <span style={{ color: '#111827', fontWeight: 'bold' }}>{formatPrice(cartTotal)}</span>
            </div>
            <button 
              className="btn btn-primary cart-checkout-btn" 
              onClick={handleCheckout}
            >
              Siparişi Tamamla
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
