import React, { useState } from 'react';
import { X, CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    cityDistrict: '',
    address: ''
  });
  
  const [errors, setErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const grandTotal = cartTotal;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors) setErrors(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if any field is empty
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.cityDistrict.trim() || !formData.address.trim()) {
      setErrors(true);
      return;
    }

    setIsSubmitting(true);
    
    // Yükleme simülasyonu
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setErrors(false);
    setFormData({ fullName: '', phone: '', cityDistrict: '', address: '' });
    onClose();
  };

  return (
    <div className="checkout-backdrop">
      <div className="checkout-dialog">
        {!isSuccess && (
          <button className="checkout-close-btn" onClick={handleClose} type="button">
            <X size={24} />
          </button>
        )}

        {isSuccess ? (
          <div className="checkout-success-view">
            <CheckCircle size={96} className="checkout-success-icon" />
            <h2 className="checkout-success-title">Siparişiniz Başarıyla Alındı!</h2>
            <p className="checkout-success-desc">Müşteri temsilcimiz sipariş onayı için WhatsApp üzerinden sizinle iletişime geçecektir.</p>
            <button className="checkout-success-btn" onClick={handleClose}>
              Alışverişe Dön
            </button>
          </div>
        ) : (
          <div className="checkout-grid">
            <div className="checkout-form-side">
              <h2 className="checkout-side-title">Teslimat Bilgileri</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="checkout-form">
                
                <div className="checkout-input-group">
                  <label className="checkout-label">Ad Soyad</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`checkout-input ${errors && !formData.fullName.trim() ? 'input-error' : ''}`} 
                    placeholder="Örn: Ahmet Yılmaz" 
                  />
                </div>
                
                <div className="checkout-input-group">
                  <label className="checkout-label">Telefon Numarası</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className={`checkout-input ${errors && !formData.phone.trim() ? 'input-error' : ''}`} 
                    placeholder="05XX XXX XX XX" 
                  />
                </div>

                <div className="checkout-input-group">
                  <label className="checkout-label">İl / İlçe</label>
                  <input 
                    type="text" 
                    name="cityDistrict" 
                    value={formData.cityDistrict}
                    onChange={handleChange}
                    className={`checkout-input ${errors && !formData.cityDistrict.trim() ? 'input-error' : ''}`} 
                    placeholder="Örn: Kadıköy / İstanbul" 
                  />
                </div>
                
                <div className="checkout-input-group">
                  <label className="checkout-label">Açık Adres</label>
                  <textarea 
                    name="address" 
                    rows="3" 
                    value={formData.address}
                    onChange={handleChange}
                    className={`checkout-textarea ${errors && !formData.address.trim() ? 'input-error' : ''}`} 
                    placeholder="Teslimat adresinizi detaylıca giriniz..."
                  />
                </div>

              </form>
            </div>

            <div className="checkout-summary-side">
              <h2 className="checkout-side-title">Sipariş Özeti</h2>
              
              <div className="checkout-items-mini">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item-mini">
                    <div className="checkout-item-mini-img">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <Package size={24} />}
                    </div>
                    <div className="checkout-item-mini-info">
                      <span className="checkout-item-mini-name">{item.name}</span>
                      <span className="checkout-item-mini-qty">x{item.quantity}</span>
                    </div>
                    <span className="checkout-item-mini-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="checkout-grand-total">
                <span>Genel Toplam</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              <button 
                type="submit" 
                form="checkout-form" 
                className="checkout-submit-btn"
                disabled={isSubmitting || cartItems.length === 0}
              >
                {isSubmitting ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    Ödeme Adımına Geç
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
