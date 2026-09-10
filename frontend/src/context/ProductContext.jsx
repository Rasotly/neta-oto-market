import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://localhost:7141/api/products');
      setProducts(res.data);
      setError(null);
    } catch (err) {
      console.error('Ürünler yüklenemedi:', err);
      setError('Ürünler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProductToState = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProductInState = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const removeProductFromState = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      fetchProducts,
      addProductToState,
      updateProductInState,
      removeProductFromState
    }}>
      {children}
    </ProductContext.Provider>
  );
};
