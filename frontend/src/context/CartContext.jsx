import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('neta_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error("Cart loading error", e);
        return [];
      }
    }
    return [];
  });

  const [discountCodes, setDiscountCodes] = useState(() => {
    const savedCodes = localStorage.getItem('neta_discounts');
    if (savedCodes) {
      try {
        return JSON.parse(savedCodes);
      } catch (e) {
        console.error("Discounts loading error", e);
      }
    }
    return [
      { id: '1', code: 'NETA10', discountType: 'percentage', discountValue: 10, isActive: true },
      { id: '2', code: 'YAZ500', discountType: 'fixed', discountValue: 500, isActive: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('neta_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('neta_discounts', JSON.stringify(discountCodes));
  }, [discountCodes]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Discount Codes Functions
  const addDiscountCode = (codeObj) => {
    setDiscountCodes(prev => [...prev, { ...codeObj, id: Date.now().toString() }]);
  };

  const removeDiscountCode = (id) => {
    setDiscountCodes(prev => prev.filter(code => code.id !== id));
  };

  const updateDiscountCode = (id, updatedObj) => {
    setDiscountCodes(prev => prev.map(code => 
      code.id === id ? { ...code, ...updatedObj } : code
    ));
  };

  const toggleDiscountCodeStatus = (id) => {
    setDiscountCodes(prev => prev.map(code => 
      code.id === id ? { ...code, isActive: !code.isActive } : code
    ));
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  }, [cartItems]);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        discountCodes,
        addDiscountCode,
        updateDiscountCode,
        removeDiscountCode,
        toggleDiscountCodeStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
