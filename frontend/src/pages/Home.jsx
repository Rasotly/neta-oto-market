import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';

import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../context/ProductContext';
import { PackageOpen, X } from 'lucide-react';
import SortDropdown from '../components/SortDropdown';
import VehicleFilterBar from '../components/VehicleFilterBar';
import '../App.css';

function Home() {
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();
  
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get('cart') === 'open') {
      setIsCartDrawerOpen(true);
      searchParams.delete('cart');
      setSearchParams(searchParams, { replace: true });
    }
    if (searchParams.get('favorites') === 'true') {
      setShowOnlyFavorites(true);
      searchParams.delete('favorites');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { favoriteIds } = useFavorites();
  
  const [filters, setFilters] = useState({
    categories: [],
    brands: []
  });

  const [activeVehicleFilter, setActiveVehicleFilter] = useState(null);

  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset pagination when filters or favorites toggle changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, showOnlyFavorites]);

  const handleCategoryChange = (cat) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleBrandChange = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleClearFilters = () => {
    setFilters({ categories: [], brands: [] });
    setShowOnlyFavorites(false);
  };

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const brandCounts = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(p.category);
      const matchBrand = filters.brands.length === 0 || filters.brands.includes(p.brand);
      const matchFavorites = !showOnlyFavorites || favoriteIds.includes(p.id);
      
      let matchVehicle = true;
      if (activeVehicleFilter) {
        if (p.category === 'Universal') {
          matchVehicle = true;
        } else {
          const pName = (p.name || '').toLowerCase();
          const pDesc = (p.description || '').toLowerCase();
          const searchText = pName + ' ' + pDesc;
          
          const modelStr = activeVehicleFilter.model.toLowerCase();
          const chassisStr = activeVehicleFilter.year.split(' ')[0].toLowerCase(); // e.g. "FE1" from "FE1 2022+"
          
          matchVehicle = searchText.includes(chassisStr) || searchText.includes(modelStr);
        }
      }

      return matchCategory && matchBrand && matchFavorites && matchVehicle;
    });
  }, [products, filters, showOnlyFavorites, favoriteIds, activeVehicleFilter]);

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    
    const getActualPrice = (product) => product.discountedPrice > 0 ? product.discountedPrice : (product.price || 0);

    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => getActualPrice(a) - getActualPrice(b));
    } else if (sortOption === 'price-desc') {
      sorted.sort((a, b) => getActualPrice(b) - getActualPrice(a));
    } else if (sortOption === 'newest') {
      // Assuming higher ID means newer, or string comparison if uuid
      // If id is string and we can't sort nicely, we'll just sort by string reverse
      sorted.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    } else {
      // Default Sort (Önerilen Sıralama) Sabitlenmesi
      sorted.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // id'ye göre sıralayarak mutasyonu ve listenin sonuna düşmeyi engelle
        return a.id - b.id;
      });
    }
    return sorted;
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const catalogElement = document.querySelector('.catalog-container');
    if (catalogElement) {
      const yOffset = -80;
      const y = catalogElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar 
        onCartClick={() => setIsCartDrawerOpen(true)}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
        onLogoClick={() => {
          setShowOnlyFavorites(false);
          setFilters({ categories: [], brands: [] });
          setActiveVehicleFilter(null);
          navigate('/');
        }}
      />
      
      {!showOnlyFavorites && <HeroSlider />}
      {!showOnlyFavorites && (
        <div className="px-4">
          <VehicleFilterBar onFilterSubmit={setActiveVehicleFilter} />
        </div>
      )}
    
      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={() => setIsCartDrawerOpen(false)} 
      />

      <div className="catalog-container" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%', 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '2rem 1rem'
      }}>
        
        {/* İÇERİK ALANI: Sidebar ve Grid Yanyana */}
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
          
          {!showOnlyFavorites && (
            <aside style={{ width: '260px', flexShrink: 0, marginRight: '2rem', marginTop: '5.5rem' }}>
              <div className="filter-panel" style={{ width: '100%', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Kategoriler</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  {categoryCounts.map(({ name, count }) => (
                    <label key={name} className="filter-checkbox-container">
                      <div className="filter-checkbox-left">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox-input"
                          checked={filters.categories.includes(name)}
                          onChange={() => handleCategoryChange(name)}
                        />
                        <span className="filter-label">{name}</span>
                      </div>
                      <span className="filter-count">{count}</span>
                    </label>
                  ))}
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Markalar</h3>
                <div>
                  {brandCounts.map(({ name, count }) => (
                    <label key={name} className="filter-checkbox-container">
                      <div className="filter-checkbox-left">
                        <input 
                          type="checkbox" 
                          className="filter-checkbox-input"
                          checked={filters.brands.includes(name)}
                          onChange={() => handleBrandChange(name)}
                        />
                        <span className="filter-label">{name}</span>
                      </div>
                      <span className="filter-count">{count}</span>
                    </label>
                  ))}
                </div>

                <button className="btn-filter-submit" onClick={() => window.scrollTo(0, 0)}>Sonuçları Göster</button>
                <button className="btn-filter-clear" onClick={handleClearFilters}>Filtreleri Temizle</button>
              </div>
            </aside>
          )}

          <main className="catalog-main" style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minWidth: 0
          }}>
            
            {/* ÜST BİLGİ ALANI: Başlık, Ürün Sayısı ve Sıralama */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h1 className="page-title" style={{ margin: 0, color: '#111827' }}>
                  {showOnlyFavorites ? 'Favorilerim' : 'Ürün Kataloğu'}
                </h1>
                
                {activeVehicleFilter && (
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-100 shadow-sm">
                    <span>Şu an 🚘 <strong>{activeVehicleFilter.make} {activeVehicleFilter.model} {activeVehicleFilter.year}</strong> için uyumlu ürünleri görüyorsunuz.</span>
                    <button 
                      onClick={() => setActiveVehicleFilter(null)}
                      className="text-blue-500 hover:text-blue-700 bg-white rounded-full p-1 shadow-sm transition-colors"
                      title="Filtreyi Temizle"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {!loading && !error && (
                  <span className="results-count" style={{ color: '#64748b', fontWeight: '500', marginTop: '4px' }}>
                    {sortedProducts.length} ürün bulundu
                  </span>
                )}
              </div>

              {!loading && !error && filteredProducts.length > 0 && (
                <SortDropdown 
                  value={sortOption} 
                  onChange={(val) => setSortOption(val)}
                />
              )}

            </div>
            {loading && <p className="text-center w-full">Yükleniyor...</p>}
            {error && <p className="text-center text-error w-full">{error}</p>}

            {!loading && !error && (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="empty-state-container w-full">
                    <PackageOpen size={64} className="empty-state-icon" />
                    <h3 className="empty-state-text">Bu kriterlere uygun aksesuar bulunamadı.</h3>
                    <button className="btn btn-secondary mt-4" onClick={handleClearFilters} style={{ marginTop: '1rem' }}>
                      Filtreleri Temizle
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Ürün Grid Bileşeni (Ürün Kartları) */}
                    <div className="product-grid w-full" style={{ marginTop: 0 }}>
                      {paginatedProducts.map((item) => (
                        <ProductCard 
                          key={item.id} 
                          product={item} 
                          onClick={(prod) => navigate('/product/' + prod.id)}
                        />
                      ))}
                    </div>

                  {totalPages > 1 && (
                    <div className="pagination-container w-full" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                      <button 
                        className="page-btn prev-next" 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Önceki
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button 
                          key={page}
                          className={`page-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button 
                        className="page-btn prev-next" 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Sonraki
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Home;