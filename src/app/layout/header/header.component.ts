import { Component, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import { AccountService } from '../../core/services/account.service';
import { CartService } from '../../core/services/cart.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatButton,
    MatBadge,
    RouterLink,
    RouterLinkActive,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatDivider,
    MatProgressBar,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  busyService = inject(BusyService);
  cartservice = inject(CartService);
  accountService = inject(AccountService);
  private router = inject(Router);
  
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        this.router.navigateByUrl('/');
      },
    });
  }
}
