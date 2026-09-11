import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import FilterBar from '../components/FilterBar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import HeroSlider from '../components/HeroSlider';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../context/ProductContext';
import { PackageOpen } from 'lucide-react';
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
              <div className="product-grid">
                {filteredProducts.map((item) => (
                  <ProductCard 
                    key={item.id} 
                    product={item} 
                    onClick={(prod) => navigate('/product/' + prod.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Home;