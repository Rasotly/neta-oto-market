import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Backend'den ürünleri çeken fonksiyon
  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      const url = query 
        ? `https://localhost:7141/api/products?search=${encodeURIComponent(query)}`
        : 'https://localhost:7141/api/products';
      
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Veri çekilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Neta Oto Market</h1>
        <p>Araç İçi Multimedya, Koruma ve Aksesuar Kataloğu</p>
      </header>

      <form onSubmit={handleSearch} className="search-box">
        <input
          type="text"
          placeholder="Ürün veya kategori ara (örn: Multimedya, Basamak)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Ara</button>
      </form>

      {loading ? (
        <p className="status-text">Yükleniyor...</p>
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((item) => (
              <div key={item.id} className="card">
                <span className="badge">{item.category}</span>
                <h3>{item.name}</h3>
                <p className={item.inStock ? 'in-stock' : 'out-of-stock'}>
                  {item.inStock ? '● Stokta Var' : '○ Stokta Yok'}
                </p>
              </div>
            ))
          ) : (
            <p className="status-text">Eşleşen ürün bulunamadı.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;