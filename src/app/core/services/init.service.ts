import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { of, tap } from 'rxjs';
import { AccountService } from './account.service';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService = inject(CartService);
  private accountService = inject(AccountService);
  private signalrService = inject(SignalrService);

  init() {
    return this.accountService.getUserInfo().pipe(
      tap((user) => {
        if (user) {
          this.signalrService.createHubConnection();
          // Only load cart for customer role
          if (!user.roles.includes('Admin') && !user.roles.includes('Editor')) {
            const cartId = localStorage.getItem('cart_id');
            if (cartId) {
              this.cartService.getCart(cartId).subscribe();
            }
          } else {
            // Clear any existing cart for admin/editor roles
            this.cartService.clearCart();
          }
        } else {
          // Handle not logged in state
          const cartId = localStorage.getItem('cart_id');
          if (cartId) {
            this.cartService.getCart(cartId).subscribe();
          }
        }
      })
    );
  }
}
