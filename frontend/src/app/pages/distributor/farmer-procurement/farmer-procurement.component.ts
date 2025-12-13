import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-farmer-procurement',
  templateUrl: './farmer-procurement.component.html',
})
export class FarmerProcurementComponent {
  procurements = [
    { farmer: 'Ramesh', crop: 'Wheat', quantity: '25 tons', price: '₹32,000', status: 'Approved' },
    { farmer: 'Suresh', crop: 'Rice', quantity: '40 tons', price: '₹45,000', status: 'Pending' },
    { farmer: 'Mahesh', crop: 'Onion', quantity: '18 tons', price: '₹21,000', status: 'Completed' },
  ];
}
