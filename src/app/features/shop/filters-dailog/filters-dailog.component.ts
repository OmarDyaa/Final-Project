import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { MatDivider } from '@angular/material/divider';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters-dailog',
  imports: [
    MatDivider,
    MatSelectionList,
    MatListOption,
    MatButton,
    FormsModule,
  ],
  templateUrl: './filters-dailog.component.html',
  styleUrl: './filters-dailog.component.scss',
})
export class FiltersDailogComponent implements OnInit {
  shopService = inject(ShopService);
  private dailogRef = inject(MatDialogRef<FiltersDailogComponent>);
  data = inject(MAT_DIALOG_DATA);
  selectedBrands: string[] = this.data.selectedBrands;
  selectedTypes: string[] = this.data.selectedTypes;
  availableBrands: string[] = [];
  availableTypes: string[] = [];

  ngOnInit() {
    // Get brands
    this.shopService.getBrands().subscribe({
      next: (brands) => {
        this.availableBrands = brands;
      },
    });

    // Get types
    this.shopService.getTypes().subscribe({
      next: (types) => {
        this.availableTypes = types;
      },
    });
  }

  applyFilters() {
    this.dailogRef.close({
      selectedBrands: this.selectedBrands,
      selectedTypes: this.selectedTypes,
    });
  }
}
