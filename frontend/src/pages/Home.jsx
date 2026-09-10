import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import ProductDetailModal from '../components/ProductDetailModal';
import FilterBar from '../components/FilterBar';
import CheckoutModal from '../components/CheckoutModal';
import LoginModal from '../components/LoginModal';
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
  
  
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { favoriteIds } = useFavorites();
  
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    model: ''
  });


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ category: '', brand: '', model: '' });
    setShowOnlyFavorites(false);
  };

  const uniqueCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category).filter(Boolean))].sort();
  }, [products]);

  const uniqueBrands = useMemo(() => {
    return [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
  }, [products]);

  const uniqueModels = useMemo(() => {
    const baseProducts = filters.brand ? products.filter(p => p.brand === filters.brand) : products;
    return [...new Set(baseProducts.map(p => p.model).filter(Boolean))].sort();
  }, [products, filters.brand]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = !filters.category || p.category === filters.category;
      const matchBrand = !filters.brand || p.brand === filters.brand;
      const matchModel = !filters.model || p.model === filters.model;
      const matchFavorites = !showOnlyFavorites || favoriteIds.includes(p.id);
      return matchCategory && matchBrand && matchModel && matchFavorites;
    });
  }, [products, filters, showOnlyFavorites, favoriteIds]);

  return (
    <div className="app-wrapper">
      <Navbar 
        onCartClick={() => setIsCartDrawerOpen(true)}
        onLoginClick={() => setIsLoginModalOpen(true)}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
      />
      
      {!showOnlyFavorites && <HeroSlider />}
    
      <FilterBar 
        categories={uniqueCategories}
        brands={uniqueBrands}
        models={uniqueModels}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={() => setIsCartDrawerOpen(false)} 
        onCheckout={() => {
          setIsCartDrawerOpen(false);
          setIsCheckoutModalOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <ProductDetailModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
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
                    onClick={(prod) => setSelectedProduct(prod)}
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