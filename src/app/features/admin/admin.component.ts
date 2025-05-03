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
import {
  MatSlideToggleModule,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { Order } from '../../shared/models/order';
import { AdminService } from '../../core/services/admin.service';
import { OrderParams } from '../../shared/models/orderParams';
import { DialogService } from '../../core/services/dialog.service';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';
import { ShopService } from '../../core/services/shop.service';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { SnackbarService } from '../../core/services/snackbar.service';
import { User } from '../../shared/models/user';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { catchError, finalize, of } from 'rxjs';
import { ProductUpdateService } from '../../core/services/product-update.service';

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
    MatSlideToggleModule,
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
  private productUpdateService = inject(ProductUpdateService);

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

  // User management properties
  userColumns = ['email', 'userName', 'name', 'roles'];
  userDataSource = new MatTableDataSource<any>();
  statsColumns = [
    'allUsersCount',
    'adminsCount',
    'editorsCount',
    'customersCount',
  ];
  userStats = {
    allUsersCount: 0,
    adminsCount: 0,
    editorsCount: 0,
    customersCount: 0,
  };

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
    this.loadUsers();
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
          next: (updatedProduct) => {
            this.loadProducts();
            this.snackbar.success('Product updated successfully');
            this.productUpdateService.notifyProductUpdate(updatedProduct);
          },
          error: (error) => this.snackbar.error('Failed to update product'),
        });
      } else {
        // Create new product
        this.adminService.createProduct(result).subscribe({
          next: (newProduct) => {
            this.loadProducts();
            this.snackbar.success('Product created successfully');
            this.productUpdateService.notifyProductUpdate(newProduct);
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

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.userStats = {
          allUsersCount: response.allUsersCount,
          adminsCount: response.adminsCount,
          editorsCount: response.editorsCount,
          customersCount: response.customersCount,
        };
        this.userDataSource.data = response.users;
      },
      error: (error) => this.snackbar.error('Failed to load users'),
    });
  }

  async openUserDialog() {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      this.adminService.addUser(result).subscribe({
        next: (success) => {
          if (success) {
            this.snackbar.success('User created successfully');
            this.loadUsers();
          } else {
            this.snackbar.error('Failed to create user');
          }
        },
      });
    }
  }
}
