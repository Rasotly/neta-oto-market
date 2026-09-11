import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, X, MapPin, Phone, Mail, ShoppingBag } from 'lucide-react';

const AdminCustomers = () => {
  const { registeredUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = useMemo(() => {
    let users = registeredUsers || [];
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      users = users.filter(u => 
        (u.name && u.name.toLowerCase().includes(lowerTerm)) || 
        (u.email && u.email.toLowerCase().includes(lowerTerm))
      );
    }
    // Sort by latest registered
    return users.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });
  }, [registeredUsers, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmedi';
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    } catch {
      return 'Geçersiz Tarih';
    }
  };

  const generateId = (id) => {
    if (!id) return '-';
    // Generate a short hash-like string or just use the first 4 chars of the id
    return `#NETA-USR-${id.substring(0, 4).toUpperCase()}`;
  };

  return (
    <div className="admin-customers-container">
      <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h2 className="admin-page-title" style={{ margin: 0 }}>Müşteri Listesi</h2>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="İsim veya E-posta ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem 0.6rem 2.5rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              outline: 'none',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Müşteri ID</th>
              <th>Ad Soyad</th>
              <th>E-posta Adresi</th>
              <th>Kayıt Tarihi</th>
              <th>Siparişler</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                  <Users size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto', display: 'block' }} />
                  <p>Sistemde henüz kayıtlı müşteri bulunmuyor.</p>
                </td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td style={{ fontWeight: '600', color: '#4b5563' }}>{generateId(customer.id)}</td>
                  <td style={{ fontWeight: '500', color: '#111827' }}>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{formatDate(customer.createdAt)}</td>
                  <td>
                    <span style={{ fontWeight: '600', color: '#374151' }}>
                      {customer.orders ? customer.orders.length : 0}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge status-completed" style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#d1fae5', color: '#059669' }}>
                      Aktif
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-order-detail-admin" 
                      onClick={() => setSelectedCustomer(customer)}
                      style={{ background: '#fff', border: '1px solid #d1d5db', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: '500', cursor: 'pointer', color: '#374151' }}
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} color="#f97316" />
                Müşteri Detayı
              </h3>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kişisel Bilgiler</h4>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#111827', fontSize: '1.1rem' }}>{selectedCustomer.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                  <Mail size={16} /> {selectedCustomer.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563' }}>
                  <Phone size={16} /> {selectedCustomer.phone || 'Belirtilmedi'}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hesap Özeti</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                  <ShoppingBag size={16} /> Toplam Sipariş: <strong>{selectedCustomer.orders ? selectedCustomer.orders.length : 0}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563' }}>
                  <span style={{ width: '16px', display: 'inline-block', textAlign: 'center' }}>📅</span> Kayıt: {formatDate(selectedCustomer.createdAt)}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Kayıtlı Adresler</h4>
              {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedCustomer.addresses.map((addr, idx) => (
                    <div key={idx} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <MapPin size={16} color="#f97316" />
                        <strong style={{ color: '#111827' }}>{addr.title}</strong>
                      </div>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#4b5563', fontSize: '0.875rem' }}>{addr.fullName} - {addr.phone}</p>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                        {addr.address}, {addr.district}/{addr.city}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Kullanıcının kayıtlı adresi bulunmuyor.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
