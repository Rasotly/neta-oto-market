import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLoginModule from 'react-facebook-login/dist/facebook-login-render-props';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { customerLogin, customerRegister, finalizeRegistration, socialLogin } = useAuth();
  
  const handleGoogleSuccess = async (tokenResponse) => {
    // google sends an access_token. We need to send it to our backend.
    const result = await socialLogin('google', tokenResponse.access_token);
    if (result.success) {
      toast.success('Google ile giriş başarılı!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google girişi başarısız oldu.')
  });

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      const result = await socialLogin('facebook', response.accessToken);
      if (result.success) {
        toast.success('Facebook ile giriş başarılı!');
        navigate('/');
      } else {
        toast.error(result.message);
      }
    } else {
      toast.error('Facebook girişi iptal edildi veya başarısız oldu.');
    }
  };

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow flex items-start justify-center p-4 sm:p-12 pt-8 sm:pt-16">
        <div className="auth-card w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
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

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-sm text-gray-500">veya şununla devam et</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => loginWithGoogle()}
                className="flex items-center justify-center gap-2 bg-white border-none outline-none shadow-sm hover:bg-gray-50 text-gray-700 font-medium text-sm py-3 rounded-xl transition-colors w-full"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.45-1.89l1.23-.95z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google ile Giriş
              </button>
              
              <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID"}
                callback={responseFacebook}
                render={renderProps => (
                  <button 
                    type="button" 
                    onClick={renderProps.onClick}
                    className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white border-none outline-none font-medium text-sm py-3 rounded-xl transition-colors w-full"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073C24 5.449 18.627 0 12 0S0 5.449 0 12.073C0 18.066 4.388 23.031 10.125 24v-8.437H7.078v-3.49h3.047V9.418c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.031 24 18.066 24 12.073z" fill="currentColor"/>
                    </svg>
                    Facebook ile Giriş
                  </button>
                )}
              />
            </div>
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

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-sm text-gray-500">veya şununla devam et</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => loginWithGoogle()}
                className="flex items-center justify-center gap-2 bg-white border-none outline-none shadow-sm hover:bg-gray-50 text-gray-700 font-medium text-sm py-3 rounded-xl transition-colors w-full"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.45-1.89l1.23-.95z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google ile Giriş
              </button>
              
              <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID"}
                callback={responseFacebook}
                render={renderProps => (
                  <button 
                    type="button" 
                    onClick={renderProps.onClick}
                    className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white border-none outline-none font-medium text-sm py-3 rounded-xl transition-colors w-full"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073C24 5.449 18.627 0 12 0S0 5.449 0 12.073C0 18.066 4.388 23.031 10.125 24v-8.437H7.078v-3.49h3.047V9.418c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.031 24 18.066 24 12.073z" fill="currentColor"/>
                    </svg>
                    Facebook ile Giriş
                  </button>
                )}
              />
            </div>
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
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
