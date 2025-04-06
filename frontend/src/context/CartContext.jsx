import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if (!product?._id || !product?.name || !product?.price) {
      console.error('Invalid product data:', product);
      return;
    }

    setCart(currentCart => {
      const existingItem = currentCart.find(item => item._id === product._id);
      
      if (existingItem) {
        return currentCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentCart, {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        seller: product.seller,
        unit: product.unit,
        quantity: quantity
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(currentCart =>
      currentCart.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = Number(item.price);
      const itemQuantity = Number(item.quantity);
      
      if (isNaN(itemPrice) || isNaN(itemQuantity)) {
        console.error('Invalid price or quantity for item:', item);
        return total;
      }
      
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + Number(item.quantity), 0);
  };

  const isInCart = (productId) => {
    return cart.some(item => item._id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = cart.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isInCart,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
}; 