import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { CheckCircle, ShieldCheck, CreditCard, ChevronLeft } from 'lucide-react';
import '../App.css';

const Checkout = () => {
  const contextData = useCart() || {};
  const cartItems = contextData.cartItems || [];
  const cartTotal = contextData.cartTotal || 0;
  const clearCart = contextData.clearCart || (() => {});
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [step, setStep] = useState(1); // 1: Teslimat, 2: Ödeme, 3: Başarı
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    cityDistrict: '',
    address: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [errors, setErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const grandTotal = cartTotal;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors) setErrors(false);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.cityDistrict.trim() || !formData.address.trim()) {
      setErrors(true);
      return;
    }
    setErrors(false);
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.cardName.trim() || !formData.cardNumber.trim() || !formData.cardExpiry.trim() || !formData.cardCvv.trim()) {
      setErrors(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
      clearCart();
    }, 1500);
  };

  if (step === 3) {
    return (
      <div className="checkout-page-success">
        <CheckCircle size={96} className="checkout-success-icon" />
        <h2 className="checkout-success-title">Siparişiniz Başarıyla Alındı!</h2>
        <p className="checkout-success-desc">Müşteri temsilcimiz sipariş onayı için WhatsApp üzerinden sizinle iletişime geçecektir.</p>
        <Link to="/" className="checkout-success-btn">
          Alışverişe Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      {/* Left Column - Form */}
      <div className="checkout-left-col">
        <div className="checkout-left-content">
          <Link to="/" className="checkout-logo">
            NETA OTO MARKET
          </Link>
          
          <div className="checkout-breadcrumb">
            <span className={step >= 1 ? 'active' : ''}>Sepet</span>
            <span className="separator">&gt;</span>
            <span className={step >= 1 ? 'active' : ''}>Bilgi</span>
            <span className="separator">&gt;</span>
            <span className={step >= 1 ? 'active' : ''}>Kargo</span>
            <span className="separator">&gt;</span>
            <span className={step === 2 ? 'active' : ''}>Ödeme</span>
          </div>

          {step === 1 && (
            <form id="checkout-form" onSubmit={handleNextStep} className="checkout-page-form">
              <div className="form-section">
                <h2 className="section-title">İletişim</h2>
                <div className="input-group">
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className={`page-input ${errors && !formData.phone.trim() ? 'input-error' : ''}`} 
                    placeholder="Cep telefonu numarası" 
                  />
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Teslimat Adresi</h2>
                <div className="input-group">
                  <input 
                    type="text" 
                    name="cityDistrict" 
                    value={formData.cityDistrict}
                    onChange={handleChange}
                    className={`page-input ${errors && !formData.cityDistrict.trim() ? 'input-error' : ''}`} 
                    placeholder="İl / İlçe" 
                  />
                </div>
                
                <div className="input-group">
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`page-input ${errors && !formData.fullName.trim() ? 'input-error' : ''}`} 
                    placeholder="Ad ve Soyad" 
                  />
                </div>
                
                <div className="input-group">
                  <textarea 
                    name="address" 
                    rows="3" 
                    value={formData.address}
                    onChange={handleChange}
                    className={`page-textarea ${errors && !formData.address.trim() ? 'input-error' : ''}`} 
                    placeholder="Açık adres (Mahalle, sokak, no, daire vb.)"
                  />
                </div>
              </div>

              <div className="checkout-actions">
                <Link to="/" className="checkout-back-link">
                  <ChevronLeft size={18} />
                  Sepete geri dön
                </Link>
                <button 
                  type="submit" 
                  className="page-submit-btn"
                  disabled={cartItems.length === 0}
                >
                  Ödeme Adımına Geç
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form id="payment-form" onSubmit={handlePaymentSubmit} className="checkout-page-form">
              <div className="form-section">
                <div className="payment-header">
                  <h2 className="section-title">Ödeme Bilgileri</h2>
                  <div className="secure-badge">
                    <ShieldCheck size={18} />
                    <span>Güvenli Ödeme (256-bit SSL)</span>
                  </div>
                </div>

                <div className="input-group">
                  <input 
                    type="text" 
                    name="cardName" 
                    value={formData.cardName}
                    onChange={handleChange}
                    className={`page-input ${errors && !formData.cardName.trim() ? 'input-error' : ''}`} 
                    placeholder="Kart Üzerindeki İsim" 
                  />
                </div>
                
                <div className="input-group relative-input">
                  <input 
                    type="text" 
                    name="cardNumber" 
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className={`page-input card-input ${errors && !formData.cardNumber.trim() ? 'input-error' : ''}`} 
                    placeholder="Kart Numarası" 
                    maxLength="19"
                  />
                  <CreditCard className="input-icon" size={20} />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <input 
                      type="text" 
                      name="cardExpiry" 
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      className={`page-input ${errors && !formData.cardExpiry.trim() ? 'input-error' : ''}`} 
                      placeholder="Son Kullanma (AA/YY)" 
                      maxLength="5"
                    />
                  </div>
                  
                  <div className="input-group">
                    <input 
                      type="text" 
                      name="cardCvv" 
                      value={formData.cardCvv}
                      onChange={handleChange}
                      className={`page-input ${errors && !formData.cardCvv.trim() ? 'input-error' : ''}`} 
                      placeholder="CVV" 
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-actions">
                <button 
                  type="button" 
                  className="checkout-back-link borderless" 
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  <ChevronLeft size={18} />
                  Bilgilere dön
                </button>
                <button 
                  type="submit" 
                  className="page-submit-btn"
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting ? <span className="spinner"></span> : 'Ödemeyi Tamamla'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Column - Summary */}
      <div className="checkout-right-col">
        <div className="checkout-right-content">
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-img-wrapper">
                  <div className="summary-item-img">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <div className="img-placeholder"></div>}
                  </div>
                  <span className="summary-item-badge">{item.quantity}</span>
                </div>
                <div className="summary-item-info">
                  <span className="summary-item-name">{item.name}</span>
                </div>
                <span className="summary-item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Ara Toplam</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>Kargo</span>
              <span>Ücretsiz</span>
            </div>
            <div className="summary-row summary-grand-total">
              <span>Toplam</span>
              <div className="total-price-wrapper">
                <span className="currency">TRL</span>
                <span className="amount">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
