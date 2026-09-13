import React from 'react';
import { X, Filter } from 'lucide-react';

const FilterSidebar = ({
  filters,
  setFilters,
  categoryCounts,
  brandCounts,
  onClear,
  onClose,
  isMobileOpen,
  totalResults
}) => {
  const handleCategoryToggle = (category) => {
    setFilters(prev => {
      const current = prev.categories || [];
      const isSelected = current.includes(category);
      return {
        ...prev,
        categories: isSelected 
          ? current.filter(c => c !== category)
          : [...current, category]
      };
    });
  };

  const handleBrandToggle = (brand) => {
    setFilters(prev => {
      const current = prev.brands || [];
      const isSelected = current.includes(brand);
      return {
        ...prev,
        brands: isSelected 
          ? current.filter(b => b !== brand)
          : [...current, brand]
      };
    });
  };

  const handleInStockToggle = () => {
    setFilters(prev => ({
      ...prev,
      inStockOnly: !prev.inStockOnly
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`sidebar-mobile-drawer sidebar-panel ${isMobileOpen ? 'open' : ''}`}>
        
        {/* Mobile Header */}
        <div className="mobile-only-header">
          <h2>
            <Filter size={20} />
            Filtrele
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="sidebar-scrollable-content custom-scrollbar">
          
          {/* Kategoriler */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Kategoriler</h3>
            <div style={{ maxHeight: '12rem', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
              {categoryCounts.map(({ name, count }) => {
                const isSelected = (filters.categories || []).includes(name);
                return (
                  <label key={name} className="custom-checkbox-container" onClick={(e) => { e.preventDefault(); handleCategoryToggle(name); }}>
                    <div className="custom-checkbox-left">
                      <div className={`custom-checkbox-box ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <svg viewBox="0 0 14 14" fill="none"><path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"></path></svg>}
                      </div>
                      <span className="custom-checkbox-label">{name}</span>
                    </div>
                    <span className="custom-checkbox-count">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          <hr className="sidebar-divider" />

          {/* Markalar */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Markalar</h3>
            <div style={{ maxHeight: '12rem', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
              {brandCounts.map(({ name, count }) => {
                const isSelected = (filters.brands || []).includes(name);
                return (
                  <label key={name} className="custom-checkbox-container" onClick={(e) => { e.preventDefault(); handleBrandToggle(name); }}>
                    <div className="custom-checkbox-left">
                      <div className={`custom-checkbox-box ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <svg viewBox="0 0 14 14" fill="none"><path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"></path></svg>}
                      </div>
                      <span className="custom-checkbox-label">{name}</span>
                    </div>
                    <span className="custom-checkbox-count">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          <hr className="sidebar-divider" />

          {/* Stok Durumu */}
          <div className="toggle-switch-container">
            <span className="toggle-switch-label">Sadece Stoktakileri Göster</span>
            <button 
              type="button"
              className={`toggle-switch ${filters.inStockOnly ? 'on' : 'off'}`}
              role="switch"
              aria-checked={filters.inStockOnly}
              onClick={handleInStockToggle}
            >
              <span className="toggle-switch-knob" />
            </button>
          </div>
          
        </div>

        {/* Action Buttons */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }} className="desktop-no-border">
          <div className="sidebar-actions" style={{ marginTop: 0 }}>
            <button 
              onClick={() => {
                if (onClose) onClose();
              }}
              className="btn-show-results"
            >
              Sonuçları Göster
            </button>
            <button 
              onClick={onClear}
              className="btn-clear-filters"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};

export default FilterSidebar;
