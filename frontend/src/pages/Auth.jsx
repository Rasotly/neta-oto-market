import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { customerLogin, customerRegister } = useAuth();

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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const result = customerLogin(loginEmail, loginPassword);
    
    if (result.success) {
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      // Admin might go to /admin, customer to /
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
    if (!termsAccepted) {
      toast.error('Lütfen üyelik sözleşmesini kabul ediniz.');
      return;
    }

    const result = customerRegister({
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });

    if (result.success) {
      toast.success('Hesabınız başarıyla oluşturuldu!');
      navigate('/');
    } else {
      toast.error(result.message);
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
                type="text" 
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
    </div>
  );
};

export default Auth;
