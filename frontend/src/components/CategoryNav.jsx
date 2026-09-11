import React, { useState } from 'react';
import { ChevronDown, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSortedBrands } from '../utils/carData';
const categories = [
  "Multimedya",
  "Kol Dayama",
  "Yan Basamak",
  "Oto Paspas",
  "Bagaj Havuzu",
  "Kaput Rüzgarlığı",
  "Tavan Ürünleri"
];

const vehicleBrands = getSortedBrands();

const CategoryNav = () => {
  const navigate = useNavigate();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  return (
    <div className="category-nav-wrapper">
      <div className="category-nav-container">
        <ul className="category-list">

          {/* Araçlar Mega Menu Item */}
          <li
            className="category-item has-mega-menu"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <button className="category-link" onClick={() => navigate('/')}>
              Araçlar <ChevronDown size={14} className="ml-1" />
            </button>

            {/* Mega Menu Dropdown */}
            {isMegaMenuOpen && (
              <div className="mega-menu-panel">
                <div className="mega-menu-content brands-grid">
                  {vehicleBrands.map((brand, idx) => (
                    <button
                      key={idx}
                      className="mega-menu-brand-link"
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        navigate('/');
                      }}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </li>

          {/* Regular Categories */}
          {categories.map((cat, idx) => (
            <li key={idx} className="category-item">
              <button className="category-link" onClick={() => navigate('/')}>
                {cat}
              </button>
            </li>
          ))}

        </ul>

        {/* Fırsat Ürünleri */}
        <div className="category-deals">
          <button className="category-link deals-link" onClick={() => navigate('/')}>
            <Flame size={16} className="mr-1" style={{ marginRight: '4px' }} /> Fırsat Ürünleri
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
