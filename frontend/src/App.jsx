import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import AddProductModal from './components/AddProductModal';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    // Listeyi yenilemeden yeni ürünü başa ekle
    setProducts((prev) => [newProduct, ...prev]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="app-wrapper">
      <Navbar onAddProductClick={() => setIsAddModalOpen(true)} />

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onProductAdded={handleProductAdded} 
      />

      <main className="main-container">
        <h1 className="page-title">Ürün Kataloğu</h1>

        {loading && <p className="text-center">Yükleniyor...</p>}
        {error && <p className="text-center text-error">{error}</p>}

        {!loading && !error && (
          <div className="product-grid">
            {products.map((item) => (
              <div key={item.id} className="product-card">
                <div>
                  {item.imageUrl ? (
                    <div className="product-image-wrapper">
                      <img src={item.imageUrl} alt={item.name} className="product-image" />
                    </div>
                  ) : (
                    <div className="product-image-wrapper">
                      <span className="product-image-placeholder">Görsel Yok</span>
                    </div>
                  )}
                  <h3 className="product-title">{item.name}</h3>
                  <p className="product-desc">{item.description || 'Açıklama girilmemiş.'}</p>
                </div>

                <div>
                  <p className="product-price">
                    {item.price ? `${item.price} ₺` : 'Fiyat Belirtilmemiş'}
                  </p>
                  <p className="product-meta"><strong>Kategori:</strong> {item.category}</p>
                  <div className="product-meta">
                    <strong>Durum:</strong>{' '}
                    <span className={`status-badge ${item.inStock ? 'status-in-stock' : 'status-out-stock'}`}>
                      {item.inStock ? 'Stokta Var' : 'Tükendi'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;