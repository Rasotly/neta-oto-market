import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const saved = localStorage.getItem('neta_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('neta_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (productId) => {
    const isAlreadyFav = favoriteIds.includes(productId);
    
    if (isAlreadyFav) {
      toast.success("Favorilerden çıkarıldı", {
        icon: '💔',
      });
      setFavoriteIds((prev) => prev.filter(id => id !== productId));
    } else {
      toast.success("Favorilere eklendi!", {
        icon: '❤️',
      });
      setFavoriteIds((prev) => [...prev, productId]);
    }
  };

  const isFavorite = (productId) => {
    return favoriteIds.includes(productId);
  };

  const favoritesCount = useMemo(() => favoriteIds.length, [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, favoritesCount }}>
      {children}
    </FavoritesContext.Provider>
  );
};
