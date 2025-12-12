// src/app/pages/retailer/retailer-dashboard/retailer-dashboard.component.ts
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-retailer-dashboard',
  templateUrl: './retailer-dashboard.component.html',
})
export class RetailerDashboardComponent implements AfterViewInit {
  @ViewChild('barChart', { static: true }) barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: true }) pieChartRef!: ElementRef<HTMLCanvasElement>;

  inventoryValue = 124500;
  openPOs = 6;
  incomingShipments = 3;
  lowStock = 4;

  recentOrders = [
    { id: 'PO-20251201-01', supplier: 'GreenFoods', items: 3, total: 2400, status: 'Shipped' },
    { id: 'PO-20251202-02', supplier: 'SikarFarm', items: 5, total: 4300, status: 'Processing' },
    { id: 'PO-20251203-03', supplier: 'RiverHarvest', items: 2, total: 1200, status: 'Delivered' },
  ];

  ngAfterViewInit(): void {
    // Bar chart
    const barCtx = this.barChartRef.nativeElement.getContext('2d')!;
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Dec 6', 'Dec 7', 'Dec 8', 'Dec 9', 'Dec 10', 'Dec 11', 'Dec 12'],
        datasets: [
          { label: 'Sales (kg)', data: [120, 150, 90, 200, 130, 170, 190], borderRadius: 6 },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });

    // Pie chart
    const pieCtx = this.pieChartRef.nativeElement.getContext('2d')!;
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Tomatoes', 'Potatoes', 'Onions', 'Leafy Greens'],
        datasets: [{ data: [45, 25, 20, 10] }],
      },
      options: { responsive: true },
    });
  }

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

  refresh() {
    // placeholder for refresh action - wire to API later
    console.log('Refresh dashboard');
  }

  export() {
    console.log('Export data');
  }
}
