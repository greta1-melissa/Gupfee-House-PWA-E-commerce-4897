import { storageService } from './storageService';

class AdminService {
  constructor() {
    this.baseURL = '/api/admin';
    this.adminCredentials = {
      username: 'gupfeehouse',
      password: 'admin123', // In production, this should be hashed
    };
  }

  async login(credentials) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { username, password } = credentials;
      
      if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
        const admin = {
          id: 'admin-1',
          username: 'gupfeehouse',
          email: 'admin@gupfeehouse.com',
          name: 'Admin User',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          role: 'admin',
          permissions: ['all'],
          createdAt: new Date().toISOString(),
        };
        
        const token = 'admin-jwt-token-' + Date.now();
        return { admin, token };
      }
      
      throw new Error('Invalid admin credentials');
    } catch (error) {
      throw new Error(error.message || 'Admin login failed');
    }
  }

  async logout() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Admin logout failed');
    }
  }

  async verifyToken(token) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (token && token.startsWith('admin-jwt-token-')) {
        return {
          id: 'admin-1',
          username: 'gupfeehouse',
          email: 'admin@gupfeehouse.com',
          name: 'Admin User',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          role: 'admin',
          permissions: ['all'],
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
      
      const currentAdmin = await this.verifyToken(storageService.getAdminToken());
      if (!currentAdmin) {
        throw new Error('Admin not authenticated');
      }
      
      const updatedAdmin = {
        ...currentAdmin,
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
      
      return updatedAdmin;
    } catch (error) {
      throw new Error(error.message || 'Admin profile update failed');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentAdmin = await this.verifyToken(storageService.getAdminToken());
      if (!currentAdmin) {
        throw new Error('Admin not authenticated');
      }
      
      // Mock password validation
      if (currentPassword !== this.adminCredentials.password) {
        throw new Error('Current password is incorrect');
      }
      
      // In production, you would hash the new password
      this.adminCredentials.password = newPassword;
      
      return {
        success: true,
        message: 'Admin password changed successfully'
      };
    } catch (error) {
      throw new Error(error.message || 'Admin password change failed');
    }
  }

  // Dashboard Statistics
  async getDashboardStats() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        totalUsers: 1247,
        totalOrders: 856,
        totalProducts: 124,
        totalRevenue: 45678.90,
        monthlyRevenue: 12345.67,
        weeklyOrders: 45,
        conversionRate: 3.2,
        avgOrderValue: 67.89,
        recentOrders: [
          {
            id: 'ORD-001',
            customer: 'John Doe',
            amount: 89.99,
            status: 'pending',
            date: new Date().toISOString()
          },
          {
            id: 'ORD-002',
            customer: 'Jane Smith',
            amount: 156.50,
            status: 'completed',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        topProducts: [
          {
            id: 1,
            name: 'Premium Betta Fish',
            sales: 45,
            revenue: 2250
          },
          {
            id: 2,
            name: 'Aquarium Heater',
            sales: 38,
            revenue: 1140
          }
        ]
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch dashboard stats');
    }
  }
}

export const adminService = new AdminService();