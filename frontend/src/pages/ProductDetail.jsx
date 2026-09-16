import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { ChevronLeft, Plus, Minus, ShieldCheck, PackageOpen, RefreshCw, ShoppingCart, Lock, Headset, Truck, Zap, ChevronDown, Settings2 } from 'lucide-react';
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
        setActiveImage(
          (found.imageUrls && found.imageUrls.length > 0) 
            ? found.imageUrls[0] 
            : (found.imageUrl || '')
        );
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

  const handleWhatsappAsk = () => {
    const phoneNumber = "905060617553";
    const message = `Merhaba, ${product.name} ürününün aracıma uyumlu olup olmadığını öğrenmek istiyorum.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  // Real data for gallery
  const productGallery = (product.imageUrls && product.imageUrls.length > 0)
    ? product.imageUrls
    : [product.imageUrl].filter(Boolean);

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
            
            {/* Left: Gallery & WhatsApp Banner */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="pd-gallery">
                <div className="pd-main-image-wrapper">
                  {activeImage ? (
                    <img src={activeImage} alt={product.name} className="pd-main-image" />
                  ) : (
                    <div className="pd-no-image"><PackageOpen size={48}/></div>
                  )}
                </div>
                {productGallery.length > 0 && (
                  <div className="pd-thumbnails">
                    {productGallery.map((img, idx) => (
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

              {/* WhatsApp Compatibility Banner */}
              <div 
                onClick={handleWhatsappAsk}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  backgroundColor: '#f4f4f5', 
                  borderRadius: '12px', 
                  padding: '1rem 1.5rem', 
                  cursor: 'pointer',
                  border: '1px solid #e4e4e7',
                  transition: 'all 0.2s ease',
                  marginTop: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '800', color: '#09090b', fontSize: '1.25rem' }}>Aracınıza Uyumlu mu?</span>
                  <span style={{ fontWeight: '600', color: '#3f3f46', fontSize: '1rem' }}>Neta Oto Market Uzmanına Sor &rarr;</span>
                </div>
                <div style={{ backgroundColor: '#16a34a', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(22, 163, 74, 0.4)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="22" height="22" fill="#ffffff">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Info & Actions */}
            <div className="pd-info-cards">
              
              {/* Card 1: Basic Info */}
              <div className="pd-card">
              <div className="pd-brand">{product.category || 'Kategori Yok'} {product.brand ? `• ${product.brand}` : ''}</div>
              <h1 className="pd-title">{product.name}</h1>
              
              <div className="pd-price-container" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', margin: '1rem 0 2rem 0' }}>
                {product.discountedPrice && product.discountedPrice < product.price ? (
                  <>
                    <div className="pd-price" style={{ margin: 0, fontSize: '2.5rem', color: '#111827' }}>{formatPrice(product.discountedPrice)}</div>
                    <div style={{ fontSize: '1.25rem', color: '#9ca3af', textDecoration: 'line-through', marginBottom: '0.5rem' }}>{formatPrice(product.price)}</div>
                  </>
                ) : (
                  <div className="pd-price" style={{ margin: 0, fontSize: '2.5rem', color: '#111827' }}>{formatPrice(product.price)}</div>
                )}
              </div>

              </div>

              {/* Card 2: Compatibility */}
              <div className="pd-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
                  <div style={{ backgroundColor: '#f97316', color: 'white', padding: '0.4rem', borderRadius: '8px' }}>
                    <Settings2 size={20} />
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: '#111827' }}>Uyumluluk Bilgisi</div>
                </div>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4b5563' }}>
                  {mockBadges.join(' • ')}
                </div>
              </div>

              {/* Card 3: Actions */}
              <div className="pd-card">
                <div className="pd-actions-wrapper">
                  <div className="pd-quantity">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="pd-qty-btn"><Minus size={18} /></button>
                    <span className="pd-qty-value">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="pd-qty-btn"><Plus size={18} /></button>
                  </div>

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

              {/* Card 4: Trust Badges */}
              <div className="pd-card pd-trust-badges">
                <div className="pd-trust-badge">
                  <ShieldCheck size={16} className="pd-trust-icon" />
                  <span>%100 Orijinal Ürün</span>
                </div>
                <div className="pd-trust-badge">
                  <Lock size={16} className="pd-trust-icon" />
                  <span>256-Bit Güvenli Ödeme</span>
                </div>
                <div className="pd-trust-badge">
                  <Headset size={16} className="pd-trust-icon" />
                  <span>Uzman Teknik Destek</span>
                </div>
                <div className="pd-trust-badge">
                  <RefreshCw size={16} className="pd-trust-icon" />
                  <span>Kolay İade & Değişim</span>
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
                    <li><strong>Stok Durumu:</strong> {product.stockCount > 0 ? `${product.stockCount} adet stokta` : 'Tükendi'}</li>
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
