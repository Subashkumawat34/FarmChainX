import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-provenance-viewer',
  templateUrl: './provenance-viewer.component.html',
})
export class ProvenanceViewerComponent {
  searchUuid: string = '';
  product: any = null;
  chain: any[] = [];
  error: string = '';

  constructor(private http: HttpClient) { }

  verify() {
    if (!this.searchUuid.trim()) return;
    this.error = '';
    this.product = null;
    this.chain = [];

    this.http.get<any>('/api/retailer/provenance/' + this.searchUuid).subscribe({
      next: (data) => {
        this.product = data.product;
        this.chain = data.chain;
      },
      error: (err) => {
        console.error('Verification failed', err);
        this.error = 'Product not found or invalid UUID';
      }
    });
  }
}
