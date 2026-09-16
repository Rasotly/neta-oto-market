import React from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product, onClick }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = isFavorite(product.id);

  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) 
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success('Ürün sepete eklendi!', {
      style: {
        background: '#fff',
        color: '#4b5563',
        border: '1px solid #e5e7eb',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    });
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div 
      className="bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col h-full relative group" 
      onClick={() => onClick(product)}
    >
      {/* Görsel Alanı ve Favori İkonu */}
      <div className="aspect-square w-full bg-gray-50 relative overflow-hidden rounded-t-2xl p-4">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Görsel Yok
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm z-10">
            %{discountPercentage}
          </div>
        )}
        
        <button 
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors z-10 ${
            isFav ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
          }`}
          onClick={handleFavoriteClick}
          title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Kategori Etiketi */}
        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full mb-3 self-start">
          {product.category || 'Kategorisiz'}
        </span>
        
        {/* Başlık Sınırlandırması */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 h-10 mb-4" title={product.name}>
          {product.name}
        </h3>
        
        {/* Fiyat ve Stok Düzeni */}
        <div className="flex items-end justify-between mb-4 mt-auto">
          {product.price ? (
            <div className="flex items-baseline gap-2">
              {hasDiscount ? (
                <>
                  <p className="text-xl font-bold text-red-500">
                    {formatPrice(product.discountedPrice).replace(' ₺', '')} <span className="text-sm font-normal">₺</span>
                  </p>
                  <p className="text-sm font-medium text-gray-500 line-through">
                    {formatPrice(product.price).replace(' ₺', '')} <span className="text-xs font-normal">₺</span>
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-gray-900">
                  {formatPrice(product.price).replace(' ₺', '')} <span className="text-sm font-normal">₺</span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-base font-medium text-gray-500">Fiyat Yok</p>
          )}

          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-xs font-medium text-gray-600">
              {product.inStock ? 'Stokta' : 'Tükendi'}
            </span>
          </div>
        </div>
        
        {/* Aksiyon Butonu */}
        <button 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-auto" 
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
