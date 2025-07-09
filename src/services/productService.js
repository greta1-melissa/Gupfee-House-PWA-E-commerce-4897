import supabase from '../lib/supabase';

class ProductService {
  constructor() {
    this.tableName = 'products_gupfee_2024';
  }

  async getFeaturedProducts() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('in_stock', true)
        .order('rating', { ascending: false })
        .limit(4);

      if (error) {
        console.warn('Supabase error, using fallback data:', error);
        return this.getFallbackProducts().slice(0, 4);
      }
      
      return data && data.length > 0 ? data : this.getFallbackProducts().slice(0, 4);
    } catch (error) {
      console.warn('Error fetching featured products, using fallback:', error);
      return this.getFallbackProducts().slice(0, 4);
    }
  }

  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase error, using fallback data:', error);
        return this.getFallbackProducts();
      }
      
      return data && data.length > 0 ? data : this.getFallbackProducts();
    } catch (error) {
      console.warn('Error fetching all products, using fallback:', error);
      return this.getFallbackProducts();
    }
  }

  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn('Supabase error, using fallback data:', error);
        return this.getFallbackProduct(id);
      }
      
      return data || this.getFallbackProduct(id);
    } catch (error) {
      console.warn('Error fetching product, using fallback:', error);
      return this.getFallbackProduct(id);
    }
  }

  async getProductsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('category', category)
        .eq('in_stock', true)
        .order('rating', { ascending: false });

      if (error) {
        console.warn('Supabase error, using fallback data:', error);
        return this.getFallbackProducts().filter(p => p.category === category);
      }
      
      return data && data.length > 0 ? data : this.getFallbackProducts().filter(p => p.category === category);
    } catch (error) {
      console.warn('Error fetching products by category, using fallback:', error);
      return this.getFallbackProducts().filter(p => p.category === category);
    }
  }

  async searchProducts(query) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('in_stock', true)
        .order('rating', { ascending: false });

      if (error) {
        console.warn('Supabase error, using fallback data:', error);
        return this.getFallbackProducts().filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      return data || this.getFallbackProducts().filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.warn('Error searching products, using fallback:', error);
      return this.getFallbackProducts().filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  // Fallback data for offline/error scenarios
  getFallbackProducts() {
    return [
      {
        id: '1',
        name: 'Premium Betta Fish',
        price: 49.99,
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        category: 'fish',
        rating: 4.8,
        reviews_count: 124,
        in_stock: true,
        badge: 'Popular',
        description: 'Beautiful premium betta fish with vibrant colors and healthy fins.',
        stock: 15,
        sku: 'BF-001',
        features: ['Healthy and vibrant coloration', 'Carefully bred for quality', 'Premium bloodline genetics'],
        specifications: {
          size: '2-3 inches',
          lifespan: '2-4 years',
          water_temperature: '76-82°F',
          ph_level: '6.5-7.5',
          tank_size: '5+ gallons',
          diet: 'Carnivorous'
        }
      },
      {
        id: '2',
        name: 'Colorful Guppy Fish (Trio)',
        price: 29.99,
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        category: 'fish',
        rating: 4.7,
        reviews_count: 98,
        in_stock: true,
        badge: 'Best Seller',
        description: 'Vibrant and active guppy fish trio featuring stunning tail patterns and brilliant colors perfect for community tanks.',
        stock: 25,
        sku: 'GF-002',
        features: ['Beautiful tail patterns', 'Hardy and easy to care for', 'Great for beginners', 'Multiple color varieties'],
        specifications: {
          size: '1.5-2 inches',
          lifespan: '2-3 years',
          water_temperature: '72-78°F',
          ph_level: '7.0-8.0',
          tank_size: '10+ gallons',
          diet: 'Omnivorous'
        }
      },
      {
        id: '3',
        name: 'Premium Guppy Fish Pair',
        price: 24.99,
        image_url: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400&h=300&fit=crop',
        category: 'fish',
        rating: 4.6,
        reviews_count: 87,
        in_stock: true,
        badge: 'New Arrival',
        description: 'Beautiful premium guppy fish pair with vibrant colors and healthy genetics, perfect for breeding.',
        stock: 18,
        sku: 'GF-005',
        features: ['Vibrant coloration', 'Healthy breeding pair', 'Disease resistant', 'Show quality genetics'],
        specifications: {
          size: '1.5-2 inches',
          lifespan: '2-3 years',
          water_temperature: '72-78°F',
          ph_level: '7.0-8.0',
          tank_size: '10+ gallons',
          diet: 'Omnivorous'
        }
      },
      {
        id: '4',
        name: 'Aquarium Heater Pro',
        price: 39.99,
        image_url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
        category: 'equipment',
        rating: 4.6,
        reviews_count: 89,
        in_stock: true,
        badge: 'Best Seller',
        description: 'Professional-grade aquarium heater with precise temperature control.',
        stock: 20,
        sku: 'AH-003',
        features: ['Precise temperature control', 'Auto-shutoff safety feature', 'Suitable for 50-gallon tanks'],
        specifications: {
          wattage: '150W',
          tank_size: 'Up to 50 gallons',
          temperature_range: '68-88°F',
          material: 'Quartz glass',
          warranty: '2 years'
        }
      }
    ];
  }

  getFallbackProduct(id) {
    return this.getFallbackProducts().find(p => p.id === id) || this.getFallbackProducts()[0];
  }
}

export const productService = new ProductService();