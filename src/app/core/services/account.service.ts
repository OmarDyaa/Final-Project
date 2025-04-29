import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Address, User } from '../../shared/models/user';
import { environment } from '../../../environments/environment.development';
import { map, tap } from 'rxjs';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private signalrService = inject(SignalrService);
  currentUser = signal<User | null>(null);
  isAdmin = computed(() => {
    const roles = this.currentUser()?.roles;
    return Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin';
  });

  constructor() {
    // Load user from localStorage on service initialization
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
      this.signalrService.createHubConnection();
    }
  }

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http
      .post<User>(this.baseUrl + 'login', values, {
        params,
      })
      .pipe(
        tap(() => {
          this.signalrService.createHubConnection();
          // Get user info after successful login
          this.getUserInfo().subscribe();
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
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      })
    );
  }

  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {}).pipe(
      tap(() => {
        this.signalrService.stopHubConnection();
        this.currentUser.set(null);
        localStorage.removeItem('user');
      })
    );
  }

  updateAddress(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address).pipe(
      tap(() => {
        this.currentUser.update((user) => {
          if (user) {
            user.address = address;
          }
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
}
