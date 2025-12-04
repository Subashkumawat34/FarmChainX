// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { catchError, delay, retryWhen, scan, throwError } from 'rxjs';

// @Component({
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './my-products.html'
// })
// export class MyProducts {
//   products: any[] = [];
//   loading = true;
//   retryMessage = '';
//   page = 0;
//   size = 9;
//   totalPages = 0;

//   farmerId: string | null = null;
//   totalItems = 0;

//   constructor(private http: HttpClient, private router: Router) {
//     this.load();
//   }

//   load(page: number = 0) {
//     this.loading = true;
//     this.retryMessage = '';

//     this.http.get<any>(`/api/products/my?page=${page}&size=${this.size}&sort=id,desc`)
//       .pipe(
//         retryWhen(errors =>
//           errors.pipe(
//             scan((retryCount) => {
//               retryCount++;
//               if (retryCount > 3) {
//                 throwError(() => new Error('Max retries reached'));
//               }
//               this.retryMessage = `🔁 Reconnecting... (Attempt ${retryCount} of 3)`;
//               return retryCount;
//             }, 0),
//             delay(1000)
//           )
//         ),
//         catchError(err => {
//           this.retryMessage = '';
//           this.loading = false;
//           alert('❌ Failed to load products after multiple attempts.');
//           return throwError(() => err);
//         })
//       )
//       .subscribe({
//         next: (res) => {
//           this.products = res?.content || [];
//           this.page = res?.number || 0;
//           this.totalPages = res?.totalPages || 1;
//           this.totalItems = res?.totalElements || this.products.length;
//           this.loading = false;
//           this.retryMessage = '';
//         }
//       });
//   }

//   nextPage() {
//     if (this.page < this.totalPages - 1) this.load(this.page + 1);
//   }

//   prevPage() {
//     if (this.page > 0) this.load(this.page - 1);
//   }

//   generateQr(id: number) {
//     this.http.post<any>(`/api/products/${id}/qrcode`, {}).subscribe({
//       next: (res) => {
//         const product = this.products.find(p => p.id === id)!;
//         const url = res.qrPath.startsWith('http')
//           ? res.qrPath
//           : `http://localhost:8080${res.qrPath}`;
//         const filename = this.generateFilename(product);

//         const link = document.createElement('a');
//         link.href = url;
//         link.download = filename;
//         link.click();

//         alert(`QR Generated & Downloaded: ${filename}`);
//         this.load(this.page);
//       },
//       error: (err) => alert(err.error?.message || 'Failed to generate QR')
//     });
//   }

//   downloadQr(id: number) {
//     const product = this.products.find(p => p.id === id);
//     if (!product?.qrCodePath) return;

//     const url = this.getQrUrl(product.qrCodePath);
//     const filename = this.generateFilename(product);

//     this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
//       const a = document.createElement('a');
//       a.href = window.URL.createObjectURL(blob);
//       a.download = filename;
//       a.click();
//     });
//   }

//   private generateFilename(product: any): string {
//     const cleanName = (product.cropName || 'Product')
//       .replace(/[^a-zA-Z0-9]+/g, '-')
//       .replace(/^-+|-+$/g, '');
//     return `QR_${cleanName}_${product.id}.png`;
//   }

//   getImageUrl(path: string): string {
//     return path?.startsWith('http') ? path : `http://localhost:8080${path}`;
//   }

//   getQrUrl(path: string): string {
//     return path?.startsWith('http') ? path : `http://localhost:8080${path}`;
//   }

//   formatDate(date: string | null): string {
//     if (!date) return 'Unknown Date';
//     return new Date(date).toLocaleDateString('en-US', {
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   }

//   getCropEmoji(name: string): string {
//     const n = (name || '').toLowerCase();
//     const map: Record<string, string> = {
//       onion: '🧅', tomato: '🍅', mango: '🥭', potato: '🥔', rice: '🌾',
//       banana: '🍌', apple: '🍎', orange: '🍊', grape: '🍇', wheat: '🌿',
//       corn: '🌽', carrot: '🥕', cucumber: '🥒', strawberry: '🍓', watermelon: '🍉'
//     };
//     return Object.keys(map).find(k => n.includes(k))
//       ? map[Object.keys(map).find(k => n.includes(k))!]
//       : '🌱';
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, delay, retryWhen, scan, throwError } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-products.html'
})
export class MyProducts {
  products: any[] = [];
  loading = true;
  retryMessage = '';
  page = 0;
  size = 9;
  totalPages = 0;

  farmerId: string | null = null;
  totalItems = 0;

  constructor(private http: HttpClient, private router: Router) {
    this.load();
  }

  load(page: number = 0) {
    this.loading = true;
    this.retryMessage = '';

    this.http.get<any>(`/api/products/my?page=${page}&size=${this.size}&sort=id,desc`)
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            scan((retryCount) => {
              retryCount++;
              if (retryCount > 3) {
                throwError(() => new Error('Max retries reached'));
              }
              this.retryMessage = `🔁 Reconnecting... (Attempt ${retryCount} of 3)`;
              return retryCount;
            }, 0),
            delay(1000)
          )
        ),
        catchError(err => {
          this.retryMessage = '';
          this.loading = false;
          alert('❌ Failed to load products after multiple attempts.');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (res) => {
          this.products = res?.content || [];
          this.page = res?.number || 0;
          this.totalPages = res?.totalPages || 1;
          this.totalItems = res?.totalElements || this.products.length;
          this.loading = false;
          this.retryMessage = '';
        }
      });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) this.load(this.page + 1);
  }

  prevPage() {
    if (this.page > 0) this.load(this.page - 1);
  }

  generateQr(id: number) {
    this.http.post<any>(`/api/products/${id}/qrcode`, {}).subscribe({
      next: (res) => {
        const product = this.products.find(p => p.id === id)!;
        const url = res.qrPath.startsWith('http')
          ? res.qrPath
          : `http://localhost:8080${res.qrPath}`;
        const filename = this.generateFilename(product);

        // Download the QR code automatically
        this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(a.href);
        });

        // Show success message with highlight
        this.showSuccessMessage(id, filename);

        // Reload to update the product with QR code path
        this.load(this.page);
      },
      error: (err) => alert(err.error?.message || 'Failed to generate QR')
    });
  }

  private showSuccessMessage(productId: number, filename: string) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-bounce';
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl">✅</span>
        <div>
          <p class="font-bold">QR Code Generated!</p>
          <p class="text-sm">${filename}</p>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    // Highlight the product card
    setTimeout(() => {
      const productCard = document.querySelector(`[data-product-id="${productId}"]`);
      if (productCard) {
        productCard.classList.add('ring-4', 'ring-emerald-500', 'scale-105');
        setTimeout(() => {
          productCard.classList.remove('ring-4', 'ring-emerald-500', 'scale-105');
        }, 2000);
      }
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  downloadQr(id: number) {
    const product = this.products.find(p => p.id === id);
    if (!product?.qrCodePath) return;

    const url = this.getQrUrl(product.qrCodePath);
    const filename = this.generateFilename(product);

    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(a.href);

      // Show download confirmation
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-xl z-50';
      notification.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-xl">⬇️</span>
          <span class="font-semibold">Downloaded: ${filename}</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2500);
    });
  }

  viewQr(qrPath: string) {
    const url = this.getQrUrl(qrPath);
    window.open(url, '_blank');
  }

  private generateFilename(product: any): string {
    const cleanName = (product.cropName || 'Product')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `QR_${cleanName}_${product.id}.png`;
  }

  getImageUrl(path: string): string {
    return path?.startsWith('http') ? path : `http://localhost:8080${path}`;
  }

  getQrUrl(path: string): string {
    return path?.startsWith('http') ? path : `http://localhost:8080${path}`;
  }

  formatDate(date: string | null): string {
    if (!date) return 'Unknown Date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getCropEmoji(name: string): string {
    const n = (name || '').toLowerCase();
    const map: Record<string, string> = {
      onion: '🧅', tomato: '🍅', mango: '🥭', potato: '🥔', rice: '🌾',
      banana: '🍌', apple: '🍎', orange: '🍊', grape: '🍇', wheat: '🌿',
      corn: '🌽', carrot: '🥕', cucumber: '🥒', strawberry: '🍓', watermelon: '🍉'
    };
    return Object.keys(map).find(k => n.includes(k))
      ? map[Object.keys(map).find(k => n.includes(k))!]
      : '🌱';
  }
}
