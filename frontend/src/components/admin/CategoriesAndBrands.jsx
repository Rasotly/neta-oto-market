import React, { useState } from 'react';
import { Tags, Plus, Edit2, Trash2, ChevronDown, ChevronUp, X, FolderTree, AlertTriangle } from 'lucide-react';

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const turkishToEnglish = (text) => {
  const map = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, match => map[match]);
};

const createSlug = (text) => generateSlug(turkishToEnglish(text));

const CategoriesAndBrands = () => {
  const [activeTab, setActiveTab] = useState('categories');

  // --- Categories State ---
  const [categories, setCategories] = useState([
    { id: 1, name: 'Aydınlatma', slug: 'aydinlatma', count: 24 },
    { id: 2, name: 'İç Aksesuar', slug: 'ic-aksesuar', count: 12 },
    { id: 3, name: 'Dış Aksesuar', slug: 'dis-aksesuar', count: 35 },
  ]);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');

  // --- Brands & Models State ---
  const [brands, setBrands] = useState([
    { 
      id: 1, 
      brand: 'Honda', 
      models: [
        { id: 101, name: 'Civic 2022+' },
        { id: 102, name: 'Accord 2021+' }
      ] 
    },
    { 
      id: 2, 
      brand: 'Toyota', 
      models: [
        { id: 201, name: 'Corolla 2019+' }
      ] 
    }
  ]);
  const [expandedBrands, setExpandedBrands] = useState([1]); // Default open Honda

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [selectedBrandForModel, setSelectedBrandForModel] = useState(null);
  const [newModelName, setNewModelName] = useState('');

  // --- Confirm Dialog State ---
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, item: null, type: '', message: '' });

  // --- Handlers ---
  const handleCategoryNameChange = (e) => {
    const val = e.target.value;
    setNewCategoryName(val);
    setNewCategorySlug(createSlug(val));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat = {
      id: Date.now(),
      name: newCategoryName,
      slug: newCategorySlug || createSlug(newCategoryName),
      count: 0
    };
    setCategories([newCat, ...categories]);
    setIsCategoryModalOpen(false);
    setNewCategoryName('');
    setNewCategorySlug('');
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const toggleBrand = (id) => {
    setExpandedBrands(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleAddBrand = () => {
    if (!newBrandName.trim()) return;
    setBrands([{ id: Date.now(), brand: newBrandName, models: [] }, ...brands]);
    setIsBrandModalOpen(false);
    setNewBrandName('');
  };

  const handleAddModel = () => {
    if (!newModelName.trim() || !selectedBrandForModel) return;
    setBrands(brands.map(b => {
      if (b.id === selectedBrandForModel.id) {
        return { ...b, models: [...b.models, { id: Date.now(), name: newModelName }] };
      }
      return b;
    }));
    setIsModelModalOpen(false);
    setNewModelName('');
    setSelectedBrandForModel(null);
    if (!expandedBrands.includes(selectedBrandForModel.id)) {
      setExpandedBrands([...expandedBrands, selectedBrandForModel.id]);
    }
  };

  const handleDeleteBrand = (id) => {
    setBrands(brands.filter(b => b.id !== id));
  };

  const handleDeleteModel = (brandId, modelId) => {
    setBrands(brands.map(b => {
      if (b.id === brandId) {
        return { ...b, models: b.models.filter(m => m.id !== modelId) };
      }
      return b;
    }));
  };

  const openConfirmDialog = (item, type, message) => {
    setConfirmDialog({ isOpen: true, item, type, message });
  };

  const confirmAction = () => {
    const { item, type } = confirmDialog;
    if (type === 'category') handleDeleteCategory(item.id);
    else if (type === 'brand') handleDeleteBrand(item.id);
    else if (type === 'model') handleDeleteModel(item.brandId, item.modelId);
    
    setConfirmDialog({ isOpen: false, item: null, type: '', message: '' });
  };

  // --- Renderers ---
  const renderCategories = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#111827' }}>Tüm Kategoriler</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsCategoryModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Plus size={16} /> Yeni Kategori Ekle
        </button>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Kategori Adı</th>
              <th>URL (Slug)</th>
              <th>İçerdiği Ürün</th>
              <th style={{ textAlign: 'right' }}>Aksiyonlar</th>
            </tr>
          </thead>
          <tbody style={{ divideY: '1px solid #e5e7eb' }}>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td style={{ fontWeight: '500', color: '#111827' }}>{cat.name}</td>
                <td style={{ color: '#6b7280', fontSize: '0.875rem' }}>/{cat.slug}</td>
                <td>
                  <span style={{ display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: '#f3f4f6', color: '#4b5563', fontSize: '0.75rem', fontWeight: '600' }}>
                    {cat.count} Ürün
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="admin-action-btn edit-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#9ca3af' }} onMouseOver={e => e.currentTarget.style.color = '#f97316'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="admin-action-btn delete-btn" 
                      onClick={() => openConfirmDialog(cat, 'category', `"${cat.name}" kategorisini silmek istediğinize emin misiniz?`)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#9ca3af' }} 
                      onMouseOver={e => e.currentTarget.style.color = '#ef4444'} 
                      onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBrands = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#111827' }}>Markalar ve Modeller</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsBrandModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <Plus size={16} /> Yeni Marka Ekle
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {brands.map(brand => (
          <div key={brand.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
            {/* Brand Header */}
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', cursor: 'pointer', backgroundColor: expandedBrands.includes(brand.id) ? '#f8fafc' : '#fff' }}
              onClick={() => toggleBrand(brand.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {expandedBrands.includes(brand.id) ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
                <span style={{ fontWeight: '600', fontSize: '1.05rem', color: '#111827' }}>{brand.brand}</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#475569', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '600' }}>
                  {brand.models.length} Model
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => { setSelectedBrandForModel(brand); setIsModelModalOpen(true); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#f97316', background: '#fff7ed', border: '1px solid #fed7aa', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <Plus size={14} /> Model Ekle
                </button>
                <div style={{ width: '1px', height: '20px', backgroundColor: '#e5e7eb', margin: '0 0.5rem' }}></div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#9ca3af' }} onMouseOver={e => e.currentTarget.style.color = '#f97316'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => openConfirmDialog(brand, 'brand', `"${brand.brand}" markasını ve tüm alt modellerini silmek istediğinize emin misiniz?`)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#9ca3af' }} 
                  onMouseOver={e => e.currentTarget.style.color = '#ef4444'} 
                  onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Models List */}
            {expandedBrands.includes(brand.id) && (
              <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '0.5rem 0' }}>
                {brand.models.length === 0 ? (
                  <div style={{ padding: '1rem 3rem', color: '#9ca3af', fontSize: '0.875rem', fontStyle: 'italic' }}>
                    Bu markaya henüz model eklenmemiş.
                  </div>
                ) : (
                  brand.models.map(model => (
                    <div key={model.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem 0.75rem 3rem', borderBottom: '1px solid #f3f4f6', ':last-child': { borderBottom: 'none' } }}>
                      <span style={{ color: '#4b5563', fontSize: '0.95rem' }}>{model.name}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: '#9ca3af' }} onMouseOver={e => e.currentTarget.style.color = '#f97316'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => openConfirmDialog({ brandId: brand.id, modelId: model.id }, 'model', `"${model.name}" modelini silmek istediğinize emin misiniz?`)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: '#9ca3af' }} 
                          onMouseOver={e => e.currentTarget.style.color = '#ef4444'} 
                          onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        <h2 className="admin-page-title" style={{ margin: 0 }}>Kategoriler ve Markalar</h2>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', gap: '2rem' }}>
          <button
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '0.75rem 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '2px solid #f97316' : '2px solid transparent',
              color: activeTab === 'categories' ? '#111827' : '#6b7280',
              fontWeight: activeTab === 'categories' ? '600' : '500',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <FolderTree size={18} />
            Kategoriler
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            style={{
              padding: '0.75rem 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'brands' ? '2px solid #f97316' : '2px solid transparent',
              color: activeTab === 'brands' ? '#111827' : '#6b7280',
              fontWeight: activeTab === 'brands' ? '600' : '500',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <Tags size={18} />
            Marka / Modeller
          </button>
        </div>
      </div>

      {activeTab === 'categories' ? renderCategories() : renderBrands()}

      {/* --- Modals --- */}
      
      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>Yeni Kategori Ekle</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Kategori Adı</label>
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={handleCategoryNameChange}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="Örn: Dış Görünüm"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>URL (Slug) - <span style={{color:'#9ca3af', fontWeight:'400'}}>Otomatik</span></label>
                <input 
                  type="text" 
                  value={newCategorySlug} 
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', outline: 'none', boxSizing: 'border-box', color: '#6b7280' }}
                  placeholder="dis-gorunum"
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setIsCategoryModalOpen(false)} style={{ padding: '0.625rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', fontWeight: '500', cursor: 'pointer' }}>İptal</button>
              <button onClick={handleAddCategory} className="btn btn-primary" style={{ padding: '0.625rem 1rem', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', border: 'none' }}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Modal */}
      {isBrandModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>Yeni Marka Ekle</h3>
              <button onClick={() => setIsBrandModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Marka Adı</label>
              <input 
                type="text" 
                value={newBrandName} 
                onChange={e => setNewBrandName(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                placeholder="Örn: Honda"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setIsBrandModalOpen(false)} style={{ padding: '0.625rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', fontWeight: '500', cursor: 'pointer' }}>İptal</button>
              <button onClick={handleAddBrand} className="btn btn-primary" style={{ padding: '0.625rem 1rem', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', border: 'none' }}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* Model Modal */}
      {isModelModalOpen && selectedBrandForModel && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>Yeni Model Ekle</h3>
              <button onClick={() => setIsModelModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                Marka: <strong>{selectedBrandForModel.brand}</strong>
              </div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Model Adı</label>
              <input 
                type="text" 
                value={newModelName} 
                onChange={e => setNewModelName(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }}
                placeholder="Örn: Civic 2022+"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setIsModelModalOpen(false)} style={{ padding: '0.625rem 1rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', fontWeight: '500', cursor: 'pointer' }}>İptal</button>
              <button onClick={handleAddModel} className="btn btn-primary" style={{ padding: '0.625rem 1rem', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', border: 'none' }}>Ekle</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#111827' }}>Emin misiniz?</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {confirmDialog.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button onClick={() => setConfirmDialog({ isOpen: false, item: null, type: '', message: '' })} style={{ padding: '0.625rem 1.25rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', fontWeight: '500', cursor: 'pointer' }}>Vazgeç</button>
              <button onClick={confirmAction} style={{ padding: '0.625rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontWeight: '500', cursor: 'pointer' }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoriesAndBrands;
