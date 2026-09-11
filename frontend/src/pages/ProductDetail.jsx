import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { ChevronLeft, Plus, Minus, ShieldCheck, PackageOpen, RefreshCw, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatters';
import '../App.css';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!loading && products.length > 0) {
      const found = products.find(p => String(p.id) === String(id));
      if (found) {
        setProduct(found);
        setActiveImage(found.imageUrl || '');
        document.title = `${found.name} | Neta Oto Market`;
      } else {
        toast.error("Ürün bulunamadı!");
        navigate('/');
      }
    }
  }, [id, products, loading, navigate]);

  if (loading || !product) {
    return (
      <div className="app-wrapper">
        <Navbar 
          onCartClick={() => navigate('/?cart=open')}
          onToggleFavorites={() => navigate('/?favorites=true')}
        />
        <div className="pd-loading" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem' }}>Ürün yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const isFavorite = favoriteIds.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} adet sepete eklendi`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
  };

  // Mock data for gallery and compatibility
  const mockGallery = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl
  ].filter(Boolean);

  const mockBadges = [
    "Uyumlu Çoğu Model", 
    product.brand || "Üniversal"
  ];

  return (
    <div className="app-wrapper">
      <Navbar 
        onCartClick={() => navigate('/?cart=open')}
        onToggleFavorites={() => navigate('/?favorites=true')}
      />
      
      <main className="pd-main">
        <div className="pd-container">
          
          <button className="pd-back-btn" onClick={() => navigate('/')}>
            <ChevronLeft size={20} />
            Kataloğa Dön
          </button>

          {/* Top Section */}
          <div className="pd-top">
            
            {/* Left: Gallery */}
            <div className="pd-gallery">
              <div className="pd-main-image-wrapper">
                {activeImage ? (
                  <img src={activeImage} alt={product.name} className="pd-main-image" />
                ) : (
                  <div className="pd-no-image"><PackageOpen size={48}/></div>
                )}
              </div>
              {mockGallery.length > 0 && (
                <div className="pd-thumbnails">
                  {mockGallery.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`pd-thumbnail ${activeImage === img ? 'active' : ''}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img src={img} alt={`thumb-${idx}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Actions */}
            <div className="pd-info">
              <div className="pd-brand">{product.category || 'Kategori Yok'} {product.brand ? `• ${product.brand}` : ''}</div>
              <h1 className="pd-title">{product.name}</h1>
              <div className="pd-price">{formatPrice(product.price)}</div>

              <div className="pd-badges-section">
                <span className="pd-badges-title">Uyumlu Araçlar:</span>
                <div className="pd-badges">
                  {mockBadges.map((badge, idx) => (
                    <span key={idx} className="pd-badge">{badge}</span>
                  ))}
                </div>
              </div>

              <div className="pd-actions-wrapper">
                <div className="pd-quantity">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="pd-qty-btn"><Minus size={18} /></button>
                  <span className="pd-qty-value">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="pd-qty-btn"><Plus size={18} /></button>
                </div>

                <div className="pd-main-actions">
                  <button className="pd-add-to-cart" onClick={handleAddToCart}>
                    <ShoppingCart size={20} style={{marginRight: '8px'}} />
                    Sepete Ekle
                  </button>
                  <button 
                    className={`pd-favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={handleToggleFavorite}
                  >
                    {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                  </button>
                </div>
              </div>

              <div className="pd-trust-badges">
                <div className="pd-trust-badge">
                  <ShieldCheck size={20} className="pd-trust-icon" />
                  <span>2 Yıl Garanti</span>
                </div>
                <div className="pd-trust-badge">
                  <RefreshCw size={20} className="pd-trust-icon" />
                  <span>14 Gün İade</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Tabs */}
          <div className="pd-tabs-section">
            <div className="pd-tabs-header">
              <button 
                className={`pd-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Ürün Açıklaması
              </button>
              <button 
                className={`pd-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Teknik Özellikler
              </button>
              <button 
                className={`pd-tab-btn ${activeTab === 'returns' ? 'active' : ''}`}
                onClick={() => setActiveTab('returns')}
              >
                İade Koşulları
              </button>
            </div>

            <div className="pd-tabs-content">
              {activeTab === 'description' && (
                <div className="pd-tab-pane">
                  <p>{product.description || 'Bu ürün için henüz detaylı bir açıklama girilmemiştir.'}</p>
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="pd-tab-pane">
                  <ul className="pd-specs-list">
                    <li><strong>Marka:</strong> {product.brand || 'Belirtilmemiş'}</li>
                    <li><strong>Model:</strong> {product.model || 'Belirtilmemiş'}</li>
                    <li><strong>Kategori:</strong> {product.category || 'Belirtilmemiş'}</li>
                    <li><strong>Stok Durumu:</strong> {product.stock > 0 ? `${product.stock} adet stokta` : 'Tükendi'}</li>
                  </ul>
                </div>
              )}
              {activeTab === 'returns' && (
                <div className="pd-tab-pane">
                  <p>Satın aldığınız ürünü, teslimat tarihinden itibaren 14 gün içerisinde orijinal ambalajı bozulmamış ve kullanılmamış olması şartıyla iade edebilirsiniz. İade işlemleri için Müşteri Hizmetleri ile iletişime geçiniz.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
