import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ onAddProductClick, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItemCount } = useCart();

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
          <button className="icon-btn" onClick={onAddProductClick}>
            <Plus size={24} />
            <span className="icon-text">Ürün Ekle</span>
          </button>
          <button className="icon-btn cart-btn-container" onClick={onCartClick}>
            <div className="cart-icon-wrapper">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </div>
            <span className="icon-text">Sepet</span>
          </button>
          <button className="icon-btn login-btn">
            <User size={24} />
            <span className="icon-text">Giriş</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle">
          <button className="icon-btn cart-btn-container mobile-cart-btn" onClick={onCartClick}>
            <div className="cart-icon-wrapper">
              <ShoppingCart size={28} />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </div>
          </button>
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
            <button className="icon-btn" onClick={() => { onAddProductClick(); setIsMenuOpen(false); }}>
              <Plus size={20} />
              <span>Ürün Ekle</span>
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
