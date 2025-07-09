import { storageService } from './storageService';

class CartService {
  constructor() {
    this.baseURL = '/api/cart';
  }

  async getCart() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // For now, return data from localStorage
      return storageService.getCart();
    } catch (error) {
      console.error('Error fetching cart:', error);
      return storageService.getCart();
    }
  }

  async addItem(item) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real app, this would make an API call
      // For now, we'll just return success
      return { success: true, item };
    } catch (error) {
      throw new Error(error.message || 'Failed to add item to cart');
    }
  }

  async removeItem(itemId) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, itemId };
    } catch (error) {
      throw new Error(error.message || 'Failed to remove item from cart');
    }
  }

  async updateQuantity(itemId, quantity) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, itemId, quantity };
    } catch (error) {
      throw new Error(error.message || 'Failed to update item quantity');
    }
  }

  async clearCart() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to clear cart');
    }
  }

  async applyDiscount(discountCode) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock discount validation
      const validCodes = {
        'SAVE10': { type: 'percentage', value: 10 },
        'FISH20': { type: 'percentage', value: 20 },
        'NEWUSER': { type: 'fixed', value: 5 }
      };

      if (validCodes[discountCode]) {
        return {
          success: true,
          discount: validCodes[discountCode],
          message: 'Discount applied successfully'
        };
      }

      throw new Error('Invalid discount code');
    } catch (error) {
      throw new Error(error.message || 'Failed to apply discount');
    }
  }

  async calculateShipping() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock shipping calculation
      const baseRate = 5.99;
      const expeditedRate = 12.99;
      const freeShippingThreshold = 50;

      return {
        standard: {
          rate: baseRate,
          estimatedDays: '5-7 business days'
        },
        expedited: {
          rate: expeditedRate,
          estimatedDays: '2-3 business days'
        },
        freeShippingThreshold
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to calculate shipping');
    }
  }

  async validateCart(cartItems) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock cart validation
      const validatedItems = cartItems.map(item => ({
        ...item,
        available: item.stock > 0,
        maxQuantity: item.stock
      }));

      return {
        success: true,
        items: validatedItems,
        hasErrors: validatedItems.some(item => !item.available)
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to validate cart');
    }
  }
}

export const cartService = new CartService();