import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, ArrowLeft, LogOut, LayoutDashboard, Package, ShoppingCart, Users, Menu as MenuIcon, ChevronDown, ChevronRight } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import { formatPrice } from '../utils/formatters';
import '../App.css';

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://localhost:7141/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Hata:', err);
      setError('Ürünler yüklenemedi.');
      setLoading(false);
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productToDelete) => {
    const confirmed = window.confirm("Bu ürünü silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    try {
      await axios.delete(`https://localhost:7141/api/products/${productToDelete.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    } catch (err) {
      console.error('Silme işlemi başarısız:', err);
      alert('Ürün silinirken bir hata oluştu.');
    }
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
                className="admin-nav-item justify-between" 
                onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
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
                    <button className="admin-nav-item active">
                      <Package size={18} />
                      Ürünler
                    </button>
                  </li>
                  <li>
                    <button className="admin-nav-item">
                      <ShoppingCart size={18} />
                      Siparişler
                    </button>
                  </li>
                  <li>
                    <button className="admin-nav-item">
                      <Users size={18} />
                      Müşteriler
                    </button>
                  </li>
                </ul>
              )}
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
          <div className="admin-toolbar">
            <h2 className="admin-page-title">Ürün Listesi</h2>
            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} />
              Yeni Ürün Ekle
            </button>
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
                    <th className="text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">Hiç ürün bulunamadı.</td>
                    </tr>
                  ) : (
                    products.map((product) => (
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
                        <td className="text-right">
                          <div className="admin-table-actions">
                            <button className="admin-action-btn edit-btn" onClick={() => setEditingProduct(product)} title="Düzenle">
                              <Edit2 size={16} />
                            </button>
                            <button className="admin-action-btn delete-btn" onClick={() => handleDeleteProduct(product)} title="Sil">
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
        </main>
      </div>

      {/* Modals */}
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onProductAdded={handleProductAdded} 
      />

      <EditProductModal 
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
};

export default AdminDashboard;
