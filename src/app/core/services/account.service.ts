import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/models/user';
import { map, tap } from 'rxjs';
import { SignalrService } from './signalr.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private signalrService = inject(SignalrService);
  private cartService = inject(CartService);

  currentUser = signal<User | null>(null);
  isAdmin = computed(() => {
    const roles = this.currentUser()?.roles;
    return Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin';
  });
  isEditor = computed(() => {
    const roles = this.currentUser()?.roles;
    return Array.isArray(roles) ? roles.includes('Editor') : roles === 'Editor';
  });

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http
      .post<User>(this.baseUrl + 'login', values, { params })
      .pipe(
        tap(() => {
          // Clear existing cart when logging in
          this.cartService.clearCart();
          this.signalrService.createHubConnection();
        })
      );
  }

  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values);
  }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-info').pipe(
      map((user) => {
        this.currentUser.set(user);
        return user;
      })
    );
  }

  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {}).pipe(
      tap(() => {
        this.cartService.deleteCart();
        this.signalrService.stopHubConnection();
        this.currentUser.set(null);
      })
    );
  }

  updateAddress(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address).pipe(
      tap(() => {
        this.currentUser.update((user) => {
          if (user) user.address = address;
          return user;
        });
      })
    );
  }

  getAuthState() {
    return this.http.get<{ isAuthenticated: boolean }>(
      this.baseUrl + 'account/auth-status'
    );
  }


  forgetpassword(email: string) {
    const params = new HttpParams().set('email', email); // Add email as a query parameter
    return this.http.get(this.baseUrl + 'account/forget-password', { params, responseType: 'text' });
  }

  resetPassword(data: { email: string; token: string; newPassword: string }) {
    return this.http.post(this.baseUrl + 'account/reset-password', data, {
      responseType: 'text',
    });
  }

}
