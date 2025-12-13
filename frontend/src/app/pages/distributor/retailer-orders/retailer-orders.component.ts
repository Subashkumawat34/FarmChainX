import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-retailer-orders',
  templateUrl: './retailer-orders.component.html',
})
export class RetailerOrdersComponent {
  orders = [
    { retailer: 'FreshMart', items: 12, total: '₹1,20,000', status: 'Processing' },
    { retailer: 'VegHub', items: 8, total: '₹75,000', status: 'Delivered' },
  ];
}
