import React from 'react';
import { TrendingUp, Clock, Package, Users } from 'lucide-react';

const DashboardHome = () => {
  // Mock Data
  const recentOrders = [
    { id: '#1024', customer: 'Ahmet Yılmaz', date: '10 Eyl 2026', total: '1.250 ₺', status: 'Tamamlandı' },
    { id: '#1025', customer: 'Mehmet Demir', date: '09 Eyl 2026', total: '8.400 ₺', status: 'Kargoda' },
    { id: '#1026', customer: 'Ayşe Kaya', date: '08 Eyl 2026', total: '450 ₺', status: 'Bekliyor' },
    { id: '#1027', customer: 'Fatma Çelik', date: '07 Eyl 2026', total: '3.200 ₺', status: 'Tamamlandı' },
  ];

  const lowStockItems = [
    { id: 1, name: 'CIVIC 2022+ 4 LENS LED FAR', stock: 2 },
    { id: 2, name: 'BMW F30 M TAMPON SETİ', stock: 5 },
    { id: 3, name: 'VW GOLF 7.5 KAYAR SİNYAL', stock: 1 },
    { id: 4, name: 'AUDI A3 RS PANJUR', stock: 3 },
  ];

  return (
    <div className="dashboard-home">
      {/* Stat Widgets */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-title">Toplam Ciro</div>
            <TrendingUp size={20} className="stat-icon-green" />
          </div>
          <div className="stat-value">124.500 ₺</div>
          <div className="stat-subtitle text-green">+%12 geçen aya göre</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-title">Bekleyen Siparişler</div>
            <Clock size={20} className="stat-icon-orange" />
          </div>
          <div className="stat-value">14</div>
          <div className="stat-subtitle">İşlem bekliyor</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-title">Toplam Ürün</div>
            <Package size={20} className="stat-icon-blue" />
          </div>
          <div className="stat-value">328</div>
          <div className="stat-subtitle">Aktif satışta</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-title">Aktif Müşteriler</div>
            <Users size={20} className="stat-icon-purple" />
          </div>
          <div className="stat-value">84</div>
          <div className="stat-subtitle">+3 bu hafta</div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="dashboard-bottom-grid">
        {/* Recent Orders */}
        <div className="recent-orders-card">
          <h3 className="card-heading">Son Siparişler</h3>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Müşteri</th>
                  <th>Tarih</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td className="font-medium text-gray-900">{order.id}</td>
                    <td>{order.customer}</td>
                    <td className="text-gray-500">{order.date}</td>
                    <td className="font-medium">{order.total}</td>
                    <td>
                      <span className={`status-badge ${order.status === 'Tamamlandı' ? 'status-in-stock' : order.status === 'Kargoda' ? 'status-shipping' : 'status-pending'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="low-stock-card">
          <h3 className="card-heading">Stoku Azalan Ürünler</h3>
          <div className="low-stock-list">
            {lowStockItems.map(item => (
              <div key={item.id} className="low-stock-item">
                <div className="low-stock-info">
                  <span className="low-stock-name">{item.name}</span>
                </div>
                <div className="low-stock-count">
                  Kalan: <span className="text-danger font-medium">{item.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
