import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProductService } from '../../../services/product.service';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe],
  selector: 'app-retailer-shipments',
  templateUrl: './retailer-shipments.component.html',
})
export class RetailerShipmentsComponent implements OnInit {
  shipments: any[] = [];
  loading = true;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.fetchShipments();
  }

  fetchShipments() {
    this.loading = true;
    this.productService.getPendingShipments().subscribe({
      next: (data) => {
        // Backend returns Page object
        this.shipments = data.content || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load shipments', err);
        this.loading = false;
      }
    });
  }

  confirmReceipt(shipment: any) {
    if (confirm('Confirm that you have physically received this shipment?')) {
      const location = "Retailer Store (Received)";
      this.productService.confirmReceipt(shipment.productId, location).subscribe({
        next: () => {
          alert('✅ Receipt Confirmed! Product is now in your Inventory.');
          this.fetchShipments();
        },
        error: (err) => {
          alert('Error confirming receipt: ' + err.error?.error || err.message);
        }
      });
    }
  }
}
