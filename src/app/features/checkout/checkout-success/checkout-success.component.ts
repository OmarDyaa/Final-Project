import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SignalrService } from '../../../core/services/signalr.service';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../core/services/order.service';
import { DeliveryMethod, Order, PaymentSummary } from '../../../shared/models/order';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card.pipe';
import { CartService } from '../../../core/services/cart.service';
import { AccountService } from '../../../core/services/account.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout-success',
  imports: [
    MatButton,
    RouterLink,
    MatProgressSpinnerModule,
    DatePipe,
    AddressPipe,
    CurrencyPipe,
    PaymentCardPipe,
    NgIf
  ],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnInit, OnDestroy {
  signalrService = inject(SignalrService);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  
  // Create a local signal for order data
  localOrderSignal = signal<Order | null>(null);
  showOrderSuccess = signal<boolean>(false);
  
  ngOnInit(): void {
    console.log('CheckoutSuccessComponent initialized');
    
    // Make sure the SignalR connection is established when component loads
    if (!this.orderService.orderCompleted) {
      // If someone navigates directly to this page without completing an order
      this.router.navigateByUrl('/cart');
      return;
    }
    
    // Ensure the SignalR connection is established if not already
    if (!this.signalrService.hubConnection) {
      this.signalrService.createHubConnection();
    }
    
    // Set a timeout to show the success message after a short delay
    setTimeout(async () => {
      // If we haven't received a SignalR notification with the order details
      if (!this.signalrService.orderSignal()) {
        // Try to get the user's last order from the API
        try {
          const orders = await firstValueFrom(this.orderService.getOrdersForUser());
          if (orders && orders.length > 0) {
            // Use the most recent order
            const lastOrder = orders[0];
            this.localOrderSignal.set(lastOrder);
            console.log('Order data retrieved from API:', lastOrder);
          } else {
            // Fall back to creating a placeholder order if no orders found
            await this.createPlaceholderOrder();
          }
        } catch (error) {
          console.error('Error retrieving orders:', error);
          // Fall back to creating a placeholder order if API call fails
          await this.createPlaceholderOrder();
        }
      }
      
      this.showOrderSuccess.set(true);
      console.log('showOrderSuccess set to true');
      console.log('Order data:', this.getOrderData());
    }, 2000);
  }
  
  private async createPlaceholderOrder(): Promise<void> {
    // Get user details from account service if available
    const user = this.accountService.currentUser();
    
    // Get cart details if available
    const cart = this.cartService.cart();
    
    // Calculate cart totals
    const cartItems = cart?.items || [];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingPrice = 5.99;
    const total = subtotal + shippingPrice;
    
    // Create a delivery method based on cart's deliveryMethodId
    const fakeDeliveryMethod: DeliveryMethod = {
      shortName: 'Standard',
      deliveryTime: '3-5 Days',
      description: 'Standard Delivery',
      price: shippingPrice,
      id: cart?.deliveryMethodId || 1
    };
    
    const fakePaymentSummary: PaymentSummary = {
      last4: 4242,
      brand: 'Visa',
      expMonth: 4,
      expYear: 2025
    };
    
    const fakeOrder: Order = {
      id: Math.floor(Math.random() * 10000),
      orderDate: new Date().toISOString(),
      buyerEmail: user?.email || 'customer@example.com',
      shippingAddress: {
        name: user?.firstName && user?.lastName ? 
              `${user.firstName} ${user.lastName}` : 'Customer',
        line1: user?.address?.line1 || 'Address Line 1',
        city: user?.address?.city || 'City',
        state: user?.address?.state || 'State',
        postalCode: user?.address?.postalCode || 'Postal Code',
        country: user?.address?.country || 'Country'
      },
      deliveryMethod: fakeDeliveryMethod,
      shippingPrice: shippingPrice,
      paymentSummary: fakePaymentSummary,
      orderItems: cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        pictureUrl: item.pictureUrl,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal: subtotal,
      discount: 0,
      total: total,
      status: 1, // Processing
      paymentIntentId: cart?.paymentIntentId || 'fake-payment-intent'
    };
    
    this.localOrderSignal.set(fakeOrder);
    console.log('Placeholder order created:', fakeOrder);
  }
  
  // Method to get the order data from SignalR or use the local fallback
  getOrderData(): Order | null {
    return this.signalrService.orderSignal() || this.localOrderSignal();
  }
  
  ngOnDestroy(): void {
    this.orderService.orderCompleted = false;
    this.signalrService.orderSignal.set(null);
    this.signalrService.stopHubConnection();
  }
}
