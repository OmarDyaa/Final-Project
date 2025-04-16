import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HeaderComponent } from './layout/header/header.component';
import { ShopComponent } from './features/shop/shop.component';
import { HttpClient } from '@angular/common/http';
import { Product } from './models/product';
import { Pagination } from './models/pagination';
import { ShopService } from './core/services/shop.service';

@Component({
  selector: 'app-root',
  imports: [MatSlideToggleModule, HeaderComponent, RouterOutlet, ShopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title: string = 'Home';
}
