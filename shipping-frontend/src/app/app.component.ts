import { Component } from '@angular/core';
import { MenuBarComponent, MenuItem } from './menu-bar/menu-bar.component';
import { AddParcelComponent } from './add-parcel/add-parcel.component';
import { ParcelListComponent } from './parcel-list/parcel-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MenuBarComponent,
    AddParcelComponent,
    ParcelListComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  activeComponent: MenuItem = { name: 'add-parcel', label: 'Add Parcel' };
}
