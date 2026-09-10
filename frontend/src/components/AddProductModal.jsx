import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useProducts } from '../context/ProductContext';

const AddProductModal = ({ isOpen, onClose, editProduct }) => {
  const { addProductToState, updateProductInState } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stockCount: '',
    description: '',
    imageUrl: '',
    brand: '',
    model: '',
    inStock: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        category: editProduct.category || '',
        price: editProduct.price || '',
        stockCount: editProduct.stockCount || '',
        description: editProduct.description || '',
        imageUrl: editProduct.imageUrl || '',
        brand: editProduct.brand || '',
        model: editProduct.model || '',
        inStock: editProduct.inStock ?? true
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        stockCount: '',
        description: '',
        imageUrl: '',
        brand: '',
        model: '',
        inStock: true
      });
    }
  }, [editProduct, isOpen]);

  if (!isOpen) return null;

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.category !== '' && 
           formData.brand !== '' &&
           formData.model !== '' &&
           formData.price !== '' && 
           !isNaN(formData.price) && 
           Number(formData.price) > 0;
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
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stockCount: formData.stockCount ? Number(formData.stockCount) : 0
      };
      
      if (editProduct) {
        payload.id = editProduct.id;
        const response = await axios.put(`https://localhost:7141/api/products/${editProduct.id}`, payload);
        updateProductInState(response.data || payload);
        toast.success('Ürün başarıyla güncellendi', { duration: 3000, position: 'top-right' });
      } else {
        const response = await axios.post('https://localhost:7141/api/products', payload);
        addProductToState(response.data);
        toast.success('Ürün başarıyla eklendi', { duration: 3000, position: 'top-right' });
      }
      
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error('İşlem hatası:', error);
      toast.error(editProduct ? 'Ürün güncellenirken bir hata oluştu.' : 'Ürün eklenirken bir hata oluştu.', {
        position: 'top-right',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div>
            <h2>{editProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {editProduct ? 'Ürün bilgilerini güncelleyin.' : 'Mağazanıza yeni bir ürün tanımlayın.'}
            </p>
          </div>
          <button className="icon-btn modal-close-btn" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            
            {/* Temel Bilgiler Section */}
            <div className="form-section">
              <h3 className="section-title">Temel Bilgiler</h3>
              
              <div className="form-group">
                <label>Ürün Adı <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="modern-input"
                  placeholder="Örn: Motor Yağı 5W-30"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fiyat (₺) <span className="text-danger">*</span></label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange}
                    className="modern-input"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Stok Adedi</label>
                  <input 
                    type="number" 
                    name="stockCount" 
                    value={formData.stockCount} 
                    onChange={handleChange}
                    className="modern-input"
                    placeholder="Örn: 50"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group toggle-group">
                <div className="toggle-label-area">
                  <label>Stok Durumu</label>
                  <span className="toggle-desc">Ürün şu anda satışa uygun mu?</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <hr className="my-4 border-t border-gray-200" />

            {/* Uyumluluk Section */}
            <div className="form-section">
              <h3 className="section-title">Uyumluluk (Çok Önemli)</h3>
              
              <div className="form-group">
                <label>Kategori <span className="text-danger">*</span></label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="modern-select"
                >
                  <option value="">Seçiniz</option>
                  <option value="Aydınlatma">Aydınlatma</option>
                  <option value="Body Kit">Body Kit</option>
                  <option value="Motor">Motor</option>
                  <option value="Filtre">Filtre</option>
                  <option value="Yağ & Sıvı">Yağ & Sıvı</option>
                  <option value="Fren Sistemi">Fren Sistemi</option>
                  <option value="İç Trim">İç Trim</option>
                  <option value="Universal">Universal Aksesuar</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Uyumlu Marka <span className="text-danger">*</span></label>
                  <select 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleChange}
                    className="modern-select"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Honda">Honda</option>
                    <option value="BMW">BMW</option>
                    <option value="Audi">Audi</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="Mercedes">Mercedes-Benz</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Universal">Universal (Tüm Araçlar)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Uyumlu Model <span className="text-danger">*</span></label>
                  <select 
                    name="model" 
                    value={formData.model} 
                    onChange={handleChange}
                    className="modern-select"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Civic">Civic</option>
                    <option value="F30">F30</option>
                    <option value="Golf 7">Golf 7</option>
                    <option value="A3">A3</option>
                    <option value="Corolla">Corolla</option>
                    <option value="Tüm Modeller">Tüm Modeller</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="my-4 border-t border-gray-200" />

            {/* Medya & Detay Section */}
            <div className="form-section">
              <h3 className="section-title">Medya & Detay</h3>
              
              <div className="form-group">
                <label>Görsel URL</label>
                <input 
                  type="text" 
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleChange}
                  className="modern-input"
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Açıklama</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  rows="4"
                  className="modern-textarea"
                  placeholder="Ürün özellikleri, malzeme bilgisi vs..."
                ></textarea>
              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? 'Kaydediliyor...' : (editProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Kaydet')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
