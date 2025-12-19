import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';

@Component({
    selector: 'app-cart-sidebar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div class="absolute inset-0 overflow-hidden">
        <!-- Background overlay -->
        <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="close.emit()"></div>

        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div class="pointer-events-auto w-screen max-w-md">
            <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                  <div class="ml-3 flex h-7 items-center">
                    <button type="button" (click)="close.emit()" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                      <span class="absolute -inset-0.5"></span>
                      <span class="sr-only">Close panel</span>
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="mt-8">
                  <div class="flow-root">
                    <ul role="list" class="-my-6 divide-y divide-gray-200">
                      <li *ngFor="let item of cartService.cartItems()" class="flex py-6">
                        <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img [src]="item.image" [alt]="item.name" class="h-full w-full object-cover object-center">
                        </div>

                        <div class="ml-4 flex flex-1 flex-col">
                          <div>
                            <div class="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <a href="#">{{ item.name }}</a>
                              </h3>
                              <p class="ml-4">₹{{ item.price }}</p>
                            </div>
                            <p class="mt-1 text-sm text-gray-500">Quality: {{ item.quality }}</p>
                          </div>
                          <div class="flex flex-1 items-end justify-between text-sm">
                            <div class="flex items-center space-x-2">
                                <p class="text-gray-500">Qty</p>
                                <button (click)="cartService.updateQuantity(item.id, item.quantity - 1)" class="px-2 py-1 bg-gray-100 rounded">-</button>
                                <span>{{ item.quantity }}</span>
                                <button (click)="cartService.updateQuantity(item.id, item.quantity + 1)" class="px-2 py-1 bg-gray-100 rounded">+</button>
                            </div>

                            <div class="flex">
                              <button type="button" (click)="cartService.removeFromCart(item.id)" class="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li *ngIf="cartService.cartItems().length === 0" class="py-6 text-center text-gray-500">
                        Your cart is empty.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div class="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>₹{{ cartService.cartTotal() }}</p>
                </div>
                <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div class="mt-6">
                  <a href="javascript:void(0)" (click)="checkout()" class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Checkout</a>
                </div>
                <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or
                    <button type="button" (click)="close.emit()" class="font-medium text-indigo-600 hover:text-indigo-500">
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartSidebarComponent {
    @Output() close = new EventEmitter<void>();

    constructor(public cartService: CartService) { }

    checkout() {
        alert('Proceeding to checkout with total: ₹' + this.cartService.cartTotal());
        // In real app, navigate to checkout page or open payment modal
        // For now, clear cart or show success
        this.cartService.clearCart();
        this.close.emit();
    }
}
