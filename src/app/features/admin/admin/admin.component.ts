import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Order } from '@stripe/stripe-js';
import { AdminService } from '../../../core/services/admin.service';
import { OrderParams } from '../../../shared/models/orderParams';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatLabel } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-admin',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButton,
    MatIcon,
    MatSelectModule,
    DatePipe,
    CurrencyPipe,
    MatLabel,
    MatTooltipModule,
    MatTabsModule,
    RouterLink,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'buyerEmail',
    'orderDate',
    'total',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Order>([]);
  private adminService = inject(AdminService);
  orderParams = new OrderParams();
  totalItems = 0;
  statusOptions = [
    'All',
    'PaymentReceived',
    'PaymentMismatch',
    'Refunded',
    'Pending',
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: (response) => {
        if (response.data) {
          this.dataSource.data = response.data;
          this.totalItems = response.count;
        }
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }
  onFilterSelect(event: MatSelectChange) {
    this.orderParams.filter = event.value;
    this.orderParams.pageNumber = 1;
    this.loadOrders();
  }
}
