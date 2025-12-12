// src/app/pages/retailer/retailer-orders/retailer-orders.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order {
  id: string;
  supplier: string;
  items: number;
  total: number;
  createdAt: string;
  status: string;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-retailer-orders',
  templateUrl: './retailer-orders.component.html',
})
export class RetailerOrdersComponent {
  orders: Order[] = [
    {
      id: 'PO-20251209-001',
      supplier: 'GreenFoods',
      items: 10,
      total: 4200,
      createdAt: '2025-12-09',
      status: 'Processing',
    },
    {
      id: 'PO-20251207-002',
      supplier: 'RiverHarvest',
      items: 4,
      total: 1600,
      createdAt: '2025-12-07',
      status: 'Shipped',
    },
    {
      id: 'PO-20251205-003',
      supplier: 'SikarFarm',
      items: 6,
      total: 2500,
      createdAt: '2025-12-05',
      status: 'Delivered',
    },
  ];

  statusClass(s: string) {
    switch (s) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'Shipped':
        return 'bg-sky-100 text-sky-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  view(o: Order) {
    // open details modal or navigate to PO detail view (future)
    alert(`Open PO: ${o.id}`);
  }
}
