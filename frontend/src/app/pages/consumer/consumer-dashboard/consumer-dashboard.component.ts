import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { CartSidebarComponent } from '../cart-sidebar/cart-sidebar.component';

Chart.register(...registerables);

@Component({
  selector: 'app-consumer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CartSidebarComponent],
  templateUrl: './consumer-dashboard.component.html',
})
export class ConsumerDashboardComponent implements AfterViewInit, OnInit {
  @ViewChild('spendChart') spendChartRef!: ElementRef;

  userProfile = {
    name: 'Consumer',
    memberSince: 'Jan 2024',
    location: 'India',
    ecoPoints: 450
  };

  stats = {
    totalScans: 24,
    verifiedProducts: 22,
    carbonOffset: '12kg',
    localSupport: '₹8,500'
  };

  recentScans = [
    { id: 'BATCH-101', product: 'Organic Wheat', date: '2 hrs ago', status: 'Verified', image: 'assets/wheat.jpg' },
    { id: 'BATCH-105', product: 'Fresh Tomato', date: '1 day ago', status: 'Verified', image: 'assets/tomato.jpg' },
    { id: 'BATCH-99', product: 'Basmati Rice', date: '3 days ago', status: 'Suspicious', image: 'assets/rice.jpg' }
  ];

  products = signal<any[]>([]);
  isCartOpen = signal(false);

  constructor(
    public cartService: CartService,
    private productService: ProductService,
    private authService: AuthService
  ) {
    this.userProfile.name = this.authService.getName() || 'Consumer';
  }

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    if (this.spendChartRef) {
      this.initSpendChart();
    }
  }

  loadProducts() {
    // We still load products for dashboard summary if needed
    this.productService.getMarketProducts().subscribe({
      next: (data) => {
        this.products.set(data.slice(0, 4)); // Show only 4 recent on dashboard
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.isCartOpen.set(true);
  }

  initSpendChart() {
    const ctx = this.spendChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Vegetables', 'Grains', 'Fruits', 'Dairy'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: [
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#3B82F6'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: '75%',
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }

  getStatusColor(status: string): string {
    return status === 'Verified' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50';
  }
}
