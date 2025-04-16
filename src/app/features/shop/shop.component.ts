import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../models/product';
import { MatCard } from '@angular/material/card';
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: 'app-shop',
  imports: [MatCard, ProductItemComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  title = 'Store';
  products: Product[] = [];

  ngOnInit(): void {
    this.shopService.getProducts().subscribe({
      // next: (response) => (this.products = response.data),
      next: (response) => (this.products = response),
      error: (error) => console.log(error),
    });
  }
}
