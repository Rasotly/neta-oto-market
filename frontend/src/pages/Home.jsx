import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import FilterBar from '../components/FilterBar';
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
    category: '',
    brand: '',
    model: '',
    year: ''
  });

  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset pagination when filters or favorites toggle changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, showOnlyFavorites]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'brand') {
        updated.model = ''; // Reset model when brand changes
        updated.year = '';
      }
      if (name === 'model') {
        updated.year = '';
      }
      return updated;
    });
  };

  const handleClearFilters = () => {
    setFilters({ category: '', brand: '', model: '', year: '' });
    setShowOnlyFavorites(false);
  };

  const uniqueCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category).filter(Boolean))].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = !filters.category || p.category === filters.category;
      const matchBrand = !filters.brand || p.brand === filters.brand;
      const matchModel = !filters.model || p.model === filters.model;
      const matchYear = !filters.year || filters.year === 'Tüm Yıllar' || p.year === filters.year;
      const matchFavorites = !showOnlyFavorites || favoriteIds.includes(p.id);
      return matchCategory && matchBrand && matchModel && matchYear && matchFavorites;
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
          setFilters({ category: '', brand: '', model: '', year: '' });
          navigate('/');
        }}
      />
      
      {!showOnlyFavorites && <HeroSlider />}
    
      <FilterBar 
        categories={uniqueCategories}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={() => setIsCartDrawerOpen(false)} 
      />

      <main className="main-container">
        <h1 className="page-title">
          {showOnlyFavorites ? 'Favorilerim' : 'Ürün Kataloğu'}
        </h1>

        {loading && <p className="text-center">Yükleniyor...</p>}
        {error && <p className="text-center text-error">{error}</p>}

        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="empty-state-container">
                <PackageOpen size={64} className="empty-state-icon" />
                <h3 className="empty-state-text">Bu kriterlere uygun aksesuar bulunamadı.</h3>
                <button className="btn btn-secondary mt-4" onClick={handleClearFilters} style={{ marginTop: '1rem' }}>
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <>
                <div className="catalog-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <span className="results-count" style={{ color: '#64748b', fontWeight: '500' }}>
                    {sortedProducts.length} ürün bulundu
                  </span>
                  <SortDropdown 
                    value={sortOption} 
                    onChange={(val) => setSortOption(val)}
                  />
                </div>
                
                <div className="product-grid">
                  {paginatedProducts.map((item) => (
                    <ProductCard 
                      key={item.id} 
                      product={item} 
                      onClick={(prod) => navigate('/product/' + prod.id)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
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
      
      <Footer />
    </div>
  );
}

export default Home;