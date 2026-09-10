import React from 'react';
import { FilterX } from 'lucide-react';
import { getSortedBrands, getModelsForBrand } from '../utils/carData';

const FilterBar = ({ categories, filters, onFilterChange, onClearFilters }) => {
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
            {getSortedBrands().map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select 
            className="filter-dropdown"
            name="model"
            value={filters.model}
            onChange={onFilterChange}
            disabled={!filters.brand}
          >
            {!filters.brand ? (
              <option value="">Önce Marka Seçiniz</option>
            ) : (
              <>
                <option value="">Model Seç</option>
                {getModelsForBrand(filters.brand).map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </>
            )}
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
