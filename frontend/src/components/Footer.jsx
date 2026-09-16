import React from 'react';
import { MapPin, Phone, Mail, Map, Store } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-hard-reset">
      <div className="footer-grid-container">
        
        {/* Sütun 1: Kurumsal Kimlik */}
        <div className="footer-col">
          <Link to="/">
            <img src="/logo.png" alt="Neta Oto Market" style={{ height: '40px', marginBottom: '0.5rem', width: 'fit-content' }} />
          </Link>
          <div className="footer-vision-text">
            Aracınız için en kaliteli oto aksesuarları, aydınlatma, multimedya ve body kit ürünlerinde güvenilir adresiniz. Neta Oto Market ile fark yaratın.
          </div>
        </div>

        {/* Sütun 2: Üyelik */}
        <div className="footer-col">
          <h3 className="footer-col-title">Üyelik</h3>
          <div className="footer-link-list">
            <Link to="/auth?mode=register" className="footer-link-item">Yeni Üyelik</Link>
            <Link to="/auth" className="footer-link-item">Üye Girişi</Link>
            <Link to="/auth?mode=forgot" className="footer-link-item">Şifremi Unuttum</Link>
            <Link to="/checkout" className="footer-link-item">Sepetiniz</Link>
          </div>
        </div>

        {/* Sütun 3: Hızlı Linkler */}
        <div className="footer-col">
          <h3 className="footer-col-title">Kurumsal</h3>
          <div className="footer-link-list">
            <Link to="/" className="footer-link-item">Ana Sayfa</Link>
            <Link to="/hakkimizda" className="footer-link-item">Hakkımızda</Link>
            <Link to="/iade-kosullari" className="footer-link-item">İade Koşulları</Link>
            <Link to="/gizlilik" className="footer-link-item">Gizlilik Politikası</Link>
          </div>
        </div>

        {/* Sütun 4: Kategoriler */}
        <div className="footer-col">
          <h3 className="footer-col-title">Popüler Kategoriler</h3>
          <div className="footer-link-list">
            <Link to="/?category=Aydınlatma" className="footer-link-item">Aydınlatma</Link>
            <Link to="/?category=Body+Kit" className="footer-link-item">Body Kit</Link>
            <Link to="/?category=Multimedya" className="footer-link-item">Multimedya</Link>
          </div>
        </div>

        {/* Sütun 5: İletişim ve Sosyal Medya */}
        <div className="footer-col">
          <h3 className="footer-col-title">Bize Ulaşın</h3>
          <div className="footer-link-list" style={{ marginBottom: '1.25rem' }}>
            <a href="tel:+905536495353" className="footer-link-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} /> 0553 649 53 53
            </a>
            <a href="mailto:netaotomarket@gmail.com" className="footer-link-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> netaotomarket@gmail.com
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=17+Ağustos+Mah.+17+Ağustos+Cad.+No:8+Kartepe+Kocaeli" target="_blank" rel="noopener noreferrer" className="footer-link-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>17 Ağustos Mah. 17 Ağustos Cad. No:8 Kartepe / Kocaeli</span>
            </a>
          </div>
          
          <div className="footer-icons-grid">
            <a href="tel:+905536495353" className="footer-hr-btn footer-hr-btn-phone" title="Telefon">
              <Phone size={18} />
            </a>
            <a href="mailto:netaotomarket@gmail.com" className="footer-hr-btn footer-hr-btn-mail" title="E-posta">
              <Mail size={18} />
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=17+Ağustos+Mah.+17+Ağustos+Cad.+No:8+Kartepe+Kocaeli" target="_blank" rel="noopener noreferrer" className="footer-hr-btn footer-hr-btn-map" title="Harita">
              <Map size={18} />
            </a>
            <a href="https://netaotomarket.sahibinden.com" target="_blank" rel="noopener noreferrer" className="footer-hr-btn footer-hr-btn-store" title="Sahibinden Mağaza">
              <Store size={18} />
            </a>
            <a href="https://www.instagram.com/netaotomarket/" target="_blank" rel="noopener noreferrer" className="footer-hr-btn footer-hr-btn-ig" title="Instagram">
              <FaInstagram size={18} />
            </a>
            <a href="https://www.facebook.com/people/NETA-Multimedya/61589910777884/?ref=PROFILE_EDIT_xav_ig_profile_page_web#" target="_blank" rel="noopener noreferrer" className="footer-hr-btn footer-hr-btn-fb" title="Facebook">
              <FaFacebook size={18} />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom-bar">
        <p className="footer-copyright">© 2026 Neta Oto Market. Tüm Hakları Saklıdır.</p>
        <div className="footer-payment-icons">
          <img src="/payments/troy.png" alt="Troy" />
          <img src="/payments/visa.png" alt="Visa" />
          <img src="/payments/maestro.png" alt="Maestro" />
          <img src="/payments/mastercard.png" alt="MasterCard" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
