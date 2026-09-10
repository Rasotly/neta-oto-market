import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1 */}
          <div className="footer-col">
            <h3 className="footer-brand">Neta Oto Market</h3>
            <p className="footer-desc">
              Aracınız için en kaliteli aksesuar ve multimedya çözümleri.
            </p>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h4 className="footer-heading">Kategoriler</h4>
            <ul className="footer-links">
              <li><a href="#">Dış Aksesuar</a></li>
              <li><a href="#">İç Trim</a></li>
              <li><a href="#">Multimedya</a></li>
              <li><a href="#">Aydınlatma</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4 className="footer-heading">Müşteri Hizmetleri</h4>
            <ul className="footer-links">
              <li><a href="#">İade Koşulları</a></li>
              <li><a href="#">Kargo Takibi</a></li>
              <li><a href="#">S.S.S.</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="footer-col">
            <h4 className="footer-heading">İletişim</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>Örnek Sanayi Sitesi, 1. Blok No: 15, İstanbul</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+90 555 555 55 55</span>
              </li>
              <li>
                <Mail size={18} />
                <span>info@netaotomarket.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Neta Oto Market. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
