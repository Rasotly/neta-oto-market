import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Pencil, LogOut, X, PackageOpen, Heart, Car } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatters';

import { CITIES, DISTRICTS } from '../utils/turkeyLocations';

const formatPhoneNumber = (value) => {
  if (!value) return value;
  let phoneNumber = value.replace(/[^\d]/g, '');
  
  // Eğer ilk hane 0 değilse ve sayı girildiyse başına 0 ekle (555... girilirse 0555... olsun)
  if (phoneNumber.length > 0 && phoneNumber[0] !== '0') {
    phoneNumber = '0' + phoneNumber;
  }

  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 5) return phoneNumber;
  if (phoneNumberLength < 8) {
    return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
  }
  if (phoneNumberLength < 10) {
    return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
  }
  return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(9, 11)}`;
};

const ProfileDashboard = () => {
  const { user, isAdmin, logout, updateUser } = useAuth();
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL query parameter for default tab
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'dashboard';

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
    city: CITIES[0],
    district: DISTRICTS[CITIES[0]][0],
    fullAddress: ''
  });

  const addresses = currentUser.addresses || [];
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleAddNewAddress = () => {
    setAddressFormData({ title: '', fullName: '', phone: '', city: CITIES[0], district: DISTRICTS[CITIES[0]][0], fullAddress: '' });
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
      case 'dashboard':
        const activeOrders = (user?.orders || []).filter(o => o.status !== 'Teslim Edildi' && o.status !== 'İptal Edildi').length;
        const recentOrders = (user?.orders || []).slice(0, 5);
        
        return (
          <div className="profile-section">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Merhaba, {currentUser.name}!</h2>
            <p className="text-sm text-gray-500 mb-8">Buradan hesap hareketlerinizi ve siparişlerinizi yönetebilirsiniz.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Kart 1 */}
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Aktif Siparişlerim</p>
                  <p className="text-2xl font-bold text-gray-900">{activeOrders}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                  <PackageOpen className="text-[#D5A738]" size={24} />
                </div>
              </div>
              
              {/* Kart 2 */}
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Favorilerim</p>
                  <p className="text-2xl font-bold text-gray-900">{favoritesCount}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                  <Heart className="text-[#D5A738]" size={24} />
                </div>
              </div>

              {/* Kart 3 */}
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Kayıtlı Araçlar</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                  <Car className="text-[#D5A738]" size={24} />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Son Siparişlerim</h3>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">Henüz siparişiniz bulunmuyor.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-4 font-medium">Sipariş No</th>
                        <th className="py-3 px-4 font-medium">Tarih</th>
                        <th className="py-3 px-4 font-medium">Tutar</th>
                        <th className="py-3 px-4 font-medium">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                          <td className="py-3 px-4 text-gray-500">{new Date(order.date).toLocaleDateString('tr-TR')}</td>
                          <td className="py-3 px-4 font-medium">{formatPrice(order.totalAmount)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${order.status === 'Hazırlanıyor' ? 'bg-yellow-100 text-yellow-700' :
                                order.status === 'Kargoya Verildi' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
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
                  onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })} 
                  placeholder="0555 555 55 55"
                />
              </div>
              {hasChanges && (
                <div className="mt-4 flex flex-col md:flex-row gap-4">
                  <button type="button" className="w-full md:w-auto px-6 py-2.5 bg-[#D5A738] hover:opacity-90 text-white font-medium rounded-xl transition-all" onClick={handleSave}>
                    Değişiklikleri Kaydet
                  </button>
                  <button type="button" className="w-full md:w-auto px-6 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-all" onClick={handleCancel}>
                    İptal Et
                  </button>
                </div>
              )}
            </form>
          </div>
        );
      case 'orders':
        const userOrders = user.orders || [];
        return (
          <div className="profile-section">
            <h3 className="profile-section-title">Siparişlerim</h3>
            
            {userOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6b7280' }}>
                <PackageOpen size={64} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <h4 style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '0.5rem' }}>Henüz bir siparişiniz bulunmuyor</h4>
                <p>Oto aksesuar kataloğumuzu inceleyerek hemen alışverişe başlayabilirsiniz.</p>
              </div>
            ) : (
              <div className="order-list-container">
                {userOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div className="order-info-group">
                        <span className="order-info-label">Sipariş No</span>
                        <span className="order-info-value">{order.id}</span>
                      </div>
                      <div className="order-info-group">
                        <span className="order-info-label">Tarih</span>
                        <span className="order-info-value">{new Date(order.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="order-info-group">
                        <span className="order-info-label">Tutar</span>
                        <span className="order-info-value">{formatPrice(order.totalAmount)}</span>
                      </div>
                      <div className="order-info-group" style={{ alignItems: 'flex-end' }}>
                        <span className={`order-badge ${order.status === 'Hazırlanıyor' ? 'order-badge-preparing' : 'order-badge-shipped'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="order-item-img" />
                          ) : (
                            <div className="order-item-placeholder">Görsel Yok</div>
                          )}
                          <div className="order-item-details">
                            <h4 className="order-item-name">{item.name}</h4>
                            <div className="order-item-meta">{item.quantity} Adet • {formatPrice(item.price)}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-card-footer">
                      <button 
                        className="btn-order-detail"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Sipariş Detayı
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
      <Navbar 
        onCartClick={() => navigate('/?cart=open')}
        onToggleFavorites={() => navigate('/?favorites=true')}
      />
      
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
                className={`profile-nav-item ${activeTab === 'dashboard' ? 'bg-[#D5A738] text-white' : ''}`}
                onClick={() => { setActiveTab('dashboard'); navigate('/profile?tab=dashboard'); }}
              >
                Özet
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'account' ? 'bg-[#D5A738] text-white' : ''}`}
                onClick={() => { setActiveTab('account'); navigate('/profile?tab=account'); }}
              >
                Hesap Bilgilerim
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'addresses' ? 'bg-[#D5A738] text-white' : ''}`}
                onClick={() => { setActiveTab('addresses'); navigate('/profile?tab=addresses'); }}
              >
                Adreslerim
              </button>
              <button 
                className={`profile-nav-item ${activeTab === 'orders' ? 'bg-[#D5A738] text-white' : ''}`}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal-content" onClick={e => e.stopPropagation()}>
            <div className="order-modal-header">
              <h3>Sipariş Detayı</h3>
              <button className="order-modal-close" onClick={() => setSelectedOrder(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="order-modal-body">
              <div className="order-detail-row">
                <span>Kargo Takip No</span>
                <span>{selectedOrder.trackingNumber || 'Atanmadı'}</span>
              </div>
              <div className="order-detail-row">
                <span>Teslimat Adresi</span>
                <span>
                  {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName} <br/>
                  {selectedOrder.shippingAddress?.address} <br/>
                  {selectedOrder.shippingAddress?.district} / {selectedOrder.shippingAddress?.city}
                </span>
              </div>
              <div className="order-detail-row">
                <span>Ödeme Yöntemi</span>
                <span>{selectedOrder.paymentMethod || 'Kredi Kartı'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  onChange={(e) => setAddressFormData({...addressFormData, phone: formatPhoneNumber(e.target.value)})}
                  placeholder="0555 555 55 55"
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
