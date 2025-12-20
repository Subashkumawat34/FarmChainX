import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-farmer-procurement',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl: './farmer-procurement.component.html'
})
export class FarmerProcurementComponent implements OnInit {
  availableCrops: any[] = [];
  loading = true;
  buyingId: number | null = null;

  constructor(private http: HttpClient, private productService: ProductService) { }

  ngOnInit(): void {
    this.loadMarketplace();
  }

  loadMarketplace() {
    this.loading = true;
    this.productService.getMarketProducts().subscribe({
      next: (res) => {
        this.availableCrops = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Marketplace error', err);
        this.loading = false;
      }
    });
  }

  buyCrop(crop: any) {
    if (confirm(`Confirm purchase of ${crop.cropName} for ₹${this.estimatePrice(crop)}?`)) {
      this.buyingId = crop.id;

      const location = "Distributor Warehouse (Initial)";
      this.productService.pickupProduct(crop.id, location).subscribe({
        next: (res) => {
          alert(`✅ Successfully Acquired! \nOwnership of Batch #${crop.id} transferred to you.`);
          // Refresh list to remove the item
          this.loadMarketplace();
          this.buyingId = null;
        },
        error: (err) => {
          console.error(err);
          alert("Failed to acquire product: " + (err.error?.error || err.message));
          this.buyingId = null;
        }
      });
    }
  }

  estimatePrice(crop: any): number {
    if (crop.price && crop.price > 0) return crop.price;
    // Mock price calc based on quality (fallback)
    let base = 2000;
    if (crop.qualityGrade?.includes('A')) base *= 1.5;
    if (crop.qualityGrade?.includes('B')) base *= 1.2;
    return base;
  }

  getQualityColor(grade: string): string {
    if (!grade) return 'bg-gray-100 text-gray-800';
    const g = grade.toUpperCase();
    if (g.includes('A') || g.includes('A+')) return 'bg-emerald-100 text-emerald-800';
    if (g.includes('B')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  }
}
