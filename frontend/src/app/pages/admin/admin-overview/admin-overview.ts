import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

/**
 * Interface defining the structure of the data expected from the backend.
 */
interface OverviewData {
  totalUsers: number;
  totalProducts: number;
  totalLogs: number;
  totalFeedbacks: number;
  
  salesVolume: number; 
  pendingOrders: number;
  newUsersToday: number;
  averageRating: number; 
}

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe], 
  templateUrl: './admin-overview.html',
  styleUrl: './admin-overview.scss',
  selector: 'app-admin-overview' 
})
export class AdminOverview implements OnInit {
  data?: OverviewData;
  isLoading: boolean = false;
  lastUpdated: Date = new Date();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.refreshData();
  }
  
  /**
   * Fetches the dashboard data from the API.
   */
  refreshData(): void {
    this.isLoading = true;
    this.http.get<OverviewData>('/api/admin/overview').subscribe({
      next: (res) => {
        this.data = res;
        this.lastUpdated = new Date();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load overview data', err);
        this.isLoading = false;
        // Simplified error alert for demonstration
        // alert('Failed to load dashboard data. Check console.'); 
      }
    });
  }

  /**
   * Helper function to format currency for the template.
   * Handles null/undefined input to prevent TS2532 in calling context.
   */
  formatCurrency(amount: number | undefined): string {
    // Check if amount is falsy (0 is okay, but null/undefined is not)
    if (amount === null || amount === undefined) return '$0';
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }

  /**
   * Helper function to format ratings.
   * Handles null/undefined input to prevent TS2532 in calling context.
   */
  formatRating(rating: number | undefined): string {
    if (rating === null || rating === undefined) return '0.00';
    return rating.toFixed(2);
  }
}