import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Plus, Trash2, Edit2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DiscountCodes = () => {
  const { discountCodes, addDiscountCode, updateDiscountCode, removeDiscountCode } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCode.trim() || !discountValue) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }
    
    // Check if code already exists
    if (!editingId && discountCodes.some(c => c.code.toUpperCase() === newCode.trim().toUpperCase())) {
      toast.error('Bu kod zaten mevcut');
      return;
    }

    if (editingId) {
      updateDiscountCode(editingId, {
        code: newCode.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        isActive
      });
      toast.success('İndirim kodu güncellendi');
    } else {
      addDiscountCode({
        code: newCode.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        isActive: true
      });
      toast.success('İndirim kodu oluşturuldu');
    }

    resetForm();
  };

  const handleEdit = (code) => {
    setEditingId(code.id);
    setNewCode(code.code);
    setDiscountType(code.discountType);
    setDiscountValue(code.discountValue);
    setIsActive(code.isActive);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewCode('');
    setDiscountValue('');
    setDiscountType('percentage');
    setIsActive(true);
  };

  return (
    <div className="discount-codes-container">
      <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="admin-page-title">İndirim Kodları & Kampanyalar</h2>
        <button className="btn btn-primary" onClick={() => {
          if (isAdding) {
            resetForm();
          } else {
            setIsAdding(true);
          }
        }}>
          {isAdding ? <XCircle size={18} /> : <Plus size={18} />}
          {isAdding ? 'İptal' : 'Yeni Kod Oluştur'}
        </button>
      </div>

      {isAdding && (
        <div className="add-discount-form" style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem' }}>{editingId ? 'Kodu Düzenle' : 'Yeni İndirim Kodu'}</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Kupon Kodu</label>
              <input 
                type="text" 
                className="page-input" 
                placeholder="Örn: YAZ10" 
                value={newCode}
                onChange={e => setNewCode(e.target.value.toUpperCase())}
              />
            </div>
            
            <div className="input-group" style={{ width: '150px', marginBottom: 0 }}>
              <label className="input-label">İndirim Türü</label>
              <select 
                className="page-input" 
                value={discountType}
                onChange={e => setDiscountType(e.target.value)}
                style={{ padding: '0.875rem' }}
              >
                <option value="percentage">Yüzde (%)</option>
                <option value="fixed">Sabit Tutar (₺)</option>
              </select>
            </div>
            
            <div className="input-group" style={{ width: '150px', marginBottom: 0 }}>
              <label className="input-label">Değer</label>
              <input 
                type="number" 
                className="page-input" 
                placeholder={discountType === 'percentage' ? '10' : '500'} 
                value={discountValue}
                onChange={e => setDiscountValue(e.target.value)}
                min="1"
              />
            </div>
            
            {editingId && (
              <div className="input-group" style={{ width: '150px', marginBottom: 0 }}>
                <label className="input-label">Durum</label>
                <select 
                  className="page-input" 
                  value={isActive}
                  onChange={e => setIsActive(e.target.value === 'true')}
                  style={{ padding: '0.875rem' }}
                >
                  <option value="true">Aktif</option>
                  <option value="false">Pasif</option>
                </select>
              </div>
            )}
            
            <button type="submit" className="btn btn-primary" style={{ height: '3.1rem' }}>
              {editingId ? 'Güncelle' : 'Oluştur'}
            </button>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kod</th>
              <th>Tür</th>
              <th>Değer</th>
              <th className="text-center">Durum</th>
              <th className="text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {discountCodes.map((code) => (
              <tr key={code.id}>
                <td><strong>{code.code}</strong></td>
                <td>{code.discountType === 'percentage' ? 'Yüzde İndirimi' : 'Sabit Tutar'}</td>
                <td>{code.discountType === 'percentage' ? `%${code.discountValue}` : `${code.discountValue} ₺`}</td>
                <td className="text-center">
                  <span 
                    className={`status-badge ${code.isActive ? 'status-active' : 'status-inactive'}`}
                    style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.875rem',
                      backgroundColor: code.isActive ? '#d1fae5' : '#fee2e2',
                      color: code.isActive ? '#065f46' : '#991b1b',
                      display: 'inline-block'
                    }}
                  >
                    {code.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="text-center">
                  <div className="admin-table-actions" style={{ justifyContent: 'center' }}>
                    <button 
                      className="admin-action-btn edit-btn"
                      title="Düzenle"
                      onClick={() => handleEdit(code)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="admin-action-btn delete-btn"
                      onClick={() => {
                        if(window.confirm('Bu kodu silmek istediğinize emin misiniz?')) {
                          removeDiscountCode(code.id);
                          toast.success('Kod silindi');
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {discountCodes.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center" style={{ padding: '2rem' }}>
                  Henüz bir indirim kodu oluşturulmadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountCodes;
