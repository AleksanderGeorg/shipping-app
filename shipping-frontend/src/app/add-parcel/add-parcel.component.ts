import { Component, ViewChild } from '@angular/core';
import { ParcelService } from '../services/parcel.service';
import {
  FormBuilder,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'add-parcel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-parcel.component.html',
  styleUrl: './add-parcel.component.css',
})
export class AddParcelComponent {
  parcel = this.formBuilder.group({
    sku: ['', [Validators.required]],
    description: [''],
    streetAddress: ['', [Validators.required]],
    town: ['', [Validators.required]],
    country: ['', [Validators.required]],
    deliveryDate: ['', [Validators.required]],
  });

  message: { type: 'success' | 'error'; text: string } | null = null;
  submitButtonLoading = false;

  @ViewChild(FormGroupDirective)
  formGroupDirective: FormGroupDirective = {} as FormGroupDirective;

  constructor(
    private parcelService: ParcelService,
    private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    // Set the date format to dd/mm/yyyy
    this.dateAdapter.setLocale('en-gb');
  }

  trim(event: Event) {
    const target = event.target as HTMLInputElement;
    this.parcel.get(target.name)?.setValue(target.value.trim());
  }

  onSubmit() {
    this.submitButtonLoading = true;
    this.message = null;

    // TODO: Simulate a slow network request (remove this in production code)
    setTimeout(() => {
      this.parcelService.addParcel(this.parcel.value).subscribe({
        next: (data) => {
          if (data.name) {
            switch (data.name) {
              case 'duplicate-sku':
                this.parcel.controls.sku.setErrors({ duplicateSku: true });
                break;
              case 'missing-field-values':
                Object.keys(this.parcel.controls).forEach((key) => {
                  this.parcel.get(key)?.updateValueAndValidity();
                });
                break;
              default:
                break;
            }

            this.message = {
              type: 'error',
              text: data.message,
            };
            return;
          }

          this.message = {
            type: 'success',
            text: 'Parcel added successfully',
          };
          this.formGroupDirective.resetForm();
        },
        error: (error) =>
          console.error('Error occurred when adding parcel:', error),
        complete: () => (this.submitButtonLoading = false),
      });
    }, 2000);
  }
}
