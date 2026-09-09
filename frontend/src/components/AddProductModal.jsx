import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    imageUrl: '',
    inStock: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Ürün adı zorunludur.';
    if (!formData.category) newErrors.category = 'Kategori seçmelisiniz.';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz (0\'dan büyük).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price)
      };
      
      const response = await axios.post('https://localhost:7141/api/products', payload);
      
      // Formu temizle
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
        imageUrl: '',
        inStock: true
      });
      setIsSubmitting(false);
      onProductAdded(response.data); // Üst bileşene yeni ürünü ilet
    } catch (error) {
      console.error('Ekleme hatası:', error);
      setErrors({ submit: 'Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Yeni Ürün Ekle</h2>
          <button className="icon-btn modal-close-btn" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {errors.submit && <div className="form-error global-error">{errors.submit}</div>}
          
          <div className="form-group">
            <label>Ürün Adı *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              placeholder="Örn: Motor Yağı 5W-30"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kategori *</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className={errors.category ? 'input-error' : ''}
              >
                <option value="">Seçiniz</option>
                <option value="Motor">Motor</option>
                <option value="Filtre">Filtre</option>
                <option value="Yağ & Sıvı">Yağ & Sıvı</option>
                <option value="Fren Sistemi">Fren Sistemi</option>
                <option value="Elektrik">Elektrik</option>
                <option value="Aksesuar">Aksesuar</option>
                <option value="Diğer">Diğer</option>
              </select>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label>Fiyat (₺) *</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange}
                className={errors.price ? 'input-error' : ''}
                placeholder="0.00"
                step="0.01"
              />
              {errors.price && <span className="form-error">{errors.price}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Görsel URL</label>
            <input 
              type="text" 
              name="imageUrl" 
              value={formData.imageUrl} 
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              rows="3"
              placeholder="Ürün özellikleri..."
            ></textarea>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="inStock" 
                checked={formData.inStock} 
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Stokta Var
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
