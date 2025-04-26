import { Component, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
//import { BusyService } from '../../core/services/busy.service';

@Component({
  selector: 'app-header',
  imports: [MatIcon, MatButton, MatBadge, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  //busyservice = inject(BusyService);
  cartservice = inject(CartService);
}
