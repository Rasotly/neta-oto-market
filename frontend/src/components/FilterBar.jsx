import React from 'react';
import { FilterX } from 'lucide-react';

const FilterBar = ({ categories, brands, models, filters, onFilterChange, onClearFilters }) => {
  return (
    <div className="filter-bar-container">
      <div className="filter-bar-content">
        <div className="filter-group-left">
          <select 
            className="filter-dropdown"
            name="category"
            value={filters.category}
            onChange={onFilterChange}
          >
            <option value="">Kategori Seç</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            className="filter-dropdown"
            name="brand"
            value={filters.brand}
            onChange={onFilterChange}
          >
            <option value="">Marka Seç</option>
            {brands.map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>

          <select 
            className="filter-dropdown"
            name="model"
            value={filters.model}
            onChange={onFilterChange}
          >
            <option value="">Model Seç</option>
            {models.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-group-right">
          <button className="clear-filters-btn" onClick={onClearFilters}>
            <FilterX size={18} />
            <span>Filtreleri Temizle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
