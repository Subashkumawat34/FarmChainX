import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
  shipments: Shipment[] = [];

  constructor(private http: HttpClient) {
    this.fetchShipments();
  }

  fetchShipments() {
    this.http.get<any[]>('/api/retailer/shipments').subscribe({
      next: (data) => {
        this.shipments = data;
      },
      error: (err) => console.error('Failed to load shipments', err)
    });
  }

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
