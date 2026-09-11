import React from 'react';
import { List, Car, CarFront, Calendar } from 'lucide-react';
import { getSortedBrands, getModelsForBrand } from '../utils/carData';

const FilterBar = ({ categories, filters, onFilterChange, onClearFilters }) => {
  // Generate years from current year down to 2000
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  return (
    <div className="filter-bar-container">
      <div className="filter-bar-card">
        <div className="filter-form-strip">
          {/* Kategori */}
          <div className="filter-field">
            <List className="filter-icon" size={20} />
            <select 
              className="filter-select"
              name="category"
              value={filters.category || ''}
              onChange={onFilterChange}
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-divider"></div>

          {/* Marka */}
          <div className="filter-field">
            <Car className="filter-icon" size={20} />
            <select 
              className="filter-select"
              name="brand"
              value={filters.brand || ''}
              onChange={onFilterChange}
            >
              <option value="">Marka Seç</option>
              {getSortedBrands().map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="filter-divider"></div>

          {/* Model */}
          <div className="filter-field">
            <CarFront className="filter-icon" size={20} />
            <select 
              className="filter-select"
              name="model"
              value={filters.model || ''}
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

          <div className="filter-divider"></div>

          {/* Yıl */}
          <div className="filter-field">
            <Calendar className="filter-icon" size={20} />
            <select 
              className="filter-select"
              name="year"
              value={filters.year || ''}
              onChange={onFilterChange}
              disabled={!filters.brand || !filters.model}
            >
              {(!filters.brand || !filters.model) ? (
                <option value="">Önce Model Seçiniz</option>
              ) : (
                <>
                  <option value="Tüm Yıllar">Tüm Yıllar</option>
                  {years.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* CTA Button */}
          <button className="filter-submit-btn">
            Parçaları Bul
          </button>
        </div>
        
        {/* Clear Filters Below */}
        <div className="filter-actions-bottom">
          <button className="clear-filters-link" onClick={onClearFilters}>
            Filtreleri Temizle
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
