import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { TestErrorComponent } from './features/test-error/test-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { CartComponent } from './features/cart/cart.component';
import { authGuard } from './core/guards/auth.guard';
import { emptyCartGuard } from './core/guards/empty-cart.guard';
import { CheckoutSuccessComponent } from './features/checkout/checkout-success/checkout-success.component';
import { ProfileComponent } from './features/account/profile/profile.component';
import { OrderDetailedComponent } from './features/orders/order-detailed/order-detailed.component';
import { OrderComponent } from './features/orders/order.component';
import { orderCompleteGuard } from './core/guards/order-complete.guard';
import { AdminComponent } from './features/admin/admin.component';
import { adminGuard } from './core/guards/admin.guard';
import { editorGuard } from './core/guards/editor.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./features/checkout/routes').then((m) => m.checkoutRoutes),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/routes').then((m) => m.orderRoutes),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./features/account/routes').then((m) => m.accountRoutes),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/account/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },

  { path: 'test-error', component: TestErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component').then((c) => c.AdminComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'editor',
    loadComponent: () =>
      import('./features/editor/editor.component').then(
        (c) => c.EditorComponent
      ),
    canActivate: [authGuard, editorGuard],
  },

  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
