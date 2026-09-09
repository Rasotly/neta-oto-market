import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Area */}
        <div className="navbar-logo">
          <h2>Neta Oto Market</h2>
        </div>

        {/* Search Bar - Desktop */}
        <div className="navbar-search desktop-only">
          <input type="text" placeholder="Ürün, kategori veya marka ara..." />
          <button className="search-btn">
            <Search size={20} />
          </button>
        </div>

        {/* Right Icons - Desktop */}
        <div className="navbar-actions desktop-only">
          <button className="icon-btn">
            <ShoppingCart size={24} />
            <span className="icon-text">Sepet</span>
          </button>
          <button className="icon-btn login-btn">
            <User size={24} />
            <span className="icon-text">Giriş</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle">
          <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="navbar-search mobile-search">
            <input type="text" placeholder="Ara..." />
            <button className="search-btn">
              <Search size={20} />
            </button>
          </div>
          <div className="mobile-actions">
            <button className="icon-btn">
              <ShoppingCart size={20} />
              <span>Sepetim</span>
            </button>
            <button className="icon-btn login-btn">
              <User size={20} />
              <span>Giriş Yap</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
