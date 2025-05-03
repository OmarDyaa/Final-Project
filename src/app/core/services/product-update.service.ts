import { Injectable, signal } from '@angular/core';
import { Product } from '../../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductUpdateService {
  private productUpdateSignal = signal<Product | null>(null);

  notifyProductUpdate(product: Product) {
    this.productUpdateSignal.set(product);
  }

  getProductUpdates() {
    return this.productUpdateSignal;
  }

  clearUpdate() {
    this.productUpdateSignal.set(null);
  }
}
