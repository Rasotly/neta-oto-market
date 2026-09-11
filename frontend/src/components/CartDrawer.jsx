import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout?step=address');
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
        <div className="drawer-header" style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="drawer-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={24} style={{ color: '#374151' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: '#0f172a', margin: 0 }}>Alışveriş Sepetim</h2>
          </div>
          <button className="cart-close-btn" onClick={onClose} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.4rem', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
            <span style={{ fontSize: '1rem', fontWeight: '400' }}>Kapat</span>
          </button>
        </div>

        <div className="drawer-content" style={{ display: 'flex', flexDirection: 'column' }}>
          {cartItems.length === 0 ? (
            <div className="empty-cart-message" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem', color: '#e5e7eb' }}>
                <ShoppingCart size={120} strokeWidth={1.5} />
                <X size={48} strokeWidth={2} style={{ position: 'absolute', top: '38%', left: '55%', transform: 'translate(-50%, -50%)' }} />
              </div>
              <p style={{ fontWeight: '600', color: '#111827', fontSize: '1.1rem', marginBottom: '2rem' }}>Sepetinizde ürün bulunmuyor.</p>
              <button
                className="btn btn-primary"
                onClick={onClose}
                style={{ padding: '0.75rem 2rem', borderRadius: '0.5rem', width: 'auto', fontWeight: '600' }}
              >
                Mağazaya Geri Dön
              </button>
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
