import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { RiShoppingCart2Line } from "react-icons/ri";
import { IoPersonSharp, IoPersonOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const Navbar = ({ onCartClick, onLoginClick, showOnlyFavorites, onToggleFavorites }) => {
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

          <button className={`icon-btn favorite-btn-container ${showOnlyFavorites ? 'active' : ''}`} onClick={onToggleFavorites}>
            <div className="favorite-icon-wrapper nav-heart-wrapper">
              <FaRegHeart className="heart-outline" size={22} />
              <FaHeart className="heart-solid" size={22} />
              {favoritesCount > 0 && <span className="favorite-badge">{favoritesCount}</span>}
            </div>
            <span className="icon-text">Favoriler</span>
          </button>

          <button className="icon-btn cart-btn-container" onClick={onCartClick}>
            <div className="cart-icon-wrapper">
              <RiShoppingCart2Line size={26} />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </div>
            <span className="icon-text">Sepet</span>
          </button>
          
          {isAdmin ? (
            <button className="icon-btn login-btn" onClick={logout}>
              <div className="nav-person-wrapper">
                <IoPersonOutline className="person-outline" size={26} />
                <IoPersonSharp className="person-solid" size={26} />
              </div>
              <span className="icon-text">Çıkış Yap</span>
            </button>
          ) : (
            <button className="icon-btn login-btn" onClick={onLoginClick}>
              <div className="nav-person-wrapper">
                <IoPersonOutline className="person-outline" size={26} />
                <IoPersonSharp className="person-solid" size={26} />
              </div>
              <span className="icon-text">Giriş</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle">
          <button className="icon-btn favorite-btn-container mobile-cart-btn" onClick={onToggleFavorites}>
            <div className="favorite-icon-wrapper nav-heart-wrapper">
              <FaRegHeart className="heart-outline" size={24} />
              <FaHeart className="heart-solid" size={24} />
              {favoritesCount > 0 && <span className="favorite-badge">{favoritesCount}</span>}
            </div>
          </button>
          <button className="icon-btn cart-btn-container mobile-cart-btn" onClick={onCartClick}>
            <div className="cart-icon-wrapper">
              <RiShoppingCart2Line size={28} />
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

            {isAdmin ? (
              <button className="icon-btn login-btn" onClick={() => { logout(); setIsMenuOpen(false); }}>
                <div className="nav-person-wrapper">
                  <IoPersonOutline className="person-outline" size={28} />
                  <IoPersonSharp className="person-solid" size={28} />
                </div>
                <span>Çıkış Yap</span>
              </button>
            ) : (
              <button className="icon-btn login-btn" onClick={() => { onLoginClick(); setIsMenuOpen(false); }}>
                <div className="nav-person-wrapper">
                  <IoPersonOutline className="person-outline" size={28} />
                  <IoPersonSharp className="person-solid" size={28} />
                </div>
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
