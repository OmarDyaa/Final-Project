import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../models/product';
import { Pagination } from '../../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  bsaeUrl = 'https://fakestoreapi.com/';
  private http = inject(HttpClient);

  getProducts() {
    return this.http.get<Product[]>(this.bsaeUrl + 'products');
  }
  constructor() {}
}
