import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './retailer-dashboard.component.html',
})
export class RetailerDashboardComponent implements AfterViewInit {
  @ViewChild('barChart', { static: true }) barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: true }) pieChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(private http: HttpClient) { }

  stats: any = {
    inventoryValue: 0,
    openPOs: 0,
    incomingShipments: 0,
    lowStock: 0
  };

  recentOrders: any[] = [];

  ngAfterViewInit(): void {
    this.fetchDashboardData();

    // Mock Chart Data (Backend endpoint /sales-chart exists but for now we keep this)
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

  fetchDashboardData() {
    // 1. Fetch Stats
    this.http.get<any>('/api/track/retailer/dashboard-stats').subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Failed to load stats', err)
    });

    // 2. Fetch Recent Orders (Pending Shipments essentially)
    this.http.get<any>('/api/track/pending?size=5').subscribe({
      next: (page) => {
        const orders = page.content || [];
        this.recentOrders = orders.map((o: any) => ({
          id: o.productId,
          supplier: 'Distributor', // 'Distributor ' + o.fromUserId
          items: 'Batch #' + o.productId,
          total: 0, // No price in log, need product lookup or ignore
          status: 'Pending'
        }));
      },
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  statusClass(s: string) {
    if (!s) return 'bg-gray-100 text-gray-800';
    switch (s.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'shipped':
        return 'bg-sky-100 text-sky-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  refresh() {
    this.fetchDashboardData();
  }

  export() {
    console.log('Export data');
  }
}
