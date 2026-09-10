import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
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

  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get('step');
  
  const step = stepParam === 'success' ? 3 : stepParam === 'payment' ? 2 : 1;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!stepParam) {
      navigate('/checkout?step=address', { replace: true });
    }
  }, [stepParam, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    district: '',
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
    let { name, value } = e.target;
    if (name === 'phone') {
      let numbers = value.replace(/\D/g, '').substring(0, 10);
      let formatted = '';
      if (numbers.length > 0) formatted += numbers.substring(0, 3);
      if (numbers.length > 3) formatted += ' ' + numbers.substring(3, 6);
      if (numbers.length > 6) formatted += ' ' + numbers.substring(6, 8);
      if (numbers.length > 8) formatted += ' ' + numbers.substring(8, 10);
      value = formatted;
    }
    setFormData({ ...formData, [name]: value });
    if (errors) setErrors(false);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.city.trim() || !formData.district.trim() || !formData.address.trim()) {
      setErrors(true);
      return;
    }
    setErrors(false);
    navigate('/checkout?step=payment');
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
      navigate('/checkout?step=success');
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
            <span className={step >= 1 ? 'active font-bold text-black' : 'text-gray-400'}>Sepet</span>
            <span className="separator text-gray-400">&gt;</span>
            <span className={step >= 1 ? 'active font-bold text-black' : 'text-gray-400'}>İletişim & Adres</span>
            <span className="separator text-gray-400">&gt;</span>
            <span className={step >= 2 ? 'active font-bold text-black' : 'text-gray-400'}>Ödeme</span>
          </div>

          {step === 1 && (
            <form id="checkout-form" onSubmit={handleNextStep} className="checkout-page-form">
              <div className="form-section">
                <h2 className="section-title">İletişim & Adres</h2>
                
                <div className="input-group">
                  <label className="input-label">Cep Telefonu Numarası</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className={`page-input ${errors && !formData.phone.trim() ? 'input-error' : ''}`} 
                    placeholder="5XX XXX XX XX" 
                    maxLength="13"
                  />
                </div>

                <div className="checkout-grid-2">
                  <div className="input-group">
                    <label className="input-label">Ad</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`page-input ${errors && !formData.firstName.trim() ? 'input-error' : ''}`} 
                      placeholder="Adınız" 
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Soyad</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`page-input ${errors && !formData.lastName.trim() ? 'input-error' : ''}`} 
                      placeholder="Soyadınız" 
                    />
                  </div>
                </div>

                <div className="checkout-grid-2">
                  <div className="input-group">
                    <label className="input-label">İl</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city}
                      onChange={handleChange}
                      className={`page-input ${errors && !formData.city.trim() ? 'input-error' : ''}`} 
                      placeholder="Örn: İstanbul" 
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">İlçe</label>
                    <input 
                      type="text" 
                      name="district" 
                      value={formData.district}
                      onChange={handleChange}
                      className={`page-input ${errors && !formData.district.trim() ? 'input-error' : ''}`} 
                      placeholder="Örn: Kadıköy" 
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Açık Adres</label>
                  <textarea 
                    name="address" 
                    rows="3" 
                    value={formData.address}
                    onChange={handleChange}
                    className={`page-textarea ${errors && !formData.address.trim() ? 'input-error' : ''}`} 
                    placeholder="Mahalle, sokak, no, daire vb."
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
                  <label className="input-label">Kart Üzerindeki İsim</label>
                  <input 
                    type="text" 
                    name="cardName" 
                    value={formData.cardName}
                    onChange={handleChange}
                    className={`page-input ${errors && !formData.cardName.trim() ? 'input-error' : ''}`} 
                    placeholder="Örn: Ad Soyad" 
                  />
                </div>
                
                <div className="input-group relative-input">
                  <label className="input-label">Kart Numarası</label>
                  <input 
                    type="text" 
                    name="cardNumber" 
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className={`page-input card-input ${errors && !formData.cardNumber.trim() ? 'input-error' : ''}`} 
                    placeholder="XXXX XXXX XXXX XXXX" 
                    maxLength="19"
                  />
                  <CreditCard className="input-icon" size={20} style={{ top: '65%' }} />
                </div>

                <div className="checkout-grid-2">
                  <div className="input-group">
                    <label className="input-label">Son Kullanma</label>
                    <input 
                      type="text" 
                      name="cardExpiry" 
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      className={`page-input ${errors && !formData.cardExpiry.trim() ? 'input-error' : ''}`} 
                      placeholder="AA/YY" 
                      maxLength="5"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label className="input-label">CVV</label>
                    <input 
                      type="text" 
                      name="cardCvv" 
                      value={formData.cardCvv}
                      onChange={handleChange}
                      className={`page-input ${errors && !formData.cardCvv.trim() ? 'input-error' : ''}`} 
                      placeholder="123" 
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-actions">
                <button 
                  type="button" 
                  className="checkout-back-link borderless" 
                  onClick={() => navigate('/checkout?step=address')}
                  disabled={isSubmitting}
                >
                  <ChevronLeft size={18} />
                  Adres bilgilerine dön
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
