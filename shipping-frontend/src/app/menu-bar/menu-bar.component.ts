import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

export interface MenuItem {
  name: string;
  label: string;
}

@Component({
  selector: 'menu-bar',
  standalone: true,
  imports: [MatToolbarModule, CommonModule, MatButton],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css',
})
export class MenuBarComponent {
  menuItems = [
    { name: 'add-parcel', label: 'Add Parcel' },
    { name: 'parcel-list', label: 'List Parcels' },
  ];

  @Input() activeComponent: MenuItem = this.menuItems[0];
  @Output() activeComponentChange = new EventEmitter<MenuItem>();

  onMenuButtonClick(menuItem: MenuItem) {
    this.activeComponentChange.emit(menuItem);
  }
}
