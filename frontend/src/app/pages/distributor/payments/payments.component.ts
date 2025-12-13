import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-payments',
  templateUrl: './payments.component.html',
})
export class PaymentsComponent {
  payments = [
    { party: 'Farmer Ramesh', amount: '₹45,000', status: 'Completed' },
    { party: 'Logistics Partner', amount: '₹12,000', status: 'Pending' },
  ];
}
