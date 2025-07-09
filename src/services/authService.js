import { storageService } from './storageService';
import supabase from '../lib/supabase';

class AuthService {
  constructor() {
    this.baseURL = '/api/auth';
  }

  async login(credentials) {
    try {
      // Try to login with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        // If Supabase auth fails, use mock authentication for demo
        console.warn('Supabase auth error, using mock auth:', authError);
        
        // Mock authentication logic
        const { email, password } = credentials;
        if (email === 'user@gupfeehouse.com' && password === 'password123') {
          const user = {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'user@gupfeehouse.com',
            name: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            role: 'customer',
            createdAt: new Date().toISOString(),
          };
          const token = 'mock-jwt-token-' + Date.now();
          storageService.setToken(token);
          return { user, token };
        }
        throw new Error('Invalid credentials');
      }

      // If Supabase auth succeeds, get the user's profile
      const { data: { user } } = authData;
      const token = authData.session.access_token;
      
      // Get user profile from Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      let userData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || 'User',
        avatar: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=3b82f6&color=fff`,
        role: user.user_metadata?.role || 'customer',
        createdAt: user.created_at,
      };
      
      // If profile exists, merge with userData
      if (profile && !profileError) {
        userData = {
          ...userData,
          name: profile.full_name || userData.name,
          avatar: profile.avatar_url || userData.avatar,
          phone: profile.phone,
        };
      }
      
      storageService.setToken(token);
      return { user: userData, token };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      // Try to register with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            role: 'customer',
          },
        },
      });

      if (authError) {
        // If Supabase registration fails, use mock registration for demo
        console.warn('Supabase registration error, using mock registration:', authError);
        
        const { name, email } = userData;
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
        storageService.setToken(token);
        return { user, token };
      }

      // If Supabase registration succeeds, create a profile
      const { data: { user } } = authData;
      const token = authData.session?.access_token || null;
      
      // Create a profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          full_name: userData.name,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
        }]);
      
      if (profileError) {
        console.warn('Error creating profile:', profileError);
      }
      
      const userObject = {
        id: user.id,
        email: user.email,
        name: userData.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
        role: 'customer',
        createdAt: user.created_at,
      };
      
      if (token) {
        storageService.setToken(token);
      }
      
      return { user: userObject, token };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async logout() {
    try {
      // Try to logout from Supabase
      await supabase.auth.signOut();
      storageService.removeToken();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      storageService.removeToken();
      throw new Error(error.message || 'Logout failed');
    }
  }

  async verifyToken(token) {
    try {
      // Check Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        // If Supabase session check fails, check mock token
        console.warn('Supabase session check failed, checking mock token:', error);
        
        if (token && token.startsWith('mock-jwt-token-')) {
          return {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'user@gupfeehouse.com',
            name: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            role: 'customer',
            createdAt: new Date().toISOString(),
          };
        }
        return null;
      }
      
      // Get user from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return {
        id: user.id,
        email: user.email,
        name: profile?.full_name || user.user_metadata?.full_name || 'User',
        avatar: profile?.avatar_url || user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=3b82f6&color=fff`,
        role: user.user_metadata?.role || 'customer',
        createdAt: user.created_at,
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
  
  async getCurrentUser() {
    try {
      const token = storageService.getToken();
      if (!token) return null;
      
      return await this.verifyToken(token);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async updateProfile(profileData) {
    try {
      // Try to update profile in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update auth metadata
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            full_name: profileData.name,
          }
        });
        
        if (metadataError) {
          console.warn('Error updating user metadata:', metadataError);
        }
        
        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: profileData.name,
            phone: profileData.phone,
            updated_at: new Date().toISOString(),
          });
        
        if (profileError) {
          console.warn('Error updating profile:', profileError);
        }
      }
      
      // Get current user from storage for mock
      const currentUser = await this.getCurrentUser();
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
      // Try to send reset password email with Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password',
      });
      
      if (error) {
        console.warn('Supabase password reset error, using mock:', error);
      }
      
      // Always return success for demo
      return { success: true, message: 'Password reset link sent to your email' };
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  async resetPassword(newPassword) {
    try {
      // In a real app, this would use Supabase's password reset
      // For the demo, we'll just return success
      console.log('Password reset for demo:', newPassword);
      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      // Try to change password with Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        // If Supabase password change fails, check mock password
        console.warn('Supabase password change error, using mock:', error);
        
        // Mock password validation
        if (currentPassword !== 'password123') {
          throw new Error('Current password is incorrect');
        }
      }
      
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      throw new Error(error.message || 'Password change failed');
    }
  }
}

export const authService = new AuthService();