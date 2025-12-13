import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-order-detail',
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent {
  order = {
    orderId: 'ORD-2045',
    retailer: 'FreshMart',
    items: [
      { product: 'Rice', quantity: '10 tons', price: '₹4,00,000' },
      { product: 'Wheat', quantity: '8 tons', price: '₹2,56,000' },
    ],
    totalAmount: '₹6,56,000',
    deliveryAddress: 'Delhi NCR',
    status: 'In Transit',
    expectedDelivery: '15 Dec 2025',
  };
}
