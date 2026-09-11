import { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Plus, Edit2, Trash2, ArrowLeft, LogOut, LayoutDashboard, Package, ShoppingCart, Users, Menu as MenuIcon, ChevronDown, ChevronRight, Tags, Star, PieChart, Settings, AlertTriangle } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import DashboardHome from '../components/admin/DashboardHome';
import DiscountCodes from '../components/admin/DiscountCodes';
import AdminOrders from '../components/admin/AdminOrders';
import AdminCustomers from '../components/admin/AdminCustomers';
import { formatPrice } from '../utils/formatters';
import '../App.css';

const AdminDashboard = () => {
  const { isAdmin, logout, registeredUsers } = useAuth();
  const navigate = useNavigate();
  
  // Calculate pending orders count
  const pendingOrdersCount = (registeredUsers || []).reduce((total, user) => {
    if (user.orders && Array.isArray(user.orders)) {
      const pending = user.orders.filter(o => o.status === 'Onay Bekliyor' || o.status === 'Hazırlanıyor').length;
      return total + pending;
    }
    return total;
  }, 0);
  
  const { products, loading, error, removeProductFromState } = useProducts();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Ürünler');
  const [productFilterStatus, setProductFilterStatus] = useState('all');

  const filteredProducts = products.filter(p => {
    if (productFilterStatus === 'in-stock') return p.inStock;
    if (productFilterStatus === 'out-of-stock') return !p.inStock;
    return true;
  });

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      await axios.delete(`https://localhost:7141/api/products/${deletingProduct.id}`);
      removeProductFromState(deletingProduct.id);
      setDeletingProduct(null);
      toast.success('Ürün başarıyla silindi', { position: 'top-right' });
    } catch (err) {
      console.error('Silme işlemi başarısız:', err);
      toast.error('Ürün silinirken bir hata oluştu.', { position: 'top-right' });
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  // Redirect non-admins to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2>Neta Oto Market</h2>
          <span className="admin-badge">Admin</span>
        </div>
        
        <div className="admin-sidebar-menu">
          <p className="admin-menu-title">MENU</p>
          <ul className="admin-nav-list">
            <li>
              <button 
                className={`admin-nav-item justify-between ${activeTab === 'Kontrol Paneli' ? 'active' : ''}`}
                onClick={() => {
                  setIsControlPanelOpen(!isControlPanelOpen);
                  setActiveTab('Kontrol Paneli');
                }}
              >
                <div className="admin-nav-item-content">
                  <LayoutDashboard size={18} />
                  <span>Kontrol Paneli</span>
                </div>
                {isControlPanelOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              
              {isControlPanelOpen && (
                <ul className="admin-subnav-list">
                  <li>
                    <button 
                      className={`admin-nav-item ${activeTab === 'Ürünler' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Ürünler')}
                    >
                      <Package size={18} />
                      Ürünler
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`admin-nav-item ${activeTab === 'Kategoriler & Markalar' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Kategoriler & Markalar')}
                    >
                      <Tags size={18} />
                      Kategoriler & Markalar
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`admin-nav-item ${activeTab === 'Siparişler' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Siparişler')}
                      style={{ paddingRight: '1rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ShoppingCart size={18} />
                          Siparişler
                        </div>
                        {pendingOrdersCount > 0 && (
                          <span style={{ backgroundColor: '#ef4444', color: 'white', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {pendingOrdersCount}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`admin-nav-item ${activeTab === 'Müşteriler' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Müşteriler')}
                    >
                      <Users size={18} />
                      Müşteriler
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`admin-nav-item ${activeTab === 'Kampanyalar' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Kampanyalar')}
                    >
                      <Star size={18} />
                      Kampanyalar
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`admin-nav-item ${activeTab === 'Raporlar' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Raporlar')}
                    >
                      <PieChart size={18} />
                      Raporlar
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>

          <div className="admin-sidebar-divider"></div>
          
          <ul className="admin-nav-list">
            <li>
              <button 
                className={`admin-nav-item ${activeTab === 'Site Ayarları' ? 'active' : ''}`}
                onClick={() => setActiveTab('Site Ayarları')}
              >
                <Settings size={18} />
                Site Ayarları
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Right Content Area */}
      <div className="admin-main-wrapper">
        
        {/* Header */}
        <header className="admin-top-header">
          <div className="admin-header-left">
            <button className="icon-btn" title="Menüyü Aç/Kapat">
              <MenuIcon size={24} color="#6b7280" />
            </button>
            <button className="btn btn-secondary back-to-home-btn" onClick={() => navigate('/')}>
              <ArrowLeft size={16} />
              Ana Sayfaya Dön
            </button>
          </div>
          
          <div className="admin-header-right">
            <div className="admin-profile-dropdown">
              <div className="admin-avatar">A</div>
              <span className="admin-name">Admin</span>
              <button className="icon-btn text-danger ml-2" onClick={() => { logout(); navigate('/'); }} title="Çıkış Yap">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content-area">
          {activeTab === 'Kontrol Paneli' && <DashboardHome />}
          {activeTab === 'Kampanyalar' && <DiscountCodes />}
          {activeTab === 'Siparişler' && <AdminOrders />}
          {activeTab === 'Müşteriler' && <AdminCustomers />}
          
          {activeTab === 'Ürünler' && (
            <>
              <div className="admin-toolbar">
                <h2 className="admin-page-title">Ürün Listesi</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <select 
                    value={productFilterStatus}
                    onChange={(e) => setProductFilterStatus(e.target.value)}
                    style={{ 
                      padding: '0.4rem 2rem 0.4rem 0.8rem', 
                      height: 'auto', 
                      width: 'auto',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#fff',
                      color: '#374151',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="all">Tümü</option>
                    <option value="in-stock">Stokta Var</option>
                    <option value="out-of-stock">Stokta Yok</option>
                  </select>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleAddClick} 
                    style={{ 
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem', 
                      padding: '0.4rem 1rem', 
                      height: 'auto' 
                    }}
                  >
                    <Plus size={16} />
                    Yeni Ürün Ekle
                  </button>
                </div>
              </div>

              {loading && <p className="text-gray-500">Yükleniyor...</p>}
              {error && <p className="text-error">{error}</p>}

              {!loading && !error && (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Görsel</th>
                        <th>Ürün Adı</th>
                        <th>Kategori</th>
                        <th>Stok Durumu</th>
                        <th>Fiyat</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-gray-500">Hiç ürün bulunamadı.</td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr key={product.id}>
                            <td className="w-20">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="admin-table-img" />
                              ) : (
                                <div className="admin-table-img-placeholder">Yok</div>
                              )}
                            </td>
                            <td className="font-medium text-gray-900">{product.name}</td>
                            <td className="text-gray-500">{product.category || '-'}</td>
                            <td>
                              <span className={`status-badge ${product.inStock ? 'status-in-stock' : 'status-out-stock'}`}>
                                {product.inStock ? 'Stokta Var' : 'Tükendi'}
                              </span>
                            </td>
                            <td className="font-medium text-gray-700">{product.price ? formatPrice(product.price) : '-'}</td>
                            <td>
                              <div className="admin-table-actions">
                                <button className="admin-action-btn edit-btn" onClick={() => handleEditClick(product)} title="Düzenle">
                                  <Edit2 size={16} />
                                </button>
                                <button className="admin-action-btn delete-btn" onClick={() => setDeletingProduct(product)} title="Sil">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          
          {activeTab !== 'Kontrol Paneli' && activeTab !== 'Ürünler' && activeTab !== 'Siparişler' && activeTab !== 'Kampanyalar' && activeTab !== 'Müşteriler' && (
            <div className="admin-empty-state">
              <h3>{activeTab} Modülü</h3>
              <p className="text-gray-500">Bu modül yapım aşamasındadır.</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        editProduct={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="modal-overlay" onClick={() => setDeletingProduct(null)}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '2.5rem 2rem', textAlign: 'center', borderRadius: '16px' }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', width: '72px', height: '72px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.2)' }}>
                <AlertTriangle size={36} />
              </div>
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem', fontFamily: 'var(--heading)' }}>
              Ürünü Sil
            </h2>
            
            <p style={{ color: '#4b5563', marginBottom: '2rem', lineHeight: '1.6', fontSize: '1rem' }}>
              <strong style={{ color: '#111827' }}>{deletingProduct.name}</strong> isimli ürünü silmek istediğinize emin misiniz?<br/>Bu işlem geri alınamaz.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '0.875rem', fontWeight: '600', fontSize: '1rem', borderRadius: '8px' }}
                onClick={() => setDeletingProduct(null)}
              >
                İptal
              </button>
              <button 
                className="btn" 
                style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.875rem', fontWeight: '600', fontSize: '1rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(239, 68, 68, 0.25)', transition: 'all 0.2s' }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                onClick={confirmDelete}
              >
                Evet, Sil
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
