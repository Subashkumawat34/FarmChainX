import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { CartSidebarComponent } from '../cart-sidebar/cart-sidebar.component';

@Component({
    selector: 'app-consumer-marketplace',
    standalone: true,
    imports: [CommonModule, CartSidebarComponent],
    template: `
    <div class="space-y-6 relative">
      <app-cart-sidebar *ngIf="isCartOpen()" (close)="isCartOpen.set(false)"></app-cart-sidebar>

      <div class="flex items-center justify-between">
        <div>
           <h2 class="text-2xl font-bold text-slate-900">Marketplace</h2>
           <p class="text-slate-500">Fresh crops directly from farmers</p>
        </div>
        
        <!-- Cart Button -->
        <button (click)="isCartOpen.set(true)" class="relative p-2 text-gray-600 hover:text-emerald-600 border border-gray-200 rounded-xl bg-white shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span *ngIf="cartService.cartCount() > 0" class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {{ cartService.cartCount() }}
            </span>
            <span class="sr-only">View Cart</span>
        </button>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let product of products()" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div class="h-48 overflow-hidden bg-gray-100 relative group">
                <img [src]="product.imagePath || 'assets/placeholder.jpg'" [alt]="product.cropName" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm"
                     [ngClass]="getQualityClass(product.qualityGrade)">
                    Grade: {{ product.qualityGrade || 'N/A' }}
                </div>
            </div>
            
            <div class="p-4 flex-1 flex flex-col">
                <div class="mb-2">
                    <h3 class="font-bold text-gray-900 text-lg">{{ product.cropName }}</h3>
                    <p class="text-xs text-gray-500">Farmer: {{ product.farmerName || 'Verified Farmer' }}</p>
                </div>
                
                <div class="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                   Harvested: {{ product.harvestDate | date }}<br>
                   Location: {{ product.displayLocation || product.gpsLocation || 'Unknown' }}
                </div>
                
                <div class="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <span class="text-xl font-bold text-emerald-700">₹{{ product.price || 120 }}<span class="text-xs text-gray-400 font-normal">/kg</span></span>
                    <button (click)="addToCart(product)" class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-emerald-200 shadow-lg">
                        <span>Add</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="products().length === 0" class="col-span-full py-20 text-center">
            <div class="inline-block p-4 rounded-full bg-slate-100 mb-4">
                <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 class="text-lg font-medium text-slate-900">No crops available</h3>
            <p class="text-slate-500">Check back later for fresh harvest.</p>
        </div>
      </div>
    </div>
  `
})
export class ConsumerMarketplaceComponent implements OnInit {
    products = signal<any[]>([]);
    isCartOpen = signal(false);

    constructor(
        private productService: ProductService,
        public cartService: CartService
    ) { }

    ngOnInit() {
        this.productService.getConsumerMarketProducts().subscribe({
            next: (data) => this.products.set(data),
            error: (err) => console.error('Market load error', err)
        });
    }

    addToCart(product: any) {
        this.cartService.addToCart(product);
        this.isCartOpen.set(true);
    }

    getQualityClass(grade: string): string {
        if (!grade) return 'text-slate-600';
        if (grade.includes('A')) return 'text-emerald-600';
        if (grade.includes('B')) return 'text-yellow-600';
        return 'text-orange-600';
    }
}
