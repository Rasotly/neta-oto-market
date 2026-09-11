import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Pencil, LogOut, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa"];
const DISTRICTS = {
  "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar"],
  "Ankara": ["Çankaya", "Keçiören", "Yenimahalle"],
  "İzmir": ["Bornova", "Karşıyaka", "Konak"],
  "Bursa": ["Nilüfer", "Osmangazi", "Yıldırım"]
};

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

  // Address State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    title: '',
    fullName: '',
    phone: '',
    city: 'İstanbul',
    district: 'Kadıköy',
    fullAddress: ''
  });

  const addresses = currentUser.addresses || [];

  const handleAddNewAddress = () => {
    setAddressFormData({ title: '', fullName: '', phone: '', city: 'İstanbul', district: 'Kadıköy', fullAddress: '' });
    setEditingAddressId(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setAddressFormData({
      title: address.title,
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      district: address.district,
      fullAddress: address.fullAddress
    });
    setEditingAddressId(address.id);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Bu adresi silmek istediğinize emin misiniz?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      updateUser({ addresses: updatedAddresses });
      toast.success('Adres başarıyla silindi.');
    }
  };

  const handleSaveAddress = () => {
    if (!addressFormData.title || !addressFormData.fullName || !addressFormData.phone || !addressFormData.fullAddress) {
      toast.error('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    let updatedAddresses;
    if (editingAddressId) {
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddressId ? { ...addr, ...addressFormData } : addr
      );
    } else {
      const newAddress = {
        id: Date.now().toString(),
        ...addressFormData
      };
      updatedAddresses = [...addresses, newAddress];
    }

    const result = updateUser({ addresses: updatedAddresses });
    if (result.success) {
      toast.success(editingAddressId ? 'Adres güncellendi.' : 'Yeni adres eklendi.');
      setIsAddressModalOpen(false);
    } else {
      toast.error('Adres kaydedilirken bir hata oluştu.');
    }
  };

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
              <button className="add-address-btn" onClick={handleAddNewAddress} style={{ minHeight: '150px' }}>
                + Yeni Adres Ekle
              </button>
              
              {addresses.map(address => (
                <div className="address-card" key={address.id}>
                  <div className="address-header">
                    <strong>{address.title}</strong>
                  </div>
                  <p>{address.fullName}</p>
                  <p>{address.fullAddress}</p>
                  <p>{address.district} / {address.city}</p>
                  <p>{address.phone}</p>
                  <div className="address-actions">
                    <button className="text-btn" onClick={() => handleEditAddress(address)}>Düzenle</button>
                    <button className="text-btn text-danger" onClick={() => handleDeleteAddress(address.id)}>Sil</button>
                  </div>
                </div>
              ))}
            </div>

            {addresses.length === 0 && (
              <p style={{ marginTop: '1rem', color: '#9ca3af', fontSize: '0.875rem' }}>
                Henüz kayıtlı bir adresiniz bulunmuyor.
              </p>
            )}
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
      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="auth-card" style={{ width: '90%', maxWidth: '500px', margin: '2rem auto', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{editingAddressId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h2>
              <button onClick={() => setIsAddressModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSaveAddress(); }}>
              <div className="auth-input-group">
                <label className="profile-label">Adres Başlığı (Örn: Ev, İş)</label>
                <input 
                  type="text" 
                  className="auth-input" 
                  value={addressFormData.title}
                  onChange={(e) => setAddressFormData({...addressFormData, title: e.target.value})}
                  required
                />
              </div>

              <div className="auth-row">
                <div className="auth-input-group" style={{ flex: 1 }}>
                  <label className="profile-label">Ad Soyad</label>
                  <input 
                    type="text" 
                    className="auth-input" 
                    value={addressFormData.fullName}
                    onChange={(e) => setAddressFormData({...addressFormData, fullName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="profile-label">Cep Telefonu</label>
                <input 
                  type="tel" 
                  className="auth-input" 
                  value={addressFormData.phone}
                  onChange={(e) => setAddressFormData({...addressFormData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="auth-row" style={{ display: 'flex', gap: '1rem' }}>
                <div className="auth-input-group" style={{ flex: 1 }}>
                  <label className="profile-label">İl</label>
                  <select 
                    className="auth-input" 
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value, district: DISTRICTS[e.target.value]?.[0] || ''})}
                  >
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="auth-input-group" style={{ flex: 1 }}>
                  <label className="profile-label">İlçe</label>
                  <select 
                    className="auth-input" 
                    value={addressFormData.district}
                    onChange={(e) => setAddressFormData({...addressFormData, district: e.target.value})}
                  >
                    {(DISTRICTS[addressFormData.city] || []).map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="auth-input-group">
                <label className="profile-label">Açık Adres</label>
                <textarea 
                  className="auth-input" 
                  rows="3" 
                  value={addressFormData.fullAddress}
                  onChange={(e) => setAddressFormData({...addressFormData, fullAddress: e.target.value})}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="auth-submit-btn profile-save-btn" style={{ flex: 1 }}>
                  Kaydet
                </button>
                <button type="button" className="auth-submit-btn profile-cancel-btn" onClick={() => setIsAddressModalOpen(false)} style={{ flex: 1 }}>
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDashboard;
