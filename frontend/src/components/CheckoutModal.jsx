import React, { useState } from 'react';
import { X, CheckCircle, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const shippingFee = cartTotal > 500 ? 0 : 49.90;
  const grandTotal = cartTotal + shippingFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Yükleme simülasyonu
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  const handleClose = () => {
    // State'leri sıfırla ve kapat
    setIsSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content checkout-modal-content">
        <div className="modal-header">
          <h2>{isSuccess ? 'İşlem Başarılı' : 'Teslimat ve Ödeme'}</h2>
          {!isSubmitting && (
            <button className="icon-btn modal-close-btn" onClick={handleClose} type="button">
              <X size={24} />
            </button>
          )}
        </div>

        {isSuccess ? (
          <div className="checkout-success">
            <CheckCircle size={80} className="success-icon" />
            <h3>Siparişiniz Başarıyla Alındı!</h3>
            <p>Bizi tercih ettiğiniz için teşekkür ederiz. Sipariş detaylarınız e-posta adresinize gönderilecektir.</p>
            <button className="btn btn-primary mt-4" onClick={handleClose}>
              Alışverişe Dön
            </button>
          </div>
        ) : (
          <div className="checkout-layout">
            <div className="checkout-form-section">
              <form id="checkout-form" onSubmit={handleSubmit}>
                <h3 className="section-title">Müşteri Bilgileri</h3>
                <div className="form-group">
                  <label>Ad Soyad *</label>
                  <input type="text" name="fullName" required placeholder="Örn: Ahmet Yılmaz" />
                </div>
                <div className="form-group">
                  <label>Telefon Numarası *</label>
                  <input type="tel" name="phone" required placeholder="05XX XXX XX XX" />
                </div>
                <div className="form-group">
                  <label>Açık Adres *</label>
                  <textarea name="address" rows="3" required placeholder="Teslimat adresinizi giriniz..."></textarea>
                </div>

                <h3 className="section-title mt-4">Ödeme Bilgileri</h3>
                <div className="form-group">
                  <label>Kart Numarası *</label>
                  <input type="text" name="cardNumber" required placeholder="XXXX XXXX XXXX XXXX" maxLength="19" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Son Kullanma *</label>
                    <input type="text" name="expiry" required placeholder="AA/YY" maxLength="5" />
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input type="text" name="cvv" required placeholder="XXX" maxLength="3" />
                  </div>
                </div>
              </form>
            </div>

            <div className="checkout-summary-section">
              <h3 className="section-title">Sipariş Özeti</h3>
              <div className="checkout-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item">
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      <span className="checkout-item-qty">x{item.quantity}</span>
                    </div>
                    <span className="checkout-item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="checkout-totals">
                <div className="checkout-total-row">
                  <span>Ara Toplam</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Kargo Ücreti</span>
                  <span>{shippingFee === 0 ? 'Ücretsiz' : formatPrice(shippingFee)}</span>
                </div>
                <div className="checkout-total-row grand-total">
                  <span>Genel Toplam</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form" 
                className="btn btn-primary btn-checkout-submit w-full"
                disabled={isSubmitting || cartItems.length === 0}
              >
                {isSubmitting ? (
                  <span className="spinner"></span>
                ) : (
                  <>Siparişi Onayla</>
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
