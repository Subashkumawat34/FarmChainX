// src/app/pages/retailer/retailer-shipments/retailer-shipments.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Shipment {
  id: string;
  carrier: string;
  eta: string;
  status: string;
  items: number;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-retailer-shipments',
  templateUrl: './retailer-shipments.component.html',
})
export class RetailerShipmentsComponent {
  shipments: Shipment[] = [
    { id: 'SHIP-9001', carrier: 'RoadEx', eta: '2025-12-14', status: 'In Transit', items: 12 },
    { id: 'SHIP-9002', carrier: 'AgriMove', eta: '2025-12-13', status: 'Picked', items: 4 },
    { id: 'SHIP-9003', carrier: 'QuickLog', eta: '2025-12-11', status: 'Delivered', items: 8 },
  ];

  statusClass(s: string) {
    switch (s) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'In Transit':
        return 'bg-sky-100 text-sky-800';
      case 'Picked':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  progress(s: string) {
    if (s === 'Picked') return 15;
    if (s === 'In Transit') return 60;
    if (s === 'Delivered') return 100;
    return 0;
  }
}
