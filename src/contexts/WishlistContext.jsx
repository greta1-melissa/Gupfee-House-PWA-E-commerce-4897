import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { storageService } from '../services/storageService';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'SET_WISHLIST':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      if (state.items.find(item => item.id === action.payload.id)) {
        return state;
      }
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_WISHLIST':
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
  error: null,
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlistData = await wishlistService.getWishlist();
        dispatch({ type: 'SET_WISHLIST', payload: wishlistData });
      } catch (error) {
        console.error('Error loading wishlist:', error);
        // Load from localStorage as fallback
        const localWishlist = storageService.getWishlist();
        dispatch({ type: 'SET_WISHLIST', payload: localWishlist });
      }
    };

    loadWishlist();
  }, []);

  const addItem = async (product) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (state.items.find(item => item.id === product.id)) {
        toast.error('Item already in wishlist');
        return;
      }

      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        addedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
      
      // Save to backend and localStorage
      await wishlistService.addItem(wishlistItem);
      const updatedWishlist = [...state.items, wishlistItem];
      storageService.setWishlist(updatedWishlist);
      toast.success('Item added to wishlist');
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      toast.error('Failed to add item to wishlist');
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeItem = async (productId) => {
    try {
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      await wishlistService.removeItem(productId);
      
      const updatedWishlist = state.items.filter(item => item.id !== productId);
      storageService.setWishlist(updatedWishlist);
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const clearWishlist = async () => {
    try {
      dispatch({ type: 'CLEAR_WISHLIST' });
      await wishlistService.clearWishlist();
      storageService.clearWishlist();
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeItem(product.id);
    } else {
      await addItem(product);
    }
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
    toggleWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};