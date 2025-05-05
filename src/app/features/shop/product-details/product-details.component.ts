import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { ProductUpdateService } from '../../../core/services/product-update.service';
import { AccountService } from '../../../core/services/account.service';
import { Subscription, filter, finalize } from 'rxjs';
import { BusyService } from '../../../core/services/busy.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButton,
    MatIcon,
    NgIf,
    MatDivider,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);
  private accountService = inject(AccountService);
  private productUpdateService = inject(ProductUpdateService);
  private busyService = inject(BusyService);
  product?: Product;
  quantityInCart = 0;
  quantity = 1;
  private subscriptions = new Subscription();
  private currentProductId?: number;
  private lastLoadTime = 0;

  constructor() {
    // Subscribe to product updates from ProductUpdateService
    effect(() => {
      const updatedProduct = this.productUpdateService.getProductUpdates()();
      if (updatedProduct && updatedProduct.id === this.product?.id) {
        console.log(
          'Product details updated via ProductUpdateService:',
          updatedProduct
        );
        this.product = updatedProduct;
      }
    });

    // Use effect to monitor user changes instead of subscribe
    effect(() => {
      // This will re-run whenever the currentUser signal changes
      const user = this.accountService.currentUser();
      // Reload product data when user changes
      if (this.currentProductId) {
        console.log('User changed, reloading product data');
        this.loadProductById(this.currentProductId);
      }
    });

    // Subscribe to route changes to reload data when navigating between different products
    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          console.log('Navigation detected, reloading product data');
          this.loadProduct();
        })
    );
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    const productId = +id;
    this.currentProductId = productId;
    this.loadProductById(productId);
  }

  loadProductById(id: number) {
    // Prevent excessive reloading within a short timeframe (debounce)
    const now = Date.now();
    if (now - this.lastLoadTime < 300) {
      console.log('Debouncing product reload');
      return;
    }
    this.lastLoadTime = now;

    // Force cache invalidation with a unique timestamp
    const timestamp = new Date().getTime();

    this.busyService.busy(); // Show loading indicator

    this.shopService
      .getProduct(id)
      .pipe(
        finalize(() => this.busyService.idle()) // Hide loading indicator
      )
      .subscribe({
        next: (product) => {
          console.log(`Loaded fresh product data:`, product);
          this.product = product;
          this.updateQuantityInCart();
        },
        error: (error) => {
          console.error('Error loading product:', error);
        },
      });
  }

  updateCart() {
    if (!this.product) return;
    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(this.product, itemsToAdd);
    } else {
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
    }
  }

  updateQuantityInCart() {
    this.quantityInCart =
      this.cartService
        .cart()
        ?.items.find((x) => x.productId === this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  }

  getButtonText() {
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart';
  }

  ngOnDestroy(): void {
    this.productUpdateService.clearUpdate();
    this.subscriptions.unsubscribe();
  }
}
