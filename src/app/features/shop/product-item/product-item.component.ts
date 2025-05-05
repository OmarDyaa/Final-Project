import { Component, effect, inject, Input } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ProductUpdateService } from '../../../core/services/product-update.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [MatCard, MatCardContent, MatIcon, CurrencyPipe, RouterLink],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  @Input() product?: Product;
  cartService = inject(CartService);
  private productUpdateService = inject(ProductUpdateService);

  constructor() {
    // Setup effect to handle product updates
    effect(() => {
      const updatedProduct = this.productUpdateService.getProductUpdates()();
      if (updatedProduct && this.product?.id === updatedProduct.id) {
        this.product = updatedProduct;
      }
    });
  }
}
