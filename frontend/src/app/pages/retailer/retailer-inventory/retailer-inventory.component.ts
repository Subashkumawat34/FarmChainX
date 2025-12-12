// src/app/pages/retailer/retailer-inventory/retailer-inventory.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  items: InventoryItem[] = [
    {
      productId: 'p1',
      name: 'Organic Tomatoes',
      batchId: 'BATCH-TOM-001',
      qtyOnHand: 120,
      unit: 'kg',
      costPrice: 40,
      sellPrice: 60,
      expiryDate: '2026-01-05',
      supplier: 'GreenFoods',
    },
    {
      productId: 'p2',
      name: 'Potatoes',
      batchId: 'BATCH-POT-002',
      qtyOnHand: 18,
      unit: 'kg',
      costPrice: 20,
      sellPrice: 30,
      expiryDate: '2026-03-01',
      supplier: 'FarmCo',
    },
    {
      productId: 'p3',
      name: 'Spinach',
      batchId: 'BATCH-SP-003',
      qtyOnHand: 8,
      unit: 'kg',
      costPrice: 30,
      sellPrice: 45,
      expiryDate: '2025-12-20',
      supplier: 'Leafy Ltd',
    },
  ];

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
