import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit {
  inventoryItems: any[] = [];
  retailers: any[] = [];
  totalValue = 0;

  showDispatchModal = false;
  selectedItem: any = null;
  selectedRetailerId: number | null = null;
  dispatchLocation = 'Distributor Warehouse';

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadInventory();
    this.loadRetailers();
  }

  loadInventory() {
    this.productService.getDistributorInventory().subscribe(items => {
      this.inventoryItems = items || [];
      this.totalValue = this.inventoryItems.reduce((acc, item) => acc + (item.value || 0), 0);
    });
  }

  loadRetailers() {
    this.productService.getRetailers().subscribe(r => this.retailers = r || []);
  }

  getGradeColor(grade: string): string {
    if (!grade) return 'bg-gray-100 text-gray-800';
    if (grade.includes('A')) return 'bg-emerald-100 text-emerald-800';
    if (grade.includes('B')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  }

  getStatusColor(status: string): string {
    if (status === 'In Stock') return 'bg-blue-100 text-blue-800';
    if (status === 'Reserved') return 'bg-purple-100 text-purple-800';
    if (status === 'Low Stock') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  }

  openDispatch(item: any) {
    this.selectedItem = item;
    this.showDispatchModal = true;
  }

  closeModal() {
    this.showDispatchModal = false;
    this.selectedItem = null;
    this.selectedRetailerId = null;
  }

  confirmDispatch() {
    if (!this.selectedItem || !this.selectedRetailerId) return;

    this.productService.handoverToRetailer(this.selectedItem.productId, this.selectedRetailerId, this.dispatchLocation)
      .subscribe({
        next: () => {
          alert('✅ Dispatched successfully to retailer!');
          this.closeModal();
          this.loadInventory();
        },
        error: (err) => {
          alert('Error: ' + err.error?.error || err.message);
        }
      });
  }
}
