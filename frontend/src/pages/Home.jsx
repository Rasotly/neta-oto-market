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
import { PackageOpen } from 'lucide-react';
import SortDropdown from '../components/SortDropdown';
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
      return matchCategory && matchBrand && matchFavorites;
    });
  }, [products, filters, showOnlyFavorites, favoriteIds]);

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === 'price-desc') {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === 'newest') {
      // Assuming higher ID means newer, or string comparison if uuid
      // If id is string and we can't sort nicely, we'll just sort by string reverse
      sorted.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    }
    return sorted;
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage]);

  return (
    <div className="app-wrapper">
      <Navbar 
        onCartClick={() => setIsCartDrawerOpen(true)}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
        onLogoClick={() => {
          setShowOnlyFavorites(false);
          setFilters({ categories: [], brands: [] });
          navigate('/');
        }}
      />
      
      {!showOnlyFavorites && <HeroSlider />}
    
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

          <main className="catalog-main" style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minWidth: 0
          }}>
            
            {/* ÜST BİLGİ ALANI: Başlık, Ürün Sayısı ve Sıralama */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 className="page-title" style={{ margin: 0, color: '#111827' }}>
                  {showOnlyFavorites ? 'Favorilerim' : 'Ürün Kataloğu'}
                </h1>
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
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Önceki
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button 
                          key={page}
                          className={`page-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button 
                        className="page-btn prev-next" 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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