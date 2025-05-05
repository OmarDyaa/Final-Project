import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];
  private cachedProducts = new Map<string, Pagination<Product>>();

  /**
   * Clears all cached data to ensure fresh data is loaded
   */
  clearCache() {
    this.cachedProducts.clear();
    this.types = [];
    this.brands = [];
    console.log('Product cache cleared');
  }

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

    // Use the timestamp from shopParams if available, or create a new one
    const timestamp = shopParams.timestamp || new Date().getTime();
    params = params.append('_t', timestamp.toString());

    // Set cache control headers to prevent browser caching
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };

    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {
      params,
      headers,
    });
  }

  getProduct(id: number) {
    // Add cache-busting parameter and headers to prevent browser caching
    const params = new HttpParams().append(
      '_t',
      new Date().getTime().toString()
    );
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };

    return this.http.get<Product>(this.baseUrl + 'products/' + id, {
      params,
      headers,
    });
  }

  getBrands() {
    if (this.brands.length > 0) return;

    const params = new HttpParams().append(
      '_t',
      new Date().getTime().toString()
    );
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };

    return this.http
      .get<string[]>(this.baseUrl + 'products/brands', {
        params,
        headers,
      })
      .subscribe({
        next: (response) => (this.brands = response),
      });
  }

  getTypes() {
    if (this.types.length > 0) return;

    const params = new HttpParams().append(
      '_t',
      new Date().getTime().toString()
    );
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };

    return this.http
      .get<string[]>(this.baseUrl + 'products/types', {
        params,
        headers,
      })
      .subscribe({
        next: (response) => (this.types = response),
      });
  }
}
