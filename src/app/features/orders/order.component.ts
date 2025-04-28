import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
  orders: Order[] = []
  ngOnInit(): void {
    this.orderService.getOrdersForUser().subscribe({
      next: orders => this.orders = orders 
    })
  }
}
