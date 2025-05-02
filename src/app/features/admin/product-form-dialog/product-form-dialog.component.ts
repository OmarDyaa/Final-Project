import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Product } from '../../../shared/models/product';
import { ShopService } from '../../../core/services/shop.service';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './product-form-dialog.component.html',
})
export class ProductFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProductFormDialogComponent>);
  shopService = inject(ShopService);
  data = inject(MAT_DIALOG_DATA) as Partial<Product>;

  productForm = this.fb.group({
    name: [this.data.name || '', Validators.required],
    description: [this.data.description || '', Validators.required],
    price: [this.data.price || 0, [Validators.required, Validators.min(0)]],
    brand: [this.data.brand || '', Validators.required],
    type: [this.data.type || '', Validators.required],
    quantityInStock: [
      this.data.quantityInStock || 0,
      [Validators.required, Validators.min(0)],
    ],
    pictureUrl: [this.data.pictureUrl || '', Validators.required],
  });

  ngOnInit() {
    // Load brands and types if not already loaded
    if (this.shopService.brands.length === 0) {
      this.shopService.getBrands();
    }
    if (this.shopService.types.length === 0) {
      this.shopService.getTypes();
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product = {
        ...this.productForm.value,
        id: this.data.id,
      };
      this.dialogRef.close(product);
    }
  }
}
