import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import FilterBar from './components/FilterBar';
import { CartProvider } from './context/CartContext';
import { PackageOpen } from 'lucide-react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    model: ''
  });

  useEffect(() => {
    axios.get('https://localhost:7141/api/products')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Hata:', err);
        setError('Ürünler yüklenemedi.');
        setLoading(false);
      });
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productToDelete) => {
    const confirmed = window.confirm("Bu ürünü silmek istediğinize emin misiniz?");
    if (!confirmed) return;

    try {
      await axios.delete(`https://localhost:7141/api/products/${productToDelete.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    } catch (err) {
      console.error('Silme işlemi başarısız:', err);
      alert('Ürün silinirken bir hata oluştu.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ category: '', brand: '', model: '' });
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
      return matchCategory && matchBrand && matchModel;
    });
  }, [products, filters]);

  return (
    <CartProvider>
      <div className="app-wrapper">
        <Navbar 
          onAddProductClick={() => setIsAddModalOpen(true)} 
          onCartClick={() => setIsCartDrawerOpen(true)}
        />
        
        <FilterBar 
          categories={uniqueCategories}
          brands={uniqueBrands}
          models={uniqueModels}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <AddProductModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onProductAdded={handleProductAdded} 
        />

        <EditProductModal 
          isOpen={!!editingProduct}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onProductUpdated={handleProductUpdated}
        />

        <CartDrawer 
          isOpen={isCartDrawerOpen} 
          onClose={() => setIsCartDrawerOpen(false)} 
        />

        <ProductDetailModal 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />

        <main className="main-container">
          <h1 className="page-title">Ürün Kataloğu</h1>

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
                      onEdit={(prod) => setEditingProduct(prod)}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </CartProvider>
  );
}

export default App;