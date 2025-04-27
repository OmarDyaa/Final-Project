import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Address, User } from '../../shared/models/user';
import { environment } from '../../../environments/environment.development';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', values, {
      params,
    });
  }
  register(values: any) {
    return this.http.post((this.baseUrl = 'account/register'), values);
  }
  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-info').pipe(
      map((user) => {
        this.currentUser.set(user);
      })
    );
  }
  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {});
  }
  updateAddres(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address);
  }
  getAuthState() {
    return this.http.get<{ isAuthenticated: boolean }>(
      this.baseUrl + 'account/auth-status'
    );
  }
}
