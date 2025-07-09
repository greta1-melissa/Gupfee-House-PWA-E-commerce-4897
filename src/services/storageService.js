class StorageService {
  constructor() {
    this.prefix = 'gupfee_';
  }

  // Token management
  setToken(token) {
    localStorage.setItem(`${this.prefix}token`, token);
  }

  getToken() {
    return localStorage.getItem(`${this.prefix}token`);
  }

  removeToken() {
    localStorage.removeItem(`${this.prefix}token`);
  }

  // Admin token management
  setAdminToken(token) {
    localStorage.setItem(`${this.prefix}admin_token`, token);
  }

  getAdminToken() {
    return localStorage.getItem(`${this.prefix}admin_token`);
  }

  removeAdminToken() {
    localStorage.removeItem(`${this.prefix}admin_token`);
  }

  // Cart management
  setCart(cart) {
    localStorage.setItem(`${this.prefix}cart`, JSON.stringify(cart));
  }

  getCart() {
    const cart = localStorage.getItem(`${this.prefix}cart`);
    return cart ? JSON.parse(cart) : [];
  }

  clearCart() {
    localStorage.removeItem(`${this.prefix}cart`);
  }

  // Wishlist management
  setWishlist(wishlist) {
    localStorage.setItem(`${this.prefix}wishlist`, JSON.stringify(wishlist));
  }

  getWishlist() {
    const wishlist = localStorage.getItem(`${this.prefix}wishlist`);
    return wishlist ? JSON.parse(wishlist) : [];
  }

  clearWishlist() {
    localStorage.removeItem(`${this.prefix}wishlist`);
  }

  // User preferences
  setUserPreferences(preferences) {
    localStorage.setItem(`${this.prefix}preferences`, JSON.stringify(preferences));
  }

  getUserPreferences() {
    const preferences = localStorage.getItem(`${this.prefix}preferences`);
    return preferences ? JSON.parse(preferences) : {};
  }

  // Theme management
  setTheme(theme) {
    localStorage.setItem(`${this.prefix}theme`, theme);
  }

  getTheme() {
    return localStorage.getItem(`${this.prefix}theme`) || 'light';
  }

  // Search history
  addSearchHistory(query) {
    const history = this.getSearchHistory();
    const updatedHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
    localStorage.setItem(`${this.prefix}search_history`, JSON.stringify(updatedHistory));
  }

  getSearchHistory() {
    const history = localStorage.getItem(`${this.prefix}search_history`);
    return history ? JSON.parse(history) : [];
  }

  clearSearchHistory() {
    localStorage.removeItem(`${this.prefix}search_history`);
  }

  // Recently viewed products
  addRecentlyViewed(product) {
    const recent = this.getRecentlyViewed();
    const updatedRecent = [product, ...recent.filter(p => p.id !== product.id)].slice(0, 20);
    localStorage.setItem(`${this.prefix}recently_viewed`, JSON.stringify(updatedRecent));
  }

  getRecentlyViewed() {
    const recent = localStorage.getItem(`${this.prefix}recently_viewed`);
    return recent ? JSON.parse(recent) : [];
  }

  clearRecentlyViewed() {
    localStorage.removeItem(`${this.prefix}recently_viewed`);
  }

  // Clear all data
  clearAll() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const storageService = new StorageService();