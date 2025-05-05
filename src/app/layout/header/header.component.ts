import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { CartService } from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { IsAdminDirective } from '../../shared/directives/is-admin.directive';
import { IsUserDirective } from '../../shared/directives/is-user.directive';
import { NgIf } from '@angular/common';
import { IsLoggedOutDirective } from '../../shared/directives/is-loggedout.directive';
import { IsEditorDirective } from '../../shared/directives/is-editor.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    MatBadge,
    RouterLink,
    RouterLinkActive,
    MatProgressBar,
    MatMenuTrigger,
    MatMenu,
    MatDivider,
    MatMenuItem,
    IsAdminDirective,
    IsUserDirective,
    IsEditorDirective,
    NgIf,
    IsLoggedOutDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  // Make change detection OnPush to have better control over when change detection runs
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, AfterViewInit {
  busyService = inject(BusyService);
  cartService = inject(CartService);
  accountService = inject(AccountService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Track cart item count locally
  cartItemCount = 0;

  constructor() {
    // Listen for cart changes and update our local property
    effect(() => {
      // Fix TypeScript error by ensuring the value is always a number
      this.cartItemCount = this.cartService.itemCount() ?? 0;
      // We don't need setTimeout here anymore since we're using OnPush change detection
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    // No need for this with OnPush change detection strategy
  }

  ngAfterViewInit(): void {
    // Run change detection once after view initialization to ensure everything is rendered correctly
    this.cdr.detectChanges();
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
