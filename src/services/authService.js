import { storageService } from './storageService';

class AuthService {
  constructor() {
    this.baseURL = '/api/auth';
  }

  async login(credentials) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      const { email, password } = credentials;
      
      if (email === 'user@gupfeehouse.com' && password === 'password123') {
        const user = {
          id: '1',
          email: 'user@gupfeehouse.com',
          name: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          role: 'customer',
          createdAt: new Date().toISOString(),
        };
        
        const token = 'mock-jwt-token-' + Date.now();
        return { user, token };
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { name, email, password } = userData;
      
      // Mock registration logic
      const user = {
        id: Date.now().toString(),
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      return { user, token };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async logout() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  async verifyToken(token) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (token && token.startsWith('mock-jwt-token-')) {
        return {
          id: '1',
          email: 'user@gupfeehouse.com',
          name: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          role: 'customer',
          createdAt: new Date().toISOString(),
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(profileData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentUser = await this.verifyToken(storageService.getToken());
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      const updatedUser = {
        ...currentUser,
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
      
      return updatedUser;
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    }
  }

  async forgotPassword(email) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Password reset link sent to your email'
      };
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  async resetPassword(token, password) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentUser = await this.verifyToken(storageService.getToken());
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Mock password validation
      if (currentPassword !== 'password123') {
        throw new Error('Current password is incorrect');
      }
      
      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      throw new Error(error.message || 'Password change failed');
    }
  }
}

export const authService = new AuthService();