import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

type PrimaryRole = 'ADMIN' | 'FARMER' | 'DISTRIBUTOR' | 'RETAILER' | 'CONSUMER' | 'USER';

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  isAdmin: boolean;
  primaryRole: PrimaryRole;
  isPromoting?: boolean; // Tracks promotion status for button disabling
}

@Component({
  standalone: true,
  imports: [CommonModule],
  // Note: Template remains in './admin-users.html'
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
  selector: 'app-admin-users'
})
export class AdminUsers implements OnInit {
  users: User[] = [];
  isLoading: boolean = false; // Manages the loading spinner/state

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private normalizeRole(r: any): string {
    const val = (r?.name ?? r ?? '').toString().toUpperCase();
    return val.startsWith('ROLE_') ? val : `ROLE_${val}`;
  }

  private derivePrimaryRole(roles: string[]): PrimaryRole {
    const set = new Set(roles.map(this.normalizeRole));
    if (set.has('ROLE_ADMIN')) return 'ADMIN';
    if (set.has('ROLE_FARMER')) return 'FARMER';
    if (set.has('ROLE_DISTRIBUTOR')) return 'DISTRIBUTOR';
    if (set.has('ROLE_RETAILER')) return 'RETAILER';
    if (set.has('ROLE_CONSUMER')) return 'CONSUMER';
    return 'USER';
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<any[]>('/api/admin/users').subscribe({
      next: (data) => {
        this.users = data.map(u => {
          const roles = (u.roles ?? []).map((r: any) => this.normalizeRole(r));
          const isAdmin = roles.includes('ROLE_ADMIN');
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            roles,
            isAdmin,
            primaryRole: this.derivePrimaryRole(roles),
            isPromoting: false // Initialize state
          };
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.isLoading = false;
        alert('Could not load user data.');
      }
    });
  }

  /**
   * Generates Tailwind CSS classes for high-contrast role badges.
   */
  roleClass(role: PrimaryRole): string {
    // Colors are adjusted for maximum contrast (using -100 text on a dark background)
    // Added ring for definition.
    switch (role) {
      case 'ADMIN': return 'bg-purple-500/30 text-purple-100 ring-1 ring-purple-400/30';
      case 'FARMER': return 'bg-emerald-500/30 text-emerald-100 ring-1 ring-emerald-400/30';
      case 'DISTRIBUTOR': return 'bg-cyan-500/30 text-cyan-100 ring-1 ring-cyan-400/30';
      case 'RETAILER': return 'bg-amber-500/30 text-amber-100 ring-1 ring-amber-400/30';
      case 'CONSUMER': return 'bg-slate-500/30 text-slate-100 ring-1 ring-slate-400/30';
      default: return 'bg-gray-500/30 text-gray-100 ring-1 ring-gray-400/30';
    }
  }

  promote(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (!user || !confirm(`Are you sure you want to promote ${user.name} to Admin? This action cannot be undone.`)) return;

    user.isPromoting = true; // Set promoting state to disable the button
    
    this.http.post(`/api/admin/promote/${userId}`, {}).subscribe({
      next: () => {
        alert(`${user.name} promoted to Admin successfully!`);
        this.loadUsers(); // Reload to refresh data for all users
      },
      error: (err) => {
        user.isPromoting = false; // Reset state on error
        alert(err.error?.message || 'Promotion failed. Please try again.');
        console.error('Promotion error:', err);
      }
    });
  }
}