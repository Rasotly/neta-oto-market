import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Pencil, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileDashboard = () => {
  const { user, isAdmin, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL query parameter for default tab
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'account';

  const [activeTab, setActiveTab] = useState(initialTab);
  const fileInputRef = useRef(null);

  const currentUser = user || { name: 'Admin', email: 'admin@admin.com', phone: '', avatar: null };

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    avatar: currentUser.avatar || null
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Check for changes
  useEffect(() => {
    const isChanged = 
      formData.name !== (currentUser.name || '') ||
      formData.email !== (currentUser.email || '') ||
      formData.phone !== (currentUser.phone || '') ||
      formData.avatar !== (currentUser.avatar || null);
    
    setHasChanges(isChanged);
  }, [formData, currentUser]);

  // Sync formData if active user changes globally
  useEffect(() => {
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      avatar: currentUser.avatar || null
    });
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Profil fotoğrafı en fazla 2MB olabilir.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const result = updateUser(formData);
    if (result.success) {
      toast.success('Değişiklikler başarıyla kaydedildi!');
      setHasChanges(false);
    } else {
      toast.error(result.message || 'Bir hata oluştu.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      avatar: currentUser.avatar || null
    });
    setHasChanges(false);
  };

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
                  <input 
                    type="text" 
                    className="auth-input" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
              </div>
              <div className="auth-input-group">
                <label className="profile-label">E-posta Adresiniz</label>
                <input 
                  type="email" 
                  className="auth-input" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
              </div>
              <div className="auth-input-group">
                <label className="profile-label">Cep Telefonunuz</label>
                <input 
                  type="tel" 
                  className="auth-input" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                />
              </div>
              {hasChanges && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button type="button" className="auth-submit-btn profile-save-btn" onClick={handleSave} style={{ width: 'auto', padding: '0.6rem 2rem' }}>
                    Değişiklikleri Kaydet
                  </button>
                  <button type="button" className="auth-submit-btn profile-cancel-btn" onClick={handleCancel} style={{ width: 'auto', padding: '0.6rem 2rem' }}>
                    İptal Et
                  </button>
                </div>
              )}
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
              <div className="profile-avatar" style={{ position: 'relative' }}>
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
                    alt="Profile Avatar" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  formData.name.charAt(0).toUpperCase()
                )}
                <div 
                  className="profile-avatar-edit"
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    backgroundColor: '#ffffff',
                    color: '#f97316',
                    borderRadius: '50%',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                >
                  <Pencil size={14} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
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
              <button className="profile-logout-btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={18} />
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
