import { Component, OnInit, ViewChild } from '@angular/core';
import { ParcelService } from '../services/parcel.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export interface Parcel {
  sku: string;
  description: string;
  streetAddress: string;
  town: string;
  country: string;
  deliveryDate: string;
}

@Component({
  selector: 'parcel-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './parcel-list.component.html',
  styleUrls: ['./parcel-list.component.css'],
})
export class ParcelListComponent implements OnInit {
  pageSize = 20;
  displayedColumns = [
    'sku',
    'description',
    'streetAddress',
    'town',
    'country',
    'deliveryDate',
  ];
  parcels: Parcel[] = [];

  filters = this.formBuilder.group({
    country: [''],
    description: [''],
  });

  @ViewChild('paginatorTop')
  paginatorTop: MatPaginator = {} as MatPaginator;
  @ViewChild('paginatorBottom')
  paginatorBottom: MatPaginator = {} as MatPaginator;

  progressBarIsVisible = false;

  constructor(
    private parcelService: ParcelService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadParcels();
  }

  setFormLoadingState(isLoading: boolean, goToFirstPage: boolean = false) {
    this.progressBarIsVisible = isLoading;
    this.paginatorTop.disabled = isLoading;
    this.paginatorBottom.disabled = isLoading;

    if (goToFirstPage) {
      this.paginatorTop.pageIndex = 0;
      this.paginatorBottom.pageIndex = 0;
    }
  }

  resetFilter(filter: string) {
    this.filters.patchValue({ [filter]: '' });
    this.loadParcels();
  }

  loadParcels(page: number = 0) {
    // Show progress bar and disable pagination while loading
    this.setFormLoadingState(true, page === 0);

    // TODO: Simulate a slow network request (remove this in production code)
    setTimeout(() => {
      this.parcelService.getParcels(this.filters.value, page).subscribe({
        next: (data) => {
          this.parcels = data.slice(0, this.pageSize);

          if (data.length <= this.pageSize) {
            this.paginatorTop.length = 0;
            this.paginatorBottom.length = 0;
          } else {
            this.paginatorTop.length = (page + 1) * this.pageSize + 1;
            this.paginatorBottom.length = (page + 1) * this.pageSize + 1;
          }
        },
        error: (error) => {
          console.error('Error occurred when fetching parcels:', error);
        },
        complete: () => {
          // Hide progress bar and enable pagination after loading
          this.setFormLoadingState(false);
        },
      });
    }, 2000);
  }

  onPageChange(event: any, paginator: 'top' | 'bottom') {
    if (paginator === 'top') {
      this.paginatorBottom.pageIndex = event.pageIndex;
    } else {
      this.paginatorTop.pageIndex = event.pageIndex;
    }

    this.loadParcels(event.pageIndex);
  }
}
