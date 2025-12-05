import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

/**
 * Interface defining the expected structure of a promotion request.
 */
interface Request {
  id: number;
  user: {
    name: string;
    email: string;
    // Add other user details if available, like primaryRole, etc.
  };
  requestedAt: string; // ISO date string
}

interface Toast {
  message: string;
  color: 'success' | 'danger';
}

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-promotion-requests.html',
  styleUrls: ['./admin-promotion-requests.scss'],
  selector: 'app-admin-promotion-requests'
})
export class AdminPromotionRequests implements OnInit {
  requests: Request[] = [];
  loading = true;
  isProcessingId: number | null = null; // ID of the request currently being processed

  // Modal state
  selected: Request | null = null;
  rejecting: Request | null = null;

  // Toast state
  currentToast: Toast | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  // --- Data & State Management ---

  loadRequests(): void {
    this.loading = true;
    this.http.get<Request[]>('/api/admin/promotion-requests').subscribe({
      next: data => {
        // Ensure requestedAt is treated as a Date string for sorting/display
        this.requests = data.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showToast('Failed to load requests.', 'danger');
        console.error('API Error:', err);
      }
    });
  }

  openDetails(req: Request) {
    this.selected = req;
  }

  showRejectModal(req: Request) {
    this.rejecting = req;
  }

  // --- API Actions ---

  approve(id: number): void {
    this.isProcessingId = id;
    this.http.post(`/api/admin/promotion-requests/${id}/approve`, {}).subscribe({
      next: () => {
        this.showToast('Admin access granted 🎉', 'success');
        this.loadRequests(); 
        this.selected = null; 
        this.isProcessingId = null;
      },
      error: () => {
        this.showToast('Approval failed.', 'danger');
        this.isProcessingId = null;
      }
    });
  }

  reject(id: number): void {
    this.isProcessingId = id;
    this.http.post(`/api/admin/promotion-requests/${id}/reject`, {}).subscribe({
      next: () => {
        this.showToast('Request rejected ❌', 'danger');
        this.loadRequests(); 
        this.rejecting = null;
        this.isProcessingId = null;
      },
      error: () => {
        this.showToast('Rejection failed.', 'danger');
        this.isProcessingId = null;
      }
    });
  }

  // --- UI Helpers ---

  /**
   * Manages the toast notification state.
   */
  showToast(message: string, color: 'success' | 'danger') {
    this.currentToast = { message, color };
    setTimeout(() => {
      this.currentToast = null;
    }, 3000);
  }
}