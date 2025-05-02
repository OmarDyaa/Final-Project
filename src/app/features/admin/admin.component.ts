import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLabel,
  MatSelectChange,
  MatSelectModule,
} from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Order } from '../../shared/models/order';
import { AdminService } from '../../core/services/admin.service';
import { OrderParams } from '../../shared/models/orderParams';
import { DialogService } from '../../core/services/dialog.service';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';
import { ShopService } from '../../core/services/shop.service';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    DatePipe,
    CurrencyPipe,
    MatLabel,
    MatTooltipModule,
    MatTabsModule,
    RouterLink,
    MatDialogModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  private shopService = inject(ShopService);
  private dialog = inject(MatDialog);
  private snackbar = inject(SnackbarService);

  // Order management properties
  displayedColumns = [
    'id',
    'buyerEmail',
    'orderDate',
    'total',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Order>();
  orderParams = new OrderParams();
  totalItems = 0;
  statusOptions = [
    'All',
    'PaymentReceived',
    'PaymentMismatch',
    'Refunded',
    'Pending',
  ];

  // Product management properties
  productColumns = ['id', 'name', 'price', 'type', 'brand', 'stock', 'actions'];
  productDataSource = new MatTableDataSource<Product>();
  shopParams = new ShopParams();
  totalProducts = 0;
  types: string[] = [];

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
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

  async openConfirmDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm refund',
      'Are you sure you want to issue this refund? This cannot be undone'
    );

    if (confirmed) this.refundOrder(id);
  }

  refundOrder(id: number) {
    this.adminService.refundOrder(id).subscribe({
      next: (order) => {
        this.dataSource.data = this.dataSource.data.map((o) =>
          o.id === id ? order : o
        );
      },
    });
  }

  loadProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (response) => {
        if (response.data) {
          this.productDataSource.data = response.data;
          this.totalProducts = response.count;
        }
      },
    });
  }

  onProductPageChange(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.loadProducts();
  }

  async openProductDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: product || {},
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      if (product) {
        // Update existing product
        this.adminService.updateProduct(result).subscribe({
          next: () => {
            this.loadProducts();
            this.snackbar.success('Product updated successfully');
          },
          error: (error) => this.snackbar.error('Failed to update product'),
        });
      } else {
        // Create new product
        this.adminService.createProduct(result).subscribe({
          next: () => {
            this.loadProducts();
            this.snackbar.success('Product created successfully');
          },
          error: (error) => this.snackbar.error('Failed to create product'),
        });
      }
    }
  }

  async deleteProduct(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm deletion',
      'Are you sure you want to delete this product? This cannot be undone.'
    );

    if (confirmed) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.snackbar.success('Product deleted successfully');
        },
        error: (error) => this.snackbar.error('Failed to delete product'),
      });
    }
  }

  sortProducts(sortType: string) {
    this.shopParams.sort = sortType;
    this.shopParams.pageNumber = 1;
    this.loadProducts();
  }
}
