import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';
import FacebookLoginModule from 'react-facebook-login/dist/facebook-login-render-props';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatPhoneNumber } from '../utils/formatters';

const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpTimer, setOtpTimer] = useState(180);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [expectedOtp, setExpectedOtp] = useState('');
  const [tempUserData, setTempUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { customerLogin, customerRegister, finalizeRegistration, socialLogin, resendRegistrationOtp } = useAuth();
  
  useEffect(() => {
    let interval = null;
    if (showOtpModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

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

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginSubmitAttempted, setLoginSubmitAttempted] = useState(false);
  const [loginCaptchaToken, setLoginCaptchaToken] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setLoginEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Register Form State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [regGender, setRegGender] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [registerCaptchaToken, setRegisterCaptchaToken] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginSubmitAttempted(true);

    if (!loginEmail || !loginPassword || !loginCaptchaToken) {
      return;
    }
    
    // Exception for admin email logic
    if (loginEmail !== 'admin' && !emailRegex.test(loginEmail)) {
      toast.error('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }

    const result = await customerLogin(loginEmail, loginPassword, loginCaptchaToken);
    
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', loginEmail);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!regFirstName || !regLastName || !regEmail || !regPhone || regPassword.length < 6 || !regGender || !termsAccepted || !privacyAccepted || !registerCaptchaToken) {
      return;
    }

    if (!emailRegex.test(regEmail)) {
      toast.error('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }

    const userData = {
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      gender: regGender
    };

    const result = await customerRegister(userData, registerCaptchaToken);

    if (result.success) {
      // Don't register yet, show OTP modal
      setTempUserData(userData);
      setExpectedOtp(result.otp);
      setOtpTimer(180);
      setCanResendOtp(false);
      setOtpValues(['', '', '', '', '', '']);
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
    if (code.length < 6) {
      toast.error('Lütfen 6 haneli doğrulama kodunu eksiksiz girin.');
      return;
    }
    
    // Gerçek dinamik OTP kontrolü
    if (code === expectedOtp || (import.meta.env.DEV && code === '123456')) {
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

  const handleResendOtp = async () => {
    if (!canResendOtp) return;
    const result = await resendRegistrationOtp(tempUserData.email, tempUserData.firstName);
    if (result.success) {
      setExpectedOtp(result.otp);
      toast.success('Yeni doğrulama kodu e-posta adresinize gönderildi.');
      setOtpTimer(180);
      setCanResendOtp(false);
      setOtpValues(['', '', '', '', '', '']);
      // Focus first input
      setTimeout(() => {
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }, 100);
    } else {
      toast.error(result.message || 'Kod gönderilemedi.');
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow flex items-start justify-center p-4 sm:p-8 pt-4 sm:pt-8">
        <div className="auth-card w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-2 mb-8">
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
                <input 
                  type="checkbox" 
                  className="custom-checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Beni Hatırla</span>
              </label>
              <a href="#" className="forgot-password">Şifremi Unuttum</a>
            </div>

            <div className="flex flex-col items-start gap-2">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                onChange={(token) => setLoginCaptchaToken(token)}
              />
              {loginSubmitAttempted && !loginCaptchaToken && (
                <span className="text-red-500 text-[13px] font-medium mt-1">Lütfen robot olmadığınızı doğrulayın</span>
              )}
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
          <form onSubmit={handleRegisterSubmit} className="auth-form" noValidate>
            <div className="auth-row gap-4">
              <div className="auth-input-group relative w-full">
                <input 
                  type="text" 
                  className={`auth-input w-full ${submitAttempted && !regFirstName ? '!border-red-500' : ''}`} 
                  placeholder="Ad" 
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                />
                <span className="absolute right-3 top-[14px] text-red-500">*</span>
                {submitAttempted && !regFirstName && <span className="text-red-500 text-[11px] mt-1 block text-left">Lütfen Adı giriniz.</span>}
              </div>
              <div className="auth-input-group relative w-full">
                <input 
                  type="text" 
                  className={`auth-input w-full ${submitAttempted && !regLastName ? '!border-red-500' : ''}`} 
                  placeholder="Soyad" 
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                />
                <span className="absolute right-3 top-[14px] text-red-500">*</span>
                {submitAttempted && !regLastName && <span className="text-red-500 text-[11px] mt-1 block text-left">Lütfen Soyadı giriniz.</span>}
              </div>
            </div>

            <div className="auth-input-group relative">
              <input 
                type="email" 
                className={`auth-input w-full ${submitAttempted && !regEmail ? '!border-red-500' : ''}`} 
                placeholder="E-posta Adresi" 
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <span className="absolute right-3 top-[14px] text-red-500">*</span>
              {submitAttempted && !regEmail && <span className="text-red-500 text-[11px] mt-1 block text-left">Lütfen Email giriniz.</span>}
            </div>

            <div className="auth-input-group password-group relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className={`auth-input w-full ${submitAttempted && regPassword.length < 6 ? '!border-red-500' : ''}`} 
                placeholder="Şifre" 
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <span className="absolute right-12 top-[14px] text-red-500">*</span>
              <button 
                type="button" 
                className="password-toggle-btn absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {submitAttempted && regPassword.length < 6 && <span className="text-red-500 text-[11px] mt-1 block text-left">Şifre en az 6 karakter olmalıdır.</span>}
            </div>

            <div className="auth-input-group relative pl-1">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="Erkek" onChange={(e) => setRegGender(e.target.value)} className={`accent-[#D5A738] w-[18px] h-[18px] ${submitAttempted && !regGender ? 'outline outline-1 outline-red-500 rounded-full' : ''}`} />
                  <span className="text-[13px] text-gray-700">Erkek</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="Kadın" onChange={(e) => setRegGender(e.target.value)} className={`accent-[#D5A738] w-[18px] h-[18px] ${submitAttempted && !regGender ? 'outline outline-1 outline-red-500 rounded-full' : ''}`} />
                  <span className="text-[13px] text-gray-700">Kadın</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="Belirtmek istemiyorum" onChange={(e) => setRegGender(e.target.value)} className={`accent-[#D5A738] w-[18px] h-[18px] ${submitAttempted && !regGender ? 'outline outline-1 outline-red-500 rounded-full' : ''}`} />
                  <span className="text-[13px] text-gray-700">Belirtmek istemiyorum</span>
                </label>
              </div>
              {submitAttempted && !regGender && <span className="text-red-500 text-[11px] mt-1 block text-left">Lütfen Cinsiyet giriniz.</span>}
            </div>

            <div className="auth-input-group relative">
              <input 
                type="tel" 
                className={`auth-input w-full ${submitAttempted && !regPhone ? '!border-red-500' : ''}`} 
                placeholder="(5XX) XXX XX XX" 
                value={regPhone}
                onChange={(e) => setRegPhone(formatPhoneNumber(e.target.value))}
              />
              <span className="absolute right-3 top-[14px] text-red-500">*</span>
              {submitAttempted && !regPhone && <span className="text-red-500 text-[11px] mt-1 block text-left">Lütfen Cep Telefonu giriniz.</span>}
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <label className="terms-checkbox items-start flex gap-2">
                <input 
                  type="checkbox" 
                  className="mt-1 custom-checkbox"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                />
                <span className="text-sm">Aydınlatma Metninde belirtilen ilkeler nezdinde Elektronik Ticaret İletisi almak istiyorum.</span>
              </label>

              <label className="terms-checkbox items-start flex gap-2 relative">
                <input 
                  type="checkbox" 
                  className={`mt-1 custom-checkbox ${submitAttempted && !termsAccepted ? '!border-red-500' : ''}`}
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="text-sm"><span onClick={() => setShowTermsModal(true)} className="text-blue-600 underline hover:text-[#D5A738] transition-colors cursor-pointer">Üyelik sözleşmesini</span> kabul ediyorum.</span>
              </label>

              <label className="terms-checkbox items-start flex gap-2 relative">
                <input 
                  type="checkbox" 
                  className={`mt-1 custom-checkbox ${submitAttempted && !privacyAccepted ? '!border-red-500' : ''}`}
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                />
                <span className="text-sm">Kişisel verilerin işlenmesine ilişkin <span onClick={() => setShowPrivacyModal(true)} className="text-blue-600 underline hover:text-[#D5A738] transition-colors cursor-pointer">Aydınlatma Metnini</span> okudum.</span>
              </label>
            </div>

            <div className="flex flex-col items-start gap-2 -mt-2">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                onChange={(token) => setRegisterCaptchaToken(token)}
              />
              {submitAttempted && !registerCaptchaToken && (
                <span className="text-red-500 text-[13px] font-medium mt-1">Lütfen robot olmadığınızı doğrulayın</span>
              )}
            </div>

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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col p-8 relative items-center text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">E-postanızı Doğrulayın</h3>
            <p className="text-gray-600 text-sm mb-6">
              <span className="font-semibold text-gray-800">{tempUserData?.email}</span> adresine 6 haneli bir kod gönderdik.
            </p>
            
            <div className="flex gap-2 sm:gap-3 justify-center mb-6 w-full">
              {otpValues.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 border-2 border-gray-200 rounded-lg text-center text-xl font-semibold text-gray-800 focus:border-[#D5A738] focus:ring-2 focus:ring-[#D5A738]/20 transition-all outline-none"
                />
              ))}
            </div>

            <button 
              type="button" 
              className="w-full bg-[#D5A738] text-white font-semibold rounded-lg py-3 hover:bg-[#c29631] transition-colors shadow-md hover:shadow-lg mb-4" 
              onClick={handleOtpSubmit}
            >
              Doğrula
            </button>

            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="text-2xl font-mono font-bold text-gray-700 bg-gray-100 px-4 py-1 rounded-md">
                {formatTimer(otpTimer)}
              </span>
              
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResendOtp}
                className={`text-sm font-medium transition-colors ${
                  canResendOtp 
                    ? 'text-[#D5A738] hover:text-[#b58b29] underline cursor-pointer' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                Kodu Tekrar Gönder
              </button>
            </div>

            <button 
              type="button" 
              className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 rounded-full p-2 transition-all"
              onClick={() => setShowOtpModal(false)}
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowTermsModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 hover:text-gray-800 z-10 rounded-full p-2 transition-all flex items-center justify-center"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            
            <div className="p-6 sm:p-10 overflow-y-auto h-full text-left">
              <h2 className="text-2xl font-bold text-center mb-8 uppercase text-gray-800">Üyelik Sözleşmesi</h2>
              
              <div className="text-sm text-gray-600 space-y-6 leading-relaxed">
                <p className="font-semibold text-red-500">**ÖRNEKTİR. KULLANMADAN ÖNCE KENDİ SİTENİZE UYGUN BİR ŞEKİLDE DÜZENLEYİNİZ**</p>
                
                <div>
                  <h3 className="font-bold underline mb-2">ÜYELİK SÖZLEŞMESİ</h3>
                  <p>Lütfen sitemizi kullanmadan evvel bu 'site kullanım şartları'nı dikkatlice okuyunuz.</p>
                  <p className="mt-2">Bu alışveriş sitesini kullanan ve alışveriş yapan müşterilerimiz aşağıdaki şartları kabul etmiş varsayılmaktadır:</p>
                  <p className="mt-2">Sitemizdeki web sayfaları ve ona bağlı tüm sayfalar ('site') Neta Oto Market firmasına aittir ve onun tarafından işletilir. Sizler ('Kullanıcı') sitede sunulan tüm hizmetleri kullanırken aşağıdaki şartlara tabi olduğunuzu, sitedeki hizmetten yararlanmakla ve kullanmaya devam etmekle; Bağlı olduğunuz yasalara göre sözleşme imzalama hakkına, yetkisine ve hukuki ehliyetine sahip ve 18 yaşın üzerinde olduğunuzu, bu sözleşmeyi okuduğunuzu, anladığınızı ve sözleşmede yazan şartlarla bağlı olduğunuzu kabul etmiş sayılırsınız.</p>
                </div>

                <div>
                  <h3 className="font-bold underline mb-2">1. SORUMLULUKLAR</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Firma, fiyatlar ve sunulan ürün ve hizmetler üzerinde değişiklik yapma hakkını her zaman saklı tutar.</li>
                    <li>Firma, üyenin sözleşme konusu hizmetlerden, teknik arızalar dışında yararlandırılacağını kabul ve taahhüt eder.</li>
                    <li>Kullanıcı, sitenin kullanımında tersine mühendislik yapmayacağını ya da bunların kaynak kodunu bulmak veya elde etmek amacına yönelik herhangi bir başka işlemde bulunmayacağını aksi halde ve 3. Kişiler nezdinde doğacak zararlardan sorumlu olacağını, hakkında hukuki ve cezai işlem yapılacağını peşinen kabul eder.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold underline mb-2">2. FİKRİ MÜLKİYET HAKLARI</h3>
                  <p>2.1. İşbu Site'de yer alan ünvan, işletme adı, marka, patent, logo, tasarım, bilgi ve yöntem gibi tescilli veya tescilsiz tüm fikri mülkiyet hakları site işleteni ve sahibi firmaya veya belirtilen ilgilisine ait olup, ulusal ve uluslararası hukukun koruması altındadır. İşbu Site'nin ziyaret edilmesi veya bu Site'deki hizmetlerden yararlanılması söz konusu fikri mülkiyet hakları konusunda hiçbir hak vermez.</p>
                  <p className="mt-2">2.2. Site'de yer alan bilgiler hiçbir şekilde çoğaltılamaz, yayınlanamaz, kopyalanamaz, sunulamaz ve/veya aktarılamaz. Site'nin bütünü veya bir kısmı diğer bir internet sitesinde izinsiz olarak kullanılamaz.</p>
                </div>
                
                <div>
                  <h3 className="font-bold underline mb-2">3. GİZLİ BİLGİ</h3>
                  <p>3.1. Firma, site üzerinden kullanıcıların ilettiği kişisel bilgileri 3. Kişilere açıklamayacaktır. Bu kişisel bilgiler; kişi adı-soyadı, adresi, telefon numarası, cep telefonu, e-posta adresi gibi Kullanıcı'yı tanımlamaya yönelik her türlü diğer bilgiyi içermekte olup, kısaca 'Gizli Bilgiler' olarak anılacaktır.</p>
                  <p className="mt-2">3.2. Kullanıcı, tanıtım, reklam, kampanya, promosyon, duyuru vb. pazarlama faaliyetleri kapsamında kullanılması ile sınırlı olmak üzere, Site'nin sahibi olan firmanın kendisine ait iletişim, portföy durumu ve demografik bilgilerini iştirakleri ya da bağlı bulunduğu grup şirketleri ile paylaşmasına, kendisi veya iştiraklerine yönelik bu bağlamda elektronik ileti almaya onay verdiğini kabul ve beyan eder. Bu kişisel bilgiler firma bünyesinde müşteri profili belirlemek, müşteri profiline uygun promosyon ve kampanyalar sunmak ve istatistiksel çalışmalar yapmak amacıyla kullanılabilecektir.</p>
                  <p className="mt-2">3.3. Kullanıcı, işbu sözleşme ile vermiş olduğu onayı, hiçbir gerekçe açıklamaksızın iptal etmek hakkına sahiptir. İptal işlemini firma, derhal işleme alıp, 3 (üç) işgünü içerisinde kullanıcıyı elektronik ileti almaktan imtina eder.</p>
                  <p className="mt-2">3.4. Gizli Bilgiler, ancak resmi makamlarca usulü dairesinde bu bilgilerin talep edilmesi halinde ve yürürlükteki emredici mevzuat hükümleri gereğince resmi makamlara açıklama yapılmasının zorunlu olduğu durumlarda resmi makamlara açıklanabilecektir.</p>
                </div>

                <div>
                  <h3 className="font-bold underline mb-2">4. GARANTİ VERMEME:</h3>
                  <p>İŞBU SÖZLEŞME MADDESİ UYGULANABİLİR KANUNUN İZİN VERDİĞİ AZAMİ ÖLÇÜDE GEÇERLİ OLACAKTIR. FİRMA TARAFINDAN SUNULAN HİZMETLER "OLDUĞU GİBİ" VE "MÜMKÜN OLDUĞU" TEMELDE SUNULMAKTA VE PAZARLANABİLİRLİK, BELİRLİ BİR AMACA UYGUNLUK VEYA İHLAL ETMEME KONUSUNDA TÜM ZIMNİ GARANTİLER DE DÂHİL OLMAK ÜZERE HİZMETLER VEYA UYGULAMA İLE İLGİLİ OLARAK (BUNLARDA YER ALAN TÜM BİLGİLER DÂHİL) SARİH VEYA ZIMNİ, KANUNİ VEYA BAŞKA BİR NİTELİKTE HİÇBİR GARANTİDE BULUNMAMAKTADIR.</p>
                </div>

                <div>
                  <h3 className="font-bold underline mb-2">5. KAYIT VE GÜVENLİK</h3>
                  <p>Kullanıcı, doğru, eksiksiz ve güncel kayıt bilgilerini vermek zorundadır. Aksi halde bu Sözleşme ihlal edilmiş sayılacak ve Kullanıcı bilgilendirilmeksizin hesap kapatılabilecektir.</p>
                  <p className="mt-2">Kullanıcı, site ve üçüncü taraf sitelerdeki şifre ve hesap güvenliğinden kendisi sorumludur. Aksi halde oluşacak veri kayıplarından ve güvenlik ihlallerinden veya donanım ve cihazların zarar görmesinden Firma sorumlu tutulamaz.</p>
                </div>

                <div>
                  <h3 className="font-bold underline mb-2">6. MÜCBİR SEBEP</h3>
                  <p>Tarafların kontrolünde olmayan; tabii afetler, yangın, patlamalar, iç savaşlar, savaşlar, ayaklanmalar, halk hareketleri, seferberlik ilanı, grev, lokavt ve salgın hastalıklar, altyapı ve internet arızaları, elektrik kesintisi gibi sebeplerden (aşağıda birlikte "Mücbir Sebep” olarak anılacaktır.) dolayı sözleşmeden doğan yükümlülükler taraflarca ifa edilemez hale gelirse, taraflar bundan sorumlu değildir. Bu sürede Taraflar'ın işbu Sözleşme'den doğan hak ve yükümlülükleri askıya alınır.</p>
                </div>

                <div>
                  <h3 className="font-bold underline mb-2">7. SÖZLEŞMENİN BÜTÜNLÜĞÜ VE UYGULANABİLİRLİK</h3>
                  <p>İşbu sözleşme şartlarından biri, kısmen veya tamamen geçersiz hale gelirse, sözleşmenin geri kalanı geçerliliğini korumaya devam eder.</p>
                </div>

                <div>
                  <h3 className="font-bold underline mb-2">8. SÖZLEŞMEDE YAPILACAK DEĞİŞİKLİKLER</h3>
                  <p>Firma, dilediği zaman sitede sunulan hizmetleri ve işbu sözleşme şartlarını kısmen veya tamamen değiştirebilir. Değişiklikler sitede yayınlandığı tarihten itibaren geçerli olacaktır. Değişiklikleri takip etmek Kullanıcı'nın sorumluluğundadır. Kullanıcı, sunulan hizmetlerden yararlanmaya devam etmekle bu değişiklikleri de kabul etmiş sayılır.</p>
                </div>

                <div>
                  <h3 className="font-bold underline mb-2">9. TEBLİGAT</h3>
                  <p>İşbu Sözleşme ile ilgili taraflara gönderilecek olan tüm bildirimler, Firma'nın bilinen e.posta adresi ve kullanıcının üyelik formunda belirttiği e.posta adresi vasıtasıyla yapılacaktır. Kullanıcı, üye olurken belirttiği adresin geçerli tebligat adresi olduğunu, değişmesi durumunda 5 gün içinde yazılı olarak diğer tarafa bildireceğini, aksi halde bu adrese yapılacak tebligatların geçerli sayılacağını kabul eder.</p>
                </div>

                <div>
                  <h3 className="font-bold underline mb-2">10. DELİL SÖZLEŞMESİ</h3>
                  <p>Taraflar arasında işbu sözleşme ile ilgili işlemler için çıkabilecek her türlü uyuşmazlıklarda Taraflar'ın defter, kayıt ve belgeleri ile ve bilgisayar kayıtları ve faks kayıtları 6100 sayılı Hukuk Muhakemeleri Kanunu uyarınca delil olarak kabul edilecek olup, kullanıcı bu kayıtlara itiraz etmeyeceğini kabul eder.</p>
                </div>

                <div>
                  <h3 className="font-bold underline mb-2">11. UYUŞMAZLIKLARIN ÇÖZÜMÜ</h3>
                  <p>İşbu Sözleşme'nin uygulanmasından veya yorumlanmasından doğacak her türlü uyuşmazlığın çözümünde İstanbul (Merkez) Adliyesi Mahkemeleri ve İcra Daireleri yetkilidir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 hover:text-gray-800 z-10 rounded-full p-2 transition-all flex items-center justify-center"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            
            <div className="p-6 sm:p-10 overflow-y-auto h-full text-left">
              <h2 className="text-2xl font-bold text-center mb-8 uppercase text-gray-800">ÜYE VE ZİYARETÇİ KİŞİSEL VERİ AYDINLATMA METNİ</h2>
              
              <div className="text-[13px] text-gray-600 space-y-5 leading-relaxed">
                <div>
                  <h3 className="font-bold mb-2">KİŞİSEL VERİLERİN KORUNMASI HAKKINDA BİLGİLENDİRME</h3>
                  <p>Gerek web sitemizi kullanırken, gerekse başka yollarla tarafımıza iletmiş olduğunuz kişisel bilgilerinizin güvenliğinin sağlanmasına son derece önem vermektedir. 6698 Sayılı “Kişisel Verilerin Korunması Kanunu” yürürlüğe girmiştir. Anılan mevzuat ve bu mevzuatta belirtilen bir takım tanımlar hakkında sizi bilgilendirmek isteriz:</p>
                  <p className="mt-2"><span className="font-bold text-gray-800">Kişisel veri:</span> Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgiyi,</p>
                  <p className="mt-2"><span className="font-bold text-gray-800">Kişisel verilerin işlenmesi:</span> Kişisel verilerin tamamen veya kısmen otomatik olan ya da herhangi bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla elde edilmesi, kaydedilmesi, depolanması, muhafaza edilmesi, değiştirilmesi, yeniden düzenlenmesi, açıklanması, aktarılması, devralınması, elde edilebilir hâle getirilmesi, sınıflandırılması ya da kullanılmasının engellenmesi gibi veriler üzerinde gerçekleştirilen her türlü işlemi,</p>
                  <p className="mt-2"><span className="font-bold text-gray-800">Veri işleyen:</span> Veri sorumlusunun verdiği yetkiye dayanarak onun adına kişisel verileri işleyen gerçek veya tüzel kişiyi,</p>
                  <p className="mt-2"><span className="font-bold text-gray-800">Veri kayıt sistemi:</span> Kişisel verilerin belirli kriterlere göre yapılandırılarak işlendiği kayıt sistemini,</p>
                  <p className="mt-2"><span className="font-bold text-gray-800">Veri sorumlusu:</span> Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel kişiyi ifade eder.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">1. Kişisel Verilerin Korunması ve Rıza Metninin Amacı ve Şirketimizin Veri Sorumlusu Konumu:</h3>
                  <p>Alışveriş sitemizin müşterilere ilişkin kişisel veriler bakımından 6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun") kapsamında "veri sorumlusu" sıfatına sahip olup işbu Kişisel Verilerin Korunması ve Rıza Metni ile söz konusu Kanun uyarınca müşterilerin alışveriş sitemiz tarafından gerçekleştirilen kişisel veri işleme faaliyetleri hakkında aydınlatılması ve aşağıda 3. maddede belirtilen durumlar için açık rızalarının temini hedeflenmektedir.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">2. Müşterilere Ait Kişisel Verilerin İşlenme Amacı:</h3>
                  <p>Müşterilere ait kişisel veriler aşağıda ve Kanun'un 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları çerçevesinde işlenmektedir. Müşterilere ait kişisel veriler;</p>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Alışveriş sitemiz tarafından sunulan ürün ve hizmetlerden ilgili kişileri faydalandırmak için gerekli çalışmaların iş birimleri tarafından yapılması ve ilgili iş süreçlerinin yürütülmesi,</li>
                    <li>Alışveriş sitemiz tarafından yürütülen ticari faaliyetlerin gerçekleştirilmesi için ilgili iş birimleri tarafından gerekli çalışmaların yapılması ve buna bağlı iş süreçlerinin yürütülmesi,</li>
                    <li>Alışveriş sitemizin ticari ve/veya iş stratejilerinin planlanması ve icrası,</li>
                    <li>Alışveriş sitemiz ile iş ilişkisi içerisinde olan ilgili kişilerin hukuki, teknik ve ticari-iş güvenliğinin temini ile tarafımızın sunduğu ürün ve hizmetlerin ilgili kişilerin beğeni, kullanım alışkanlıkları ve ihtiyaçlarına göre özelleştirilerek ilgili kişilere önerilmesi ve tanıtılması için gerekli olan aktivitelerin planlanması ve icrası,</li>
                    <li>İlgililerin olası hak ve alacak taleplerinin tesisi,</li>
                    <li>Yetkili kuruluşlara mevzuattan kaynaklı bilgi verilmesi,</li>
                    <li>Ziyaretçi kayıtlarının oluşturulması ve takibi,</li>
                    <li>Şirketimiz ve Şirketimiz adına şubelerimiz, çağrı merkezimiz, bağlı şirketlerimiz tarafından ya da internet sitelerimiz ile sosyal medya sayfalarımız veya ve bunlarla sınırlı olmamak üzere her türlü kanallar aracılığı ile Tüketicinin Korunması Hakkında Kanun, Perakende Ticaretin Düzenlenmesi Hakkında Kanun ve diğer yasal mevzuat kapsamında, yükümlülüklerin yerine getirilmesini sağlamak,</li>
                    <li>Müşterilere daha iyi hizmet verebilme, çeşitli avantajlar sağlayıp sunma, satış, pazarlama, bilgilendirme, promosyonlar hakkında bilgi verebilme, kampanya ve koşulları hakkında bilgi sağlama, anket, müşteri memnuniyet araştırmalarını yapabilme, satın alma işlemlerinizi sağlama hızlandırma, siparişlerinizi alma ve teslim edebilme,</li>
                    <li>Müşterilere yönelik kampanyaların oluşturulması, çapraz satış yapılması, hedef kitle belirlenmesi,</li>
                    <li>Müşteri hareketlerinin takip edilerek kullanıcı deneyimini arttırıcı faaliyetlerin yürütülmesi ve alışveriş sitemize ait internet sitesi ile mobil uygulamanın işleyişinin geliştirilmesi ve müşteri ihtiyaçlarına göre kişiselleştirilmesi, doğrudan ve doğrudan olmayan pazarlama, kişiye özel pazarlama ve yeniden pazarlama faaliyetlerinin yürütülmesi, kişiye özel segmentasyon, hedefleme, analiz ve şirket içi raporlama faaliyetlerinin yürütülmesi, pazar araştırmaları,</li>
                    <li>Müşteri memnuniyeti aktivitelerinin planlanması ve icrası ile müşteri ilişkileri yönetimi süreçlerinin planlanması ve icrası amaçlarıyla dahil olmak üzere dahil olmak üzere alışveriş sitemizin ürün ve/veya hizmetlerinin satış ve pazarlama süreçlerinin planlanması ve icrası, alışveriş sitemizin sunduğu ürün ve/veya hizmetlere bağlılık oluşturulması ve/veya arttırılması süreçlerinin planlanması ve icrası kapsamında Müşteri'nin vereceği onayı doğrultusunda işlenebilecek ve işbu Kişisel Verilerin Korunması Metnin'de belirtilen taraflarla paylaşılabilecektir.</li>
                  </ul>
                  <p className="mt-3">Alışveriş Sitemiz; online davranışsal reklamcılık ve pazarlama yapılabilmesi amacıyla siteye gelen kullanıcının üye olmasalar dahi sitedeki davranışlarını tarayıcıda bulunan bir cookie (çerez) ile ilişkilendirme ve görüntülenen sayfa sayısı, ziyaret süresi ve hedef tamamlama sayısı gibi metrikleri temel alan yeniden pazarlama listeleri tanımlama hakkını haizdir. Daha sonra bu kullanıcıya sitede ya da Görüntülü Reklam Ağı'ndaki diğer sitelerde, kullanıcıların ilgi alanlarına göre hedefe yönelik reklam içeriği gösterilebilir. Google AFS reklamlarının Alışveriş Sitemize yönlendirilmesi esnasında Google kullanıcıların tarayıcısına çerez yerleştirebilir veya bunlarda yer alan çerezleri okuyabilir veya bilgi toplamak amacı ile web işaretleri kullanabilir.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">3. Müşterilerin Açık Rızası Doğrultusunda İşlenecek Kişisel Veriler ve İşleme Amaçları:</h3>
                  <p>Kanun'un 5/2 ile 6/3 maddesinde yer alan kişisel veri işleme şartlarının karşılanamadığı aşağıdaki durumlar için Alışveriş sitemiz tarafından kişisel verilerin işlenebilmesi için müşterilerin açık rızasının alınması gerekmektedir.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">4. Müşterilere Ait Kişisel Verilerin Aktarımı:</h3>
                  <p>Müşterilere ait kişisel veriler, alışveriş sitemiz tarafından sunulan ürün ve hizmetlerden ilgili kişileri faydalandırmak için gerekli çalışmaların iş birimleri tarafından yapılması ve ilgili iş süreçlerinin yürütülmesi, alışveriş sitemiz tarafından yürütülen ticari faaliyetlerin gerçekleştirilmesi için ilgili iş birimleri tarafından gerekli çalışmaların yapılması ve buna bağlı iş süreçlerinin yürütülmesi, alışveriş sitemizin ticari ve/veya iş stratejilerinin planlanması ve icrası, alışveriş sitemizin ve alışveriş sitemiz ile iş ilişkisi içerisinde olan ilgili kişilerin hukuki, teknik ve ticari-iş güvenliğinin temini ile alışveriş sitemizin sunduğu ürün ve hizmetlerin ilgili kişilerin beğeni, kullanım alışkanlıkları ve ihtiyaçlarına göre özelleştirilerek ilgili kişilere önerilmesi ve tanıtılması için gerekli olan aktivitelerin planlanması ve icrası da dahil olmak üzere Kanun'un 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları çerçevesinde Şirket yetkilileri, iştiraklerimiz, iş ortaklarımız, tedarikçilerimiz, hissedarlarımız, kanunen yetkili kamu kurum ve kuruluşları ile özel kurumlar ile paylaşılabilecektir.</p>
                  <p className="mt-2">Kullanıcının Ad ve İletişim Bilgileri, ödeme aşamasında onaylayacağı ödeme kuruluşu çerçeve sözleşmesi uyarınca ve 9 Ocak 2008 tarihli ve 26751 sayılı Resmi Gazete'de yayımlanan Suç Gelirlerinin Aklanmasının ve Terörün Finansmanının Önlenmesine Dair Tedbirler Hakkında Yönetmelik uyarınca kimlik doğrulaması gerçekleştirilmesi amacıyla ödeme kuruluşlarıyla paylaşılabilecektir.</p>
                  <p className="mt-2">Alışveriş Sitemiz, kişisel verileri yukarıda belirtilen amaçlar dahilinde, 6698 sayılı Kanun'da öngörülen şartları sağlamak koşulu ile yurt içinde üçüncü kişilere aktarabileceği gibi yurt dışına da aktarabilecektir.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">5. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi:</h3>
                  <p>Kişisel veriler, müşterilerden elektronik ortamda toplanmaktadır. Yukarıda belirtilen hukuki sebeplerle toplanan kişisel veriler Kanun'un 5. ve 6. maddelerinde ve bu Kişisel Verilerin Korunması Metninde belirtilen amaçlarla işlenebilmekte ve aktarılabilmektedir.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">6. Kişisel Verilerin Saklanma Süreleri</h3>
                  <p>Alışveriş Sitemiz, ilgili kanunlarda ve mevzuatlarda öngörülmesi durumunda kişisel verileri bu mevzuatlarda belirtilen süre boyunca saklamaktadır.</p>
                  <p className="mt-2">Kişisel verilerin ne kadar süre boyunca saklanması gerektiğine ilişkin mevzuatta bir süre düzenlenmemişse, Kişisel Veriler Alışveriş Sitemiz'in o veriyi işlerken yürütülen faaliyet ile bağlı olarak Alışveriş Sitemiz'in uygulamaları ve ticari yaşamının teamülleri uyarınca işlenmesini gerektiren süre kadar işlenmekte daha sonra silinmekte, yok edilmekte veya anonim hale getirilmektedir.</p>
                  <p className="mt-2">Kişisel verilerin işlenme amacı sona ermiş; ilgili mevzuat ve Alışveriş Sitemiz'in belirlediği saklama sürelerinin de sonuna gelinmişse; kişisel veriler yalnızca olası hukuki uyuşmazlıklarda delil teşkil etmesi veya kişisel veriye bağlı ilgili hakkın ileri sürülebilmesi veya savunmanın tesis edilmesi amacıyla saklanabilmektedir. Buradaki sürelerin tesisinde bahsi geçen hakkın ileri sürülebilmesine yönelik zaman aşımı süreleri ile zaman aşımı sürelerinin geçmesine rağmen daha önce aynı konularda Alışveriş Sitemiz'e yöneltilen taleplerdeki örnekler esas alınarak saklama süreleri belirlenmektedir. Bu durumda saklanan kişisel verilere herhangi bir başka amaçla erişilmemekte ve ancak ilgili hukuki uyuşmazlıkta kullanılması gerektiği zaman ilgili kişisel verilere erişim sağlanmaktadır. Burada da bahsi geçen süre sona erdikten sonra kişisel veriler silinmekte, yok edilmekte veya anonim hale getirilmektedir.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">7. Kişisel Veri Sahibi Olarak Müşterilerin Hakları:</h3>
                  <p>Kanun'un 11. maddesi uyarınca veri sahipleri; (i) kendileri ile ilgili kişisel veri işlenip işlenmediğini öğrenme, (ii) kişisel verileri işlenmişse buna ilişkin bilgi talep etme, (iii) kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, (iv) yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme, (v) kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme, (vi) Kanun ve ilgili diğer kanun hükümlerine uygun olarak işlenmiş olmasına rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması hâlinde kişisel verilerin silinmesini veya yok edilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme, (vii) işlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme ve (viii) kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme haklarına sahiptir.</p>
                  <p className="mt-2">Söz konusu hakların kullanımına ilişkin talepler, kişisel veri sahipleri Alışveriş Sitemiz Tarafından 6698 sayılı Kanun Kapsamında belirtilen yöntemlerle iletilebilecektir. Alışveriş sitemiz söz konusu talepleri değerlendirerek 30 gün içerisinde sonuçlandıracaktır.</p>
                  <p className="mt-2">İşbu form üzerinde yer verilen hususlar ile ilgili olarak, hukuki ve teknolojik gelişmeler doğrultusunda değişiklikler söz konusu olabilecektir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
