import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface InventoryItem {
  productId: string;
  name: string;
  batchId: string;
  qtyOnHand: number;
  unit: string;
  costPrice: number;
  sellPrice: number;
  expiryDate?: string;
  supplier: string;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-retailer-inventory',
  templateUrl: './retailer-inventory.component.html',
})
export class RetailerInventoryComponent {
  lowThreshold = 20;
  items: InventoryItem[] = [];

  constructor(private http: HttpClient) {
    this.fetchInventory();
  }

  fetchInventory() {
    this.http.get<any[]>('/api/retailer/inventory').subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (err) => console.error('Failed to load inventory', err)
    });
  }

  receive(item: InventoryItem) {
    // placeholder: open receive dialog / mark as received
    console.log('Receive', item);
    alert(`Received ${item.name} (batch ${item.batchId})`);
  }

  adjust(item: InventoryItem) {
    // placeholder: open adjust modal
    console.log('Adjust', item);
    alert(`Adjust ${item.name} inventory`);
  }

  exportCsv() {
    // lightweight CSV export of current items (dummy)
    const header = [
      'productId',
      'name',
      'batchId',
      'qtyOnHand',
      'unit',
      'costPrice',
      'sellPrice',
      'supplier',
      'expiryDate',
    ];
    const csv = [header.join(',')]
      .concat(
        this.items.map((i) =>
          [
            i.productId,
            i.name,
            i.batchId,
            i.qtyOnHand,
            i.unit,
            i.costPrice,
            i.sellPrice,
            i.supplier,
            i.expiryDate || '',
          ]
            .map((v) => `"${v}"`)
            .join(',')
        )
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
