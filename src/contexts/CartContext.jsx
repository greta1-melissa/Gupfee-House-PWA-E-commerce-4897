import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { storageService } from '../services/storageService';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const loadCart = async () => {
      try {
        // First try to get cart from service
        const cartData = await cartService.getCart();
        dispatch({ type: 'SET_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart:', error);
        // Load from localStorage as fallback
        const localCart = storageService.getCart();
        dispatch({ type: 'SET_CART', payload: localCart });
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    storageService.setCart(state.items);
    // Trigger custom event for header to listen to
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { items: state.items, count: getCartCount() } 
    }));
  }, [state.items]);

  const addItem = async (product, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Prepare cart item from product
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || product.image,
        quantity,
        stock: product.stock || 999,
      };

      // Check stock availability
      if (quantity > (product.stock || 999)) {
        toast.error('Not enough stock available');
        return;
      }

      // Update local state first for immediate UI feedback
      dispatch({ type: 'ADD_ITEM', payload: cartItem });

      // Save to backend
      await cartService.addItem(cartItem);
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeItem = async (productId) => {
    try {
      // Update local state first for immediate UI feedback
      dispatch({ type: 'REMOVE_ITEM', payload: productId });

      // Save to backend
      await cartService.removeItem(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart');
      // Reload cart from storage to revert state
      const localCart = storageService.getCart();
      dispatch({ type: 'SET_CART', payload: localCart });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }

      // Check stock availability
      const item = state.items.find(item => item.id === productId);
      if (item && quantity > item.stock) {
        toast.error('Not enough stock available');
        return;
      }

      // Update local state first for immediate UI feedback
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });

      // Save to backend
      await cartService.updateQuantity(productId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      // Reload cart from storage to revert state
      const localCart = storageService.getCart();
      dispatch({ type: 'SET_CART', payload: localCart });
    }
  };

  const clearCart = async () => {
    try {
      // Update local state first for immediate UI feedback
      dispatch({ type: 'CLEAR_CART' });

      // Save to backend
      await cartService.clearCart();
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      // Reload cart from storage to revert state
      const localCart = storageService.getCart();
      dispatch({ type: 'SET_CART', payload: localCart });
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    getItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};