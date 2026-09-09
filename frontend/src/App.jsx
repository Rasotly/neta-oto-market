import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Neta Oto Market - Ürün Kataloğu</h1>

      {loading && <p style={{ textAlign: 'center' }}>Yükleniyor...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {products.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #333',
                borderRadius: '10px',
                padding: '1rem',
                backgroundColor: '#1e1e1e',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '1rem' }} />
                ) : (
                  <div style={{ width: '100%', height: '150px', backgroundColor: '#2a2a2a', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#777' }}>
                    Görsel Yok
                  </div>
                )}
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>{item.description || 'Açıklama girilmemiş.'}</p>
              </div>

              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#4caf50' }}>
                  {item.price ? `${item.price} ₺` : 'Fiyat Belirtilmemiş'}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#ccc' }}><strong>Kategori:</strong> {item.category}</p>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  <strong>Durum:</strong>{' '}
                  <span style={{ color: item.inStock ? '#4caf50' : '#f44336' }}>
                    {item.inStock ? 'Stokta Var' : 'Tükendi'}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;