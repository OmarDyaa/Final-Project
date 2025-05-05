import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderParams } from '../../shared/models/orderParams';
import { Pagination } from '../../shared/models/pagination';
import { Order } from '../../shared/models/order';
import { Product } from '../../shared/models/product';
import { User } from '../../shared/models/user';
import { catchError, map, Observable, of } from 'rxjs';

interface UserResponse {
  id: string;
  name: string;
  userName: string;
  email: string;
  roles: string;
}

interface UsersResponse {
  allUsersCount: number;
  adminsCount: number;
  editorsCount: number;
  customersCount: number;
  users: UserResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getOrders(orderParams: OrderParams) {
    let params = new HttpParams();
    if (orderParams.filter && orderParams.filter !== 'All') {
      params = params.append('status', orderParams.filter);
    }
    if (orderParams.sort) {
      params = params.append('sort', orderParams.sort);
    }
    params = params.append('pageIndex', orderParams.pageNumber);
    params = params.append('pageSize', orderParams.pageSize);
    // Add cache-busting parameter
    params = params.append('_t', new Date().getTime().toString());

    return this.http.get<Pagination<Order>>(this.baseUrl + 'admin/orders', {
      params,
    });
  }

  getOrder(id: number) {
    const params = new HttpParams().append(
      '_t',
      new Date().getTime().toString()
    );
    return this.http.get<Order>(this.baseUrl + 'admin/orders/' + id, {
      params,
    });
  }

  refundOrder(id: number) {
    return this.http.post<Order>(
      this.baseUrl + 'admin/orders/refund/' + id,
      {}
    );
  }

  createProduct(product: Partial<Product>) {
    return this.http.post<Product>(this.baseUrl + 'products', product);
  }

  updateProduct(product: Partial<Product>) {
    // Add cache control headers to ensure updates are properly persisted
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };

    return this.http.put<Product>(
      this.baseUrl + 'products/' + product.id,
      product,
      { headers }
    );
  }

  deleteProduct(id: number) {
    return this.http.delete<void>(this.baseUrl + 'products/' + id);
  }

  getUsers(): Observable<UsersResponse> {
    const params = new HttpParams().append(
      '_t',
      new Date().getTime().toString()
    );
    return this.http.get<UsersResponse>(this.baseUrl + 'admin/users', {
      params,
    });
  }

  addUser(user: User): Observable<boolean> {
    return this.http
      .post(this.baseUrl + 'admin/adduser', user, { responseType: 'text' })
      .pipe(
        map((response) => {
          if (response.includes('successfully')) {
            return true;
          }
          throw new Error('Failed to create user');
        }),
        catchError((error) => {
          console.error('Error adding user:', error);
          return of(false);
        })
      );
  }

  resetUserPassword(email: string): Observable<boolean> {
    return this.http
      .post(
        this.baseUrl + 'admin/reset-password',
        { email },
        { responseType: 'text' }
      )
      .pipe(
        map((response) => {
          if (response.includes('successfully')) {
            return true;
          }
          throw new Error('Failed to reset password');
        }),
        catchError((error) => {
          console.error('Error resetting password:', error);
          return of(false);
        })
      );
  }

  toggleUserBlock(
    email: string,
    action: 'block' | 'unblock'
  ): Observable<boolean> {
    return this.http
      .post(
        this.baseUrl + `admin/${action}-user`,
        { email },
        { responseType: 'text' }
      )
      .pipe(
        map((response) => {
          if (response.includes('successfully')) {
            return true;
          }
          throw new Error(`Failed to ${action} user`);
        }),
        catchError((error) => {
          console.error(`Error ${action}ing user:`, error);
          return of(false);
        })
      );
  }
}
