/**
 * Get cart items from localStorage
 */
export const getCartItems = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error retrieving cart from localStorage:', error);
    return [];
  }
};

// Alias for backward compatibility
export const getLocalCart = getCartItems;

/**
 * Add product to cart
 * @param {Object} product - The product to add
 * @param {Number} quantity - Quantity to add (default: 1)
 * @returns {Array} Updated cart items
 */
export const addToCart = (product, quantity = 1) => {
  try {
    const cart = getCartItems();
    
    // Find if product already exists in cart
    const existingProductIndex = cart.findIndex(
      item => {
        // Handle both direct ID comparison and object comparison
        if (typeof item.productId === 'object' && item.productId !== null) {
          return item.productId._id === product._id;
        } else {
          return item.productId === product._id;
        }
      }
    );
    
    if (existingProductIndex !== -1) {
      // Update quantity if product exists
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.push({
        productId: product,
        quantity
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('storage'));
    
    return cart;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return getCartItems();
  }
};

// Alias for backward compatibility
export const addToLocalCart = addToCart;

/**
 * Update product quantity in cart
 * @param {String} productId - The product ID to update
 * @param {Number} quantity - New quantity
 * @returns {Array} Updated cart items
 */
export const updateCartQuantity = (productId, quantity) => {
  try {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    const cart = getCartItems();
    
    const updatedCart = cart.map(item => {
      const itemProductId = (typeof item.productId === 'object' && item.productId !== null) 
        ? item.productId._id 
        : item.productId;
        
      if (itemProductId === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('storage'));
    
    return updatedCart;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return getCartItems();
  }
};

// Alias for backward compatibility
export const updateLocalCartQuantity = updateCartQuantity;

/**
 * Remove product from cart
 * @param {String} productId - The product ID to remove
 * @returns {Array} Updated cart items
 */
export const removeFromCart = (productId) => {
  try {
    const cart = getCartItems();
    
    const updatedCart = cart.filter(item => {
      const itemProductId = (typeof item.productId === 'object' && item.productId !== null) 
        ? item.productId._id 
        : item.productId;
      return itemProductId !== productId;
    });
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('storage'));
    
    return updatedCart;
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return getCartItems();
  }
};

// Alias for backward compatibility
export const removeFromLocalCart = removeFromCart;

/**
 * Clear all items from cart
 * @returns {Array} Empty array
 */
export const clearCart = () => {
  try {
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('storage'));
    
    return [];
  } catch (error) {
    console.error('Error clearing cart:', error);
    return getCartItems();
  }
};

/**
 * Calculate cart total
 * @returns {Number} Total price
 */
export const getCartTotal = () => {
  try {
    const cart = getCartItems();
    
    return cart.reduce((total, item) => {
      const productId = item.productId;
      const price = (typeof productId === 'object' && productId !== null)
        ? (productId.discountPrice || productId.price)
        : 0;
      return total + (price * item.quantity);
    }, 0);
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return 0;
  }
};

/**
 * Get cart item count
 * @returns {Number} Number of items in cart
 */
export const getCartCount = () => {
  try {
    return getCartItems().length;
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
};

/**
 * Calculate detailed cart information including subtotal, shipping, etc.
 * @returns {Object} Cart calculation details
 */
export const calculateCart = () => {
  try {
    const cart = getCartItems();
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => {
      const product = item.productId;
      const price = (typeof product === 'object' && product !== null)
        ? (product.discountPrice || product.price)
        : 0;
      return total + (price * item.quantity);
    }, 0);
    
    // Calculate shipping (free over ₹500)
    const shippingFee = subtotal > 500 ? 0 : 40;
    
    // Calculate total items
    const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
    
    return {
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
      totalItems,
      items: cart
    };
  } catch (error) {
    console.error('Error calculating cart details:', error);
    return {
      subtotal: 0,
      shippingFee: 0,
      total: 0,
      totalItems: 0,
      items: []
    };
  }
}; 