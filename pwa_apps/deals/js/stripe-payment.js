/**
 * Stripe payment integration for deals purchase flow.
 * 
 * Features:
 * - Secure card collection using Stripe Elements
 * - Error handling and validation
 * - Loading states and user feedback
 * - Payment confirmation handling
 */

class StripePaymentHandler {
  constructor(publicKey) {
    this.stripe = Stripe(publicKey);
    this.elements = null;
    this.paymentElement = null;
    this.loading = false;
  }

  async initialize(elementId) {
    // Create Elements instance
    this.elements = this.stripe.elements();
    
    // Create and mount the Payment Element
    this.paymentElement = this.elements.create('payment');
    this.paymentElement.mount(`#${elementId}`);
    
    // Set up event listeners
    this.setupListeners();
  }

  setupListeners() {
    // Handle real-time validation
    this.paymentElement.on('change', (event) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  async startPaymentFlow(paymentIntent) {
    if (this.loading) return;
    
    this.loading = true;
    this.updateUI({ loading: true });
    
    try {
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/deals/confirmation`,
        },
        redirect: 'if_required'
      });

      if (error) {
        // Handle errors
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message;
        this.updateUI({ loading: false, error: true });
      } else {
        // Payment successful
        this.handleSuccess();
      }
    } catch (e) {
      console.error('Payment error:', e);
      this.updateUI({ loading: false, error: true });
    } finally {
      this.loading = false;
    }
  }

  updateUI({ loading = false, error = false }) {
    const submitButton = document.getElementById('submit-payment');
    const spinner = document.getElementById('payment-spinner');
    const successElement = document.getElementById('payment-success');
    
    if (loading) {
      submitButton.disabled = true;
      spinner.style.display = 'inline-block';
      successElement.style.display = 'none';
    } else {
      submitButton.disabled = false;
      spinner.style.display = 'none';
      
      if (!error) {
        successElement.style.display = 'block';
      }
    }
  }

  handleSuccess() {
    // Clear form
    this.paymentElement.clear();
    
    // Update UI
    this.updateUI({ loading: false });
    
    // Show success message
    const successElement = document.getElementById('payment-success');
    successElement.style.display = 'block';
    
    // Emit success event
    const event = new CustomEvent('payment-success');
    window.dispatchEvent(event);
  }

  async createPaymentIntent(dealId, amount) {
    try {
      const response = await fetch('/deals/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dealId,
          amount
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }
      
      const data = await response.json();
      return data.clientSecret;
      
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }
}

// Initialize payment handler
let stripeHandler;

window.initializeStripePayment = async function(publicKey, elementId) {
  stripeHandler = new StripePaymentHandler(publicKey);
  await stripeHandler.initialize(elementId);
  return stripeHandler;
};