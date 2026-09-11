import React from 'react';
import { MapPin, Phone, Mail, Map, Store } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-hard-reset">
      <div className="footer-hr-container">
        <h2 className="footer-hr-title">Bize Ulaşın</h2>
        
        <div className="footer-hr-contact">
          <a href="https://www.google.com/maps/search/?api=1&query=17+Ağustos+Mah.+17+Ağustos+Cad.+No:8+Kartepe+Kocaeli" target="_blank" rel="noopener noreferrer" className="footer-hr-contact-link">
            <MapPin size={20} className="footer-hr-icon" />
            <span>17 Ağustos Mah. 17 Ağustos Cad. No:8 Kartepe / Kocaeli</span>
          </a>
          <a href="tel:+905536495353" className="footer-hr-contact-link">
            <Phone size={20} className="footer-hr-icon" />
            <span>0553 649 53 53</span>
          </a>
          <a href="mailto:netaotomarket@gmail.com" className="footer-hr-contact-link">
            <Mail size={20} className="footer-hr-icon" />
            <span>netaotomarket@gmail.com</span>
          </a>
        </div>

        <div className="footer-hr-actions">
          <a href="tel:+905536495353" className="footer-hr-btn footer-hr-btn-phone">
            <Phone size={18} />
            Hemen Ara
          </a>
          <a href="mailto:netaotomarket@gmail.com" className="footer-hr-btn footer-hr-btn-mail">
            <Mail size={18} />
            E-posta Gönder
          </a>
          <a href="https://www.google.com/maps/search/?api=1&query=17+Ağustos+Mah.+17+Ağustos+Cad.+No:8+Kartepe+Kocaeli" target="_blank" rel="noopener noreferrer" className="footer-hr-btn footer-hr-btn-map">
            <Map size={18} />
            Haritalarda Aç
          </a>
          <a href="https://netaotomarket.sahibinden.com" target="_blank" rel="noopener noreferrer" className="footer-hr-btn footer-hr-btn-store">
            <Store size={18} />
            Sahibinden
          </a>
          <a href="https://www.instagram.com/netaotomarket/" target="_blank" rel="noopener noreferrer" className="footer-hr-btn footer-hr-btn-ig">
            <FaInstagram size={18} />
            Instagram
          </a>
          <a href="https://www.facebook.com/people/NETA-Multimedya/61589910777884/?ref=PROFILE_EDIT_xav_ig_profile_page_web#" target="_blank" rel="noopener noreferrer" className="footer-hr-btn footer-hr-btn-fb">
            <FaFacebook size={18} />
            Facebook
          </a>
        </div>

        <div className="footer-hr-bottom">
          <p className="footer-copyright">© 2026 Neta Oto Market. Tüm Hakları Saklıdır.</p>
          <div className="footer-payment-icons">
            <img src="/payments/troy.png" alt="Troy" />
            <img src="/payments/visa.png" alt="Visa" />
            <img src="/payments/maestro.png" alt="Maestro" />
            <img src="/payments/mastercard.png" alt="MasterCard" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
