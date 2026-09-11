import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PackageOpen, X } from 'lucide-react';
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

  const [filterStatus, setFilterStatus] = useState('Tümü');

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'Tümü') return allOrders;
    return allOrders.filter(o => o.status === filterStatus);
  }, [allOrders, filterStatus]);

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
      <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
        <h2 className="admin-page-title" style={{ margin: 0, fontSize: '1.25rem' }}>Sipariş Listesi</h2>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ 
            padding: '0.4rem 2rem 0.4rem 0.8rem', 
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: '#fff',
            color: '#374151',
            outline: 'none',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <option value="Tümü">Tüm Durumlar</option>
          <option value="Onay Bekliyor">Onay Bekliyor</option>
          <option value="Hazırlanıyor">Hazırlanıyor</option>
          <option value="Kargoya Verildi">Kargoya Verildi</option>
          <option value="Tamamlandı">Tamamlandı</option>
          <option value="İptal Edildi">İptal Edildi</option>
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sipariş No</th>
              <th>Müşteri</th>
              <th>Tarih</th>
              <th>Tutar</th>
              <th>Durum</th>
              <th>İşlemler</th>
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
                  <td>{new Date(order.date).toLocaleDateString('tr-TR')}</td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>
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
