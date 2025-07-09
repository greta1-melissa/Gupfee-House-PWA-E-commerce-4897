import { v4 as uuidv4 } from 'uuid';

class PaymentService {
  constructor() {
    this.supportedPaymentMethods = [
      {
        id: 'credit_card',
        name: 'Credit/Debit Card',
        icon: 'FiCreditCard'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: 'FiDollarSign'
      }
    ];
  }

  async processPayment(paymentDetails) {
    try {
      // This is a mock payment processor
      // In a real application, you would integrate with Stripe, PayPal, etc.
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate card details if using credit card
      if (paymentDetails.method === 'credit_card') {
        this.validateCardDetails(paymentDetails);
      }
      
      // Random success rate for demo purposes (95% success)
      const isSuccess = Math.random() < 0.95;
      
      if (!isSuccess) {
        throw new Error('Payment processing failed. Please try again.');
      }
      
      // Generate a mock transaction ID
      const transactionId = paymentDetails.method === 'credit_card' 
        ? `ch_${uuidv4().replace(/-/g, '').substring(0, 17)}`
        : `PAY-${uuidv4().replace(/-/g, '').substring(0, 17)}`;
      
      // Return successful payment result
      return {
        success: true,
        transactionId,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency || 'USD',
        method: paymentDetails.method,
        timestamp: new Date().toISOString(),
        status: 'completed',
        last4: paymentDetails.method === 'credit_card' ? paymentDetails.cardNumber.slice(-4) : null,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed',
        status: 'failed'
      };
    }
  }
  
  validateCardDetails(paymentDetails) {
    const { cardNumber, cardExpiry, cardCVC, cardName } = paymentDetails;
    
    // Basic validation
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
      throw new Error('Invalid card number');
    }
    
    if (!cardExpiry || !cardExpiry.match(/^\d{2}\/\d{2}$/)) {
      throw new Error('Invalid expiration date format (MM/YY)');
    }
    
    if (!cardCVC || !cardCVC.match(/^\d{3,4}$/)) {
      throw new Error('Invalid CVC code');
    }
    
    if (!cardName || cardName.trim().length < 3) {
      throw new Error('Invalid cardholder name');
    }
    
    // Check expiration date
    const [month, year] = cardExpiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
    const today = new Date();
    
    if (expiryDate < today) {
      throw new Error('Card has expired');
    }
    
    return true;
  }
  
  getSupportedPaymentMethods() {
    return this.supportedPaymentMethods;
  }
  
  // Luhn algorithm for card validation (not used in the mock, but would be in a real implementation)
  validateCardWithLuhn(number) {
    const digits = number.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through digits in reverse
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  }
  
  getCardType(number) {
    // Get card type based on number pattern
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
      diners: /^3(?:0[0-5]|[68])/
    };
    
    const cleanNumber = number.replace(/\D/g, '');
    
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleanNumber)) {
        return type;
      }
    }
    
    return 'unknown';
  }
}

export const paymentService = new PaymentService();