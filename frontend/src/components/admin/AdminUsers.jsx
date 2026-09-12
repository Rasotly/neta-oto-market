import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, User, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tümü');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'İçerik Editörü'
  });

  // Mock Data
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin', email: 'admin@netaotomarket.com', role: 'Süper Admin', lastLogin: '10 Dk Önce', avatar: 'A' },
    { id: 2, name: 'Ahmet Yılmaz', email: 'ahmet@netaotomarket.com', role: 'İçerik Editörü', lastLogin: '2 Saat Önce', avatar: 'AH' },
    { id: 3, name: 'Ayşe Kaya', email: 'ayse@netaotomarket.com', role: 'Operasyon Sorumlusu', lastLogin: '1 Gün Önce', avatar: 'AY' },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Tümü' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Süper Admin':
        return <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Shield size={12} /> {role}</span>;
      case 'İçerik Editörü':
        return <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> {role}</span>;
      case 'Operasyon Sorumlusu':
        return <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> {role}</span>;
      default:
        return <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>{role}</span>;
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'İçerik Editörü' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData, avatar: formData.name.substring(0, 2).toUpperCase() } : u));
      toast.success('Yönetici başarıyla güncellendi.');
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        lastLogin: 'Hiç giriş yapmadı',
        avatar: formData.name.substring(0, 2).toUpperCase()
      };
      setUsers([...users, newUser]);
      toast.success('Yeni yönetici başarıyla eklendi.');
    }
    setIsModalOpen(false);
  };

  const requestDelete = (id) => {
    if(id === currentUser.id) {
      toast.error('Kendi hesabınızı silemezsiniz!');
      return;
    }
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setUsers(users.filter(u => u.id !== deleteConfirmId));
      toast.success('Yönetici silindi.');
      setDeleteConfirmId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="admin-page-title" style={{ margin: 0 }}>Yöneticiler ve Ekip</h2>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }} className="flex justify-between items-center mb-4">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="İsim veya e-posta ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#fff', minWidth: '180px' }}
          >
            <option value="Tümü">Tüm Roller</option>
            <option value="Süper Admin">Süper Admin</option>
            <option value="Operasyon Sorumlusu">Operasyon Sorumlusu</option>
            <option value="İçerik Editörü">İçerik Editörü</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} />
          Yeni Yönetici Ekle
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Yönetici</th>
              <th>E-Posta</th>
              <th>Atanan Rol</th>
              <th>Son Giriş</th>
              <th style={{ textAlign: 'right' }}>Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Kayıtlı yönetici bulunamadı.</td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const isMe = currentUser && currentUser.id === user.id;
                
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '0.875rem' }}>
                          {user.avatar}
                        </div>
                        <div style={{ fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {user.name}
                          {isMe && <span style={{ fontSize: '0.7rem', backgroundColor: '#e5e7eb', padding: '0.125rem 0.375rem', borderRadius: '4px', color: '#374151', fontWeight: '500' }}>SEN</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#4b5563' }}>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td style={{ color: '#6b7280', fontSize: '0.875rem' }}>{user.lastLogin}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          className={`admin-action-btn edit ${isMe ? 'pointer-events-none opacity-40' : ''}`} 
                          title="Düzenle" 
                          onClick={() => handleOpenModal(user)}
                          disabled={isMe}
                          style={{ cursor: isMe ? 'not-allowed' : 'pointer' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className={`admin-action-btn delete ${isMe ? 'pointer-events-none opacity-40' : ''}`}
                          title="Sil" 
                          onClick={() => requestDelete(user.id)}
                          disabled={isMe}
                          style={{ cursor: isMe ? 'not-allowed' : 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px', padding: '2rem', borderRadius: '12px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>{editingUser ? 'Yöneticiyi Düzenle' : 'Yeni Yönetici Ekle'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Ad Soyad</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} 
                  placeholder="Örn: Ahmet Yılmaz"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>E-Posta Adresi</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} 
                  placeholder="Örn: ahmet@sirket.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  {editingUser ? 'Yeni Şifre (Boş bırakırsanız değişmez)' : 'Geçici Şifre'}
                </label>
                <input 
                  type="text" 
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} 
                  placeholder="Kullanıcıya iletilecek şifre"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Rol / Yetki Seviyesi</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }}
                >
                  <option value="Süper Admin">Süper Admin (Tam Yetki)</option>
                  <option value="Operasyon Sorumlusu">Operasyon Sorumlusu (Sipariş ve Müşteri)</option>
                  <option value="İçerik Editörü">İçerik Editörü (Katalog ve Kategori)</option>
                </select>
                <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                  * Roller kullanıcıların sol menüde görebileceği sekmeleri belirler.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>İptal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingUser ? 'Güncelle' : 'Kaydet'}</button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '2rem', borderRadius: '12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#111827' }}>Yöneticiyi Sil</h3>
            <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
              Bu yöneticiyi sistemden kaldırmak istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)} style={{ flex: 1 }}>İptal</button>
              <button className="btn btn-primary" onClick={confirmDelete} style={{ flex: 1, backgroundColor: '#dc2626', borderColor: '#dc2626' }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
