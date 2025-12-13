import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
})
export class InventoryComponent {
  items = [
    { product: 'Rice', stock: '120 tons', grade: 'A', location: 'Warehouse A' },
    { product: 'Wheat', stock: '80 tons', grade: 'B', location: 'Warehouse B' },
    { product: 'Onion', stock: '60 tons', grade: 'A', location: 'Warehouse C' },
  ];
}
