import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { customerLogin, customerRegister, finalizeRegistration } = useAuth();
  
  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [tempUserData, setTempUserData] = useState(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Exception for admin email logic
    if (loginEmail !== 'admin' && !emailRegex.test(loginEmail)) {
      toast.error('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }

    const result = customerLogin(loginEmail, loginPassword);
    
    if (result.success) {
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      if (loginEmail === 'admin' || loginEmail === 'admin@admin.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      toast.error(result.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    
    if (!emailRegex.test(regEmail)) {
      toast.error('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }

    if (!termsAccepted) {
      toast.error('Lütfen üyelik sözleşmesini kabul ediniz.');
      return;
    }

    const userData = {
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone,
      password: regPassword
    };

    const result = customerRegister(userData);

    if (result.success) {
      // Don't register yet, show OTP modal
      setTempUserData(userData);
      setShowOtpModal(true);
    } else {
      toast.error(result.message);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1); // Keep only last char if multiple pasted
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = () => {
    const code = otpValues.join('');
    if (code === '123456') {
      const result = finalizeRegistration(tempUserData);
      if (result.success) {
        toast.success('Hesabınız başarıyla oluşturuldu!');
        setShowOtpModal(false);
        navigate('/');
      } else {
        toast.error(result.message);
      }
    } else {
      toast.error('Girdiğiniz kod hatalı, lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header / Logo */}
        <div className="auth-header">
          <h2>NETA OTO MARKET</h2>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
            type="button"
          >
            Giriş Yap
          </button>
          <button 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
            type="button"
          >
            Kayıt Ol
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="auth-input-group">
              <input 
                type="email" 
                className="auth-input" 
                placeholder="E-posta Adresi" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-input-group password-group">
              <input 
                type={showPassword ? "text" : "password"} 
                className="auth-input" 
                placeholder="Şifre" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="auth-form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Beni Hatırla</span>
              </label>
              <a href="#" className="forgot-password">Şifremi Unuttum</a>
            </div>

            <button type="submit" className="auth-submit-btn login-btn">
              Giriş Yap
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="auth-row">
              <div className="auth-input-group">
                <input 
                  type="text" 
                  className="auth-input" 
                  placeholder="Ad" 
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="auth-input-group">
                <input 
                  type="text" 
                  className="auth-input" 
                  placeholder="Soyad" 
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <input 
                type="email" 
                className="auth-input" 
                placeholder="E-posta Adresi" 
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <input 
                type="tel" 
                className="auth-input" 
                placeholder="Cep Telefonu" 
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group password-group">
              <input 
                type={showPassword ? "text" : "password"} 
                className="auth-input" 
                placeholder="Şifre" 
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <label className="terms-checkbox">
              <input 
                type="checkbox" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span><a href="#">Üyelik Sözleşmesini</a> ve <a href="#">Aydınlatma Metnini</a> okudum, kabul ediyorum.</span>
            </label>

            <button type="submit" className="auth-submit-btn register-btn">
              Hesap Oluştur
            </button>
          </form>
        )}
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay" style={{ zIndex: 60 }}>
          <div className="modal-content auth-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>E-posta Doğrulama</h3>
            <p style={{ marginBottom: '1.5rem', color: '#4b5563', fontSize: '0.95rem' }}>
              Girdiğiniz e-posta adresine 6 haneli bir kod gönderdik.
            </p>
            
            <div className="otp-inputs-container">
              {otpValues.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="auth-input otp-box"
                />
              ))}
            </div>

            <button type="button" className="auth-submit-btn register-btn" onClick={handleOtpSubmit}>
              Doğrula ve Hesabı Aç
            </button>
            <button 
              type="button" 
              className="text-btn" 
              style={{ marginTop: '1rem', display: 'block', width: '100%' }}
              onClick={() => setShowOtpModal(false)}
            >
              İptal Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
