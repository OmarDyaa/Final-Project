import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../shared/models/product';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  bsaeUrl = 'https://fakestoreapi.com/';
  private http = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();
    if (shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));
    }
    if (shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));
    }
    if (shopParams.sort) {
      params = params.append('sort', shopParams.sort);
    }
    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }
    params = params.append('pageSize', shopParams.pageSize);
    params = params.append('pageIndex', shopParams.pageNumber);

    return this.http.get<Product[]>(this.bsaeUrl + 'products', { params });
  }
  getBrands() {
    if (this.brands.length > 0) return;
    return this.http.get<string[]>(this.bsaeUrl + 'products/brands').subscribe({
      next: (respose) => (this.brands = respose),
    });
  }
  getTypes() {
    if (this.types.length > 0) return;
    return this.http.get<string[]>(this.bsaeUrl + 'products/types').subscribe({
      next: (response) => (this.types = response),
    });
  }
  constructor() {}
}
