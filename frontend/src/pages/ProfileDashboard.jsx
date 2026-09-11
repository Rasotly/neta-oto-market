import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProfileDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL query parameter for default tab
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'account';

  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync state if URL changes
  useEffect(() => {
    const tab = queryParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Protect route
  useEffect(() => {
    if (!user && !isAdmin) {
      navigate('/auth');
    }
  }, [user, isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user && !isAdmin) return null; // Avoid flashing before redirect

  const currentUser = user || { name: 'Admin', email: 'admin@admin.com', phone: '' };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="profile-section">
            <h3 className="profile-section-title">Hesap Bilgilerim</h3>
            <form className="profile-form">
              <div className="auth-row">
                <div className="auth-input-group">
                  <label className="profile-label">Adınız ve Soyadınız</label>
                  <input type="text" className="auth-input" defaultValue={currentUser.name} />
                </div>
              </div>
              <div className="auth-input-group">
                <label className="profile-label">E-posta Adresiniz</label>
                <input type="email" className="auth-input" defaultValue={currentUser.email} />
              </div>
              <div className="auth-input-group">
                <label className="profile-label">Cep Telefonunuz</label>
                <input type="tel" className="auth-input" defaultValue={currentUser.phone} />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button type="button" className="auth-submit-btn register-btn profile-save-btn">
                  Bilgilerimi Güncelle
                </button>
              </div>
            </form>
          </div>
        );
      case 'orders':
        return (
          <div className="profile-section">
            <h3 className="profile-section-title">Siparişlerim</h3>
            <div className="orders-list">
              <div className="order-card">
                <div className="order-header">
                  <span className="order-number">Sipariş No: #NTA-10293</span>
                  <span className="order-date">12 Ekim 2026</span>
                </div>
                <div className="order-body">
                  <div className="order-status preparing">Hazırlanıyor</div>
                  <div className="order-total">1.250,00 ₺</div>
                </div>
              </div>
              <div className="order-card">
                <div className="order-header">
                  <span className="order-number">Sipariş No: #NTA-09844</span>
                  <span className="order-date">05 Eylül 2026</span>
                </div>
                <div className="order-body">
                  <div className="order-status delivered">Teslim Edildi</div>
                  <div className="order-total">850,00 ₺</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'addresses':
        return (
          <div className="profile-section">
            <h3 className="profile-section-title">Adreslerim</h3>
            <div className="addresses-list">
              <div className="address-card">
                <div className="address-header">
                  <strong>Ev Adresi</strong>
                </div>
                <p>Atatürk Mah. Cumhuriyet Cad. No:12 D:4</p>
                <p>Kadıköy / İstanbul</p>
                <div className="address-actions">
                  <button className="text-btn">Düzenle</button>
                  <button className="text-btn text-danger">Sil</button>
                </div>
              </div>
              <button className="add-address-btn">
                + Yeni Adres Ekle
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />
      
      <main className="profile-dashboard-container">
        <div className="profile-layout">
          
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-sidebar-header">
              <div className="profile-avatar">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-user-info">
                <h4>{currentUser.name}</h4>
                <p>{currentUser.email}</p>
              </div>
            </div>

            <nav className="profile-nav">
              <button 
                className={`profile-nav-item ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => { setActiveTab('account'); navigate('/profile?tab=account'); }}
              >
                Hesap Bilgilerim
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => { setActiveTab('addresses'); navigate('/profile?tab=addresses'); }}
              >
                Adreslerim
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => { setActiveTab('orders'); navigate('/profile?tab=orders'); }}
              >
                Siparişlerim
              </button>
            </nav>

            <div className="profile-logout-wrapper">
              <button className="profile-logout-btn" onClick={handleLogout}>
                Çıkış Yap
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <section className="profile-content">
            {renderContent()}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileDashboard;
