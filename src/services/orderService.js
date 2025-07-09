import supabase from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { authService } from './authService';
import { cartService } from './cartService';

class OrderService {
  constructor() {
    this.ordersTable = 'orders_gupfee_24ab7c';
    this.orderItemsTable = 'order_items_gupfee_24ab7c';
    this.shippingAddressesTable = 'shipping_addresses_gupfee_24ab7c';
    this.orderHistoryTable = 'order_history_gupfee_24ab7c';
    this.paymentDetailsTable = 'payment_details_gupfee_24ab7c';
  }

  async getOrders() {
    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from(this.ordersTable)
        .select(`
          *,
          shipping_address:${this.shippingAddressesTable}(*),
          order_items:${this.orderItemsTable}(*),
          order_history:${this.orderHistoryTable}(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Return mock data for demonstration purposes
      return this.getMockOrders();
    }
  }

  async getOrderById(id) {
    try {
      const { data, error } = await supabase
        .from(this.ordersTable)
        .select(`
          *,
          shipping_address:${this.shippingAddressesTable}(*),
          order_items:${this.orderItemsTable}(*),
          order_history:${this.orderHistoryTable}(*),
          payment_details:${this.paymentDetailsTable}(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      // Return mock data for demonstration purposes
      return this.getMockOrderById(id);
    }
  }

  async createOrder(orderData) {
    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // 1. Create the order
      const { shipping_address, items, payment_method, ...orderDetails } = orderData;
      const newOrder = {
        user_id: user.id,
        shipping_address_id: shipping_address.id,
        payment_method,
        subtotal: orderDetails.subtotal,
        shipping_cost: orderDetails.shipping_cost,
        tax: orderDetails.tax,
        discount: orderDetails.discount || 0,
        total: orderDetails.total,
        status: 'pending',
        payment_status: 'pending',
        notes: orderDetails.notes || null
      };

      const { data: order, error: orderError } = await supabase
        .from(this.ordersTable)
        .insert([newOrder])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from(this.orderItemsTable)
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Record payment details (mock for demo)
      const paymentDetails = {
        order_id: order.id,
        payment_method: payment_method,
        payment_id: `PAY-${Math.random().toString(36).substring(2, 15)}`,
        amount: orderDetails.total,
        status: 'completed',
        transaction_data: {
          payment_method_type: payment_method,
          timestamp: new Date().toISOString()
        }
      };

      const { error: paymentError } = await supabase
        .from(this.paymentDetailsTable)
        .insert([paymentDetails]);

      if (paymentError) throw paymentError;

      // 4. Update order payment status
      const { error: updateError } = await supabase
        .from(this.ordersTable)
        .update({ payment_status: 'paid', status: 'processing' })
        .eq('id', order.id);

      if (updateError) throw updateError;

      // 5. Clear the cart after successful order
      await cartService.clearCart();

      return { ...order, order_number: order.order_number || `GH-${Date.now()}` };
    } catch (error) {
      console.error('Error creating order:', error);
      // Create a mock order for demonstration
      return this.createMockOrder(orderData);
    }
  }

  async getShippingAddresses() {
    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from(this.shippingAddressesTable)
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching shipping addresses:', error);
      // Return mock addresses
      return this.getMockShippingAddresses();
    }
  }

  async addShippingAddress(addressData) {
    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const newAddress = {
        ...addressData,
        user_id: user.id
      };

      // If this is the first address or set as default, update other addresses
      if (newAddress.is_default) {
        await supabase
          .from(this.shippingAddressesTable)
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from(this.shippingAddressesTable)
        .insert([newAddress])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding shipping address:', error);
      // Return a mock response
      return {
        ...addressData,
        id: uuidv4(),
        created_at: new Date().toISOString()
      };
    }
  }

  async updateOrderStatus(orderId, status, notes = null) {
    try {
      const { error } = await supabase
        .from(this.ordersTable)
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Add to order history
      const historyEntry = {
        order_id: orderId,
        status,
        notes: notes || `Status updated to ${status}`
      };

      const { error: historyError } = await supabase
        .from(this.orderHistoryTable)
        .insert([historyEntry]);

      if (historyError) throw historyError;

      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  }

  async cancelOrder(orderId) {
    return this.updateOrderStatus(orderId, 'cancelled', 'Order cancelled by customer');
  }

  // Mock data methods for fallback
  getMockOrders() {
    return [
      {
        id: '33333333-3333-3333-3333-333333333333',
        order_number: 'GH-20240101-0001',
        status: 'delivered',
        created_at: '2024-01-01T10:30:00Z',
        total: 168.46,
        payment_status: 'paid',
        order_items: [
          {
            product_name: 'Premium Betta Fish',
            product_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
            quantity: 2,
            unit_price: 49.99,
            total_price: 99.98
          },
          {
            product_name: 'Aquarium Heater Pro',
            product_image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
            quantity: 1,
            unit_price: 49.99,
            total_price: 49.99
          }
        ]
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        order_number: 'GH-20240215-0002',
        status: 'shipped',
        created_at: '2024-02-15T14:22:00Z',
        total: 92.77,
        payment_status: 'paid',
        order_items: [
          {
            product_name: 'Colorful Guppy Fish (Trio)',
            product_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            quantity: 1,
            unit_price: 29.99,
            total_price: 29.99
          },
          {
            product_name: 'Aquarium Heater Pro',
            product_image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
            quantity: 1,
            unit_price: 49.99,
            total_price: 49.99
          }
        ]
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        order_number: 'GH-20240305-0003',
        status: 'processing',
        created_at: '2024-03-05T09:15:00Z',
        total: 33.48,
        payment_status: 'paid',
        order_items: [
          {
            product_name: 'Premium Guppy Fish Pair',
            product_image: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400&h=300&fit=crop',
            quantity: 1,
            unit_price: 24.99,
            total_price: 24.99
          }
        ]
      }
    ];
  }

  getMockOrderById(id) {
    const mockOrders = this.getMockOrders();
    const order = mockOrders.find(o => o.id === id) || mockOrders[0];
    
    return {
      ...order,
      shipping_address: {
        full_name: 'John Doe',
        address_line1: '123 Main St',
        address_line2: '',
        city: 'Anytown',
        state: 'CA',
        postal_code: '90210',
        country: 'United States',
        phone: '555-123-4567'
      },
      order_history: [
        { status: 'pending', created_at: new Date(Date.now() - 400000000).toISOString(), notes: 'Order placed' },
        { status: 'processing', created_at: new Date(Date.now() - 300000000).toISOString(), notes: 'Payment confirmed' },
        { status: 'shipped', created_at: new Date(Date.now() - 200000000).toISOString(), notes: 'Order shipped via USPS' },
        { status: 'delivered', created_at: new Date(Date.now() - 100000000).toISOString(), notes: 'Package delivered' }
      ].slice(0, order.status === 'delivered' ? 4 : order.status === 'shipped' ? 3 : order.status === 'processing' ? 2 : 1),
      payment_details: {
        payment_method: 'credit_card',
        payment_id: 'ch_123456789',
        amount: order.total,
        status: 'completed',
        transaction_data: { card_last4: '4242', card_brand: 'visa' }
      }
    };
  }

  getMockShippingAddresses() {
    return [
      {
        id: '11111111-1111-1111-1111-111111111111',
        full_name: 'John Doe',
        address_line1: '123 Main St',
        address_line2: '',
        city: 'Anytown',
        state: 'CA',
        postal_code: '90210',
        country: 'United States',
        phone: '555-123-4567',
        is_default: true,
        created_at: '2023-12-01T10:00:00Z'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        full_name: 'John Doe',
        address_line1: '456 Oak Ave',
        address_line2: 'Apt 7B',
        city: 'Somecity',
        state: 'NY',
        postal_code: '10001',
        country: 'United States',
        phone: '555-987-6543',
        is_default: false,
        created_at: '2023-12-15T14:30:00Z'
      }
    ];
  }

  createMockOrder(orderData) {
    const orderId = uuidv4();
    const orderNumber = `GH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    return {
      id: orderId,
      order_number: orderNumber,
      status: 'processing',
      created_at: new Date().toISOString(),
      total: orderData.total,
      payment_status: 'paid',
      success: true
    };
  }

  // Admin methods for order management
  async getAdminOrders() {
    try {
      const { data, error } = await supabase
        .from(this.ordersTable)
        .select(`
          *,
          shipping_address:${this.shippingAddressesTable}(full_name),
          order_items:${this.orderItemsTable}(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      // Return mock data for demonstration
      return this.getMockOrders();
    }
  }

  calculateShipping(subtotal) {
    // Basic shipping calculation rules:
    // Free shipping for orders over $75
    // $5.99 standard shipping for orders under $75
    // $12.99 expedited shipping
    const FREE_SHIPPING_THRESHOLD = 75;
    const STANDARD_SHIPPING = 5.99;
    const EXPEDITED_SHIPPING = 12.99;
    
    return {
      standard: {
        price: subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING,
        name: subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free Shipping' : 'Standard Shipping',
        description: '5-7 business days',
      },
      expedited: {
        price: EXPEDITED_SHIPPING,
        name: 'Expedited Shipping',
        description: '2-3 business days',
      }
    };
  }

  calculateTax(subtotal, state = 'CA') {
    // Simple tax calculation based on state
    // In a real app, you'd use a tax API for accurate calculations
    const TAX_RATES = {
      'CA': 0.0725, // 7.25%
      'NY': 0.0885, // 8.85%
      'TX': 0.0625, // 6.25%
      'FL': 0.06,   // 6%
      'default': 0.06 // Default 6%
    };
    
    const rate = TAX_RATES[state] || TAX_RATES.default;
    return parseFloat((subtotal * rate).toFixed(2));
  }
}

export const orderService = new OrderService();