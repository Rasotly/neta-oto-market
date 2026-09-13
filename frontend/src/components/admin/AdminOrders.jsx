import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PackageOpen, X, ChevronDown, Check, Clock, Truck, XCircle, Search, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';

const AdminOrders = () => {
  const { registeredUsers, updateAnyUser } = useAuth();
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  // Extract and flatten all orders
  const allOrders = useMemo(() => {
    let orders = [];
    (registeredUsers || []).forEach(user => {
      if (user.orders && Array.isArray(user.orders)) {
        user.orders.forEach(order => {
          orders.push({
            ...order,
            userId: user.id,
            userName: user.name || (order.shippingAddress?.firstName + ' ' + order.shippingAddress?.lastName)
          });
        });
      }
    });
    // Sort by date descending
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    return orders;
  }, [registeredUsers]);

  const handleStatusChange = (order, newStatus) => {
    if (newStatus === 'Kargoya Verildi' && (!order.trackingNumber || order.trackingNumber.startsWith('TR'))) {
      setSelectedOrder(order);
      setTrackingModalOpen(true);
      return; // Will update after tracking number is provided
    }
    
    updateOrderStatus(order, newStatus, order.trackingNumber);
  };

  const updateOrderStatus = (order, status, tracking) => {
    const userToUpdate = registeredUsers.find(u => u.id === order.userId);
    if (!userToUpdate) return;
    
    const updatedOrders = userToUpdate.orders.map(o => {
      if (o.id === order.id) {
        return { ...o, status, trackingNumber: tracking || o.trackingNumber };
      }
      return o;
    });

    updateAnyUser(order.userId, { orders: updatedOrders });
  };

  const handleTrackingSubmit = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder, 'Kargoya Verildi', trackingNumber || 'Belirtilmedi');
    }
    setTrackingModalOpen(false);
    setSelectedOrder(null);
    setTrackingNumber('');
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Onay Bekliyor': return 'status-pending';
      case 'Hazırlanıyor': return 'status-preparing';
      case 'Kargoya Verildi': return 'status-shipped';
      case 'Tamamlandı': return 'status-completed';
      case 'İptal Edildi': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const tabs = ['Tüm Siparişler', 'Yeni (Bekleyen)', 'Kargodakiler', 'Teslim Edilenler'];
  const [activeTab, setActiveTab] = useState('Tüm Siparişler');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  const getFilterStatusFromTab = (tab) => {
    switch (tab) {
      case 'Yeni (Bekleyen)': return 'Onay Bekliyor';
      case 'Kargodakiler': return 'Kargoya Verildi';
      case 'Teslim Edilenler': return 'Tamamlandı';
      default: return 'Tümü';
    }
  };

  const filteredOrders = useMemo(() => {
    const currentFilter = getFilterStatusFromTab(activeTab);
    return allOrders.filter(o => {
      let matchesStatus = currentFilter === 'Tümü' || o.status === currentFilter;
      
      let matchesSearch = true;
      if (orderSearchTerm) {
        const lowerTerm = orderSearchTerm.toLowerCase();
        matchesSearch = (o.id && o.id.toLowerCase().includes(lowerTerm)) || 
                        (o.userName && o.userName.toLowerCase().includes(lowerTerm));
      }
      
      return matchesStatus && matchesSearch;
    });
  }, [allOrders, activeTab, orderSearchTerm]);

  const handleCopyTracking = (tracking) => {
    if (!tracking) return;
    navigator.clipboard.writeText(tracking);
    toast.success('Takip No Kopyalandı', { position: 'top-right' });
  };

  if (allOrders.length === 0) {
    return (
      <div className="admin-orders-empty" style={{ textAlign: 'center', padding: '5rem 0', color: '#6b7280' }}>
        <PackageOpen size={64} style={{ opacity: 0.5, margin: '0 auto 1rem auto' }} />
        <h3>Sistemde hiç sipariş bulunmuyor.</h3>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 className="admin-page-title" style={{ margin: 0, fontSize: '1.25rem' }}>Sipariş Listesi</h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <div className="admin-orders-tabs" style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e5e7eb', flex: 1, overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.75rem 0',
                  fontSize: '0.9375rem',
                  fontWeight: activeTab === tab ? '600' : '500',
                  color: activeTab === tab ? '#111827' : '#6b7280',
                  borderBottom: activeTab === tab ? '2px solid #f97316' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '-1px'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Sipariş Numarası veya İsim ara..." 
              value={orderSearchTerm}
              onChange={(e) => setOrderSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                outline: 'none',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {activeTab === 'Kargodakiler' ? (
                <>
                  <th>Sipariş No</th>
                  <th>Müşteri Adı</th>
                  <th>Tarih</th>
                  <th>Kargo Firması</th>
                  <th style={{ width: '30%' }}>Kargo Takip No</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </>
              ) : (
                <>
                  <th>Sipariş No</th>
                  <th>Müşteri</th>
                  <th>Tarih</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">Bu duruma ait sipariş bulunmuyor.</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>{order.userName}</td>
                  {activeTab === 'Kargodakiler' ? (
                    <>
                      <td>{new Date(order.date).toLocaleDateString('tr-TR')}</td>
                      <td>Standart Kargo</td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', padding: '0.375rem 0.75rem', borderRadius: '6px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#374151' }}>{order.trackingNumber || 'Belirtilmedi'}</span>
                          {order.trackingNumber && (
                            <button 
                              onClick={() => handleCopyTracking(order.trackingNumber)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#9ca3af', display: 'flex' }}
                              title="Kopyala"
                            >
                              <Copy size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{new Date(order.date).toLocaleDateString('tr-TR')}</td>
                      <td>{formatPrice(order.totalAmount)}</td>
                    </>
                  )}
                  <td>
                    {order.status === 'Kargoya Verildi' ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600, pointerEvents: 'none' }}>
                          <Truck size={14} /> <span>Kargoda</span>
                        </div>
                        <select 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                        >
                          <option className="status-option" value="Onay Bekliyor">Onay Bekliyor</option>
                          <option className="status-option" value="Hazırlanıyor">Hazırlanıyor</option>
                          <option className="status-option" value="Kargoya Verildi">Kargoya Verildi</option>
                          <option className="status-option" value="Tamamlandı">Tamamlandı</option>
                          <option className="status-option" value="İptal Edildi">İptal Edildi</option>
                        </select>
                      </div>
                    ) : (
                      <select 
                        className={`status-select ${getStatusBadgeClass(order.status)}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                      >
                        <option className="status-option" value="Onay Bekliyor">Onay Bekliyor</option>
                        <option className="status-option" value="Hazırlanıyor">Hazırlanıyor</option>
                        <option className="status-option" value="Kargoya Verildi">Kargoya Verildi</option>
                        <option className="status-option" value="Tamamlandı">Tamamlandı</option>
                        <option className="status-option" value="İptal Edildi">İptal Edildi</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <button className="btn-order-detail-admin" onClick={() => openDetails(order)}>
                      Detay
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tracking Number Modal */}
      {trackingModalOpen && selectedOrder && (
        <div className="order-modal-overlay" onClick={() => { setTrackingModalOpen(false); setSelectedOrder(null); }}>
          <div className="order-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="order-modal-header">
              <h3>Kargo Takip Numarası</h3>
              <button className="order-modal-close" onClick={() => { setTrackingModalOpen(false); setSelectedOrder(null); }}>
                <X size={24} />
              </button>
            </div>
            <div className="order-modal-body">
              <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>{selectedOrder.id} numaralı sipariş için kargo takip numarasını girin.</p>
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Örn: TR123456789"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
              />
              <button className="auth-submit-btn" style={{ marginTop: '1rem' }} onClick={handleTrackingSubmit}>
                Kaydet ve Kargoya Ver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {detailsModalOpen && selectedOrder && (
        <div className="order-modal-overlay" onClick={() => { setDetailsModalOpen(false); setSelectedOrder(null); }}>
          <div className="order-modal-content" onClick={e => e.stopPropagation()}>
            <div className="order-modal-header">
              <h3>Sipariş Detayı ({selectedOrder.id})</h3>
              <button className="order-modal-close" onClick={() => { setDetailsModalOpen(false); setSelectedOrder(null); }}>
                <X size={24} />
              </button>
            </div>
            <div className="order-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              
              <div className="order-detail-section">
                <h4 style={{ marginBottom: '0.5rem', color: '#111827' }}>Müşteri & Teslimat Bilgileri</h4>
                <div className="order-detail-row">
                  <span>Ad Soyad</span>
                  <span>{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</span>
                </div>
                <div className="order-detail-row">
                  <span>Telefon</span>
                  <span>{selectedOrder.shippingAddress?.phone}</span>
                </div>
                <div className="order-detail-row">
                  <span>Adres</span>
                  <span>{selectedOrder.shippingAddress?.address} <br/> {selectedOrder.shippingAddress?.district} / {selectedOrder.shippingAddress?.city}</span>
                </div>
              </div>

              <hr style={{ borderColor: '#e5e7eb', margin: '1rem 0' }} />

              <div className="order-detail-section">
                <h4 style={{ marginBottom: '0.5rem', color: '#111827' }}>Sipariş İçeriği</h4>
                <div className="order-items" style={{ marginTop: '0.5rem' }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="order-item">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="order-item-img" />
                      ) : (
                        <div className="order-item-placeholder">Yok</div>
                      )}
                      <div className="order-item-details">
                        <h4 className="order-item-name">{item.name}</h4>
                        <div className="order-item-meta">{item.quantity} Adet • {formatPrice(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr style={{ borderColor: '#e5e7eb', margin: '1rem 0' }} />

              <div className="order-detail-section">
                <div className="order-detail-row">
                  <span>Toplam Tutar</span>
                  <span style={{ fontSize: '1.25rem', color: '#f97316' }}>{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
                <div className="order-detail-row" style={{ marginTop: '0.5rem' }}>
                  <span>Kargo Takip No</span>
                  <span>{selectedOrder.trackingNumber || 'Atanmadı'}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
