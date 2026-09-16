import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import axios from 'axios';

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountedPrice: '',
    description: '',
    imageUrl: '',
    category: '',
    brand: '',
    model: '',
    inStock: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        discountedPrice: product.discountedPrice || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        category: product.category || '',
        brand: product.brand || '',
        model: product.model || '',
        inStock: product.inStock ?? true,
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const currentPrice = Number(formData.price) || 0;
  const currentDiscount = Number(formData.discountedPrice) || 0;
  const discountPercentage = (currentPrice > 0 && currentDiscount > 0 && currentPrice > currentDiscount) 
    ? Math.round(((currentPrice - currentDiscount) / currentPrice) * 100) 
    : 0;
  const hasDiscountError = currentDiscount >= currentPrice && currentDiscount > 0;
  const isFormValid = !hasDiscountError && formData.name.trim() !== '' && formData.price !== '' && Number(formData.price) > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      id: product.id,
      name: formData.name,
      price: parseFloat(formData.price),
      discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
      description: formData.description,
      imageUrl: formData.imageUrl,
      category: formData.category,
      brand: formData.brand,
      model: formData.model,
      inStock: formData.inStock,
    };

    try {
      await axios.put(`https://localhost:7141/api/products/${product.id}`, payload);
      onProductUpdated({ ...payload });
    } catch (err) {
      console.error('Ürün güncellenirken hata oluştu:', err);
      setError('Ürün güncellenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ürünü Düzenle</h2>
          <button className="icon-btn modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <div className="global-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="edit-name">Ürün Adı *</label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <div className="flex items-center h-8">
                <label htmlFor="edit-price" style={{ margin: 0 }}>Normal Fiyat (₺) *</label>
              </div>
              <input
                type="number"
                id="edit-price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group relative">
              <div className="flex justify-between items-center h-8">
                <label htmlFor="edit-discount" style={{ margin: 0 }}>İndirimli Fiyat (₺)</label>
                {discountPercentage > 0 && !hasDiscountError && (
                  <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded-md text-xs">
                    %{discountPercentage} İndirim
                  </span>
                )}
              </div>
              <input
                type="number"
                id="edit-discount"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                className={hasDiscountError ? 'input-error' : ''}
                placeholder="Opsiyonel"
                min="0"
                step="0.01"
              />
              {hasDiscountError && (
                <span className="text-red-500 text-xs mt-1">İndirimli fiyat, normal fiyattan yüksek olamaz!</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-category">Kategori *</label>
              <input
                type="text"
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-brand">Marka</label>
              <input
                type="text"
                id="edit-brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-model">Model / Uyumlu Araç</label>
              <input
                type="text"
                id="edit-model"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Görsel Yükle</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0, padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '0.75rem', border: '1px dashed #d1d5db', backgroundColor: '#f9fafb', color: '#4b5563' }} title="Cihazdan Yükle">
                <Upload size={20} />
                <span>Cihazdan Dosya Seç</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>
            {formData.imageUrl && formData.imageUrl.startsWith('data:image') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#16a34a', fontWeight: '500' }}>
                ✓ Yerel görsel belleğe alındı.
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Açıklama</label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
              />
              Stokta Var
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !isFormValid}>
              {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
