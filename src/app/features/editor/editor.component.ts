import { Component, effect, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminService } from '../../core/services/admin.service';
import { DialogService } from '../../core/services/dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';
import { ProductFormDialogComponent } from '../admin/product-form-dialog/product-form-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe } from '@angular/common';
import { ShopService } from '../../core/services/shop.service';
import { Pagination } from '../../shared/models/pagination';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductUpdateService } from '../../core/services/product-update.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    CurrencyPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit {
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  private dialog = inject(MatDialog);
  private snackbar = inject(SnackbarService);
  private shopService = inject(ShopService);
  private productUpdateService = inject(ProductUpdateService);

  productColumns = ['id', 'name', 'price', 'type', 'brand', 'stock', 'actions'];
  productDataSource = new MatTableDataSource<Product>();
  shopParams = new ShopParams();
  totalProducts = 0;
  loading = false;

  constructor() {
    // Setup effect to handle product updates
    effect(() => {
      const updatedProduct = this.productUpdateService.getProductUpdates()();
      if (updatedProduct) {
        // Update the data in the table
        const currentData = this.productDataSource.data;
        const index = currentData.findIndex((p) => p.id === updatedProduct.id);
        if (index !== -1) {
          currentData[index] = updatedProduct;
          this.productDataSource.data = [...currentData];
        }
        this.productUpdateService.clearUpdate();
      }
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    if (this.shopService.brands.length === 0) {
      this.shopService.getBrands();
    }
    if (this.shopService.types.length === 0) {
      this.shopService.getTypes();
    }
  }

  loadProducts() {
    this.loading = true;
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (response: Pagination<Product>) => {
        if (response.data) {
          this.productDataSource.data = response.data;
          this.totalProducts = response.count;
        }
      },
      error: (error) => this.snackbar.error('Failed to load products'),
      complete: () => (this.loading = false),
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
      }
      // } else {
      //   // Create new product
      //   this.adminService.createProduct(result).subscribe({
      //     next: (newProduct) => {
      //       this.loadProducts();
      //       this.snackbar.success('Product created successfully');
      //       this.productUpdateService.notifyProductUpdate(newProduct);
      //     },
      //     error: (error) => this.snackbar.error('Failed to create product'),
      //   });
      // }
    }
  }
}
