import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Plus, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const Navbar = ({ onAddProductClick, onCartClick, onLoginClick, showOnlyFavorites, onToggleFavorites }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItemCount } = useCart();
  const { isAdmin, logout } = useAuth();
  const { favoritesCount } = useFavorites();

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
          {isAdmin && (
            <button className="icon-btn" onClick={onAddProductClick}>
              <Plus size={24} />
              <span className="icon-text">Ürün Ekle</span>
            </button>
          )}
          
          <button className={`icon-btn favorite-btn-container ${showOnlyFavorites ? 'active' : ''}`} onClick={onToggleFavorites}>
            <div className="favorite-icon-wrapper">
              <Heart size={24} fill={showOnlyFavorites ? 'var(--accent)' : 'none'} color={showOnlyFavorites ? 'var(--accent)' : 'var(--text)'} />
              {favoritesCount > 0 && <span className="favorite-badge">{favoritesCount}</span>}
            </div>
            <span className="icon-text">Favoriler</span>
          </button>

          <button className="icon-btn cart-btn-container" onClick={onCartClick}>
            <div className="cart-icon-wrapper">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </div>
            <span className="icon-text">Sepet</span>
          </button>
          
          {isAdmin ? (
            <button className="icon-btn login-btn" onClick={logout}>
              <User size={24} />
              <span className="icon-text">Çıkış Yap</span>
            </button>
          ) : (
            <button className="icon-btn login-btn" onClick={onLoginClick}>
              <User size={24} />
              <span className="icon-text">Giriş</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle">
          <button className="icon-btn favorite-btn-container mobile-cart-btn" onClick={onToggleFavorites}>
            <div className="favorite-icon-wrapper">
              <Heart size={28} fill={showOnlyFavorites ? 'var(--accent)' : 'none'} color={showOnlyFavorites ? 'var(--accent)' : 'var(--text)'} />
              {favoritesCount > 0 && <span className="favorite-badge">{favoritesCount}</span>}
            </div>
          </button>
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
            {isAdmin && (
              <button className="icon-btn" onClick={() => { onAddProductClick(); setIsMenuOpen(false); }}>
                <Plus size={20} />
                <span>Ürün Ekle</span>
              </button>
            )}
            
            {isAdmin ? (
              <button className="icon-btn login-btn" onClick={() => { logout(); setIsMenuOpen(false); }}>
                <User size={20} />
                <span>Çıkış Yap</span>
              </button>
            ) : (
              <button className="icon-btn login-btn" onClick={() => { onLoginClick(); setIsMenuOpen(false); }}>
                <User size={20} />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
