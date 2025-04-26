import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Address, User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  //! Will replace it with envirment.apiUrl video 142
  baseUrl = 'https://localhost:5001/api/';
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
    return this.http.get<User>(this.baseUrl + 'account/user-info').subscribe({
      next: (user) => this.currentUser.set(user),
    });
  }
  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {});
  }
  updateAddres(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address);
  }
}
