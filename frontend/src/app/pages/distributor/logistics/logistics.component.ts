import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-logistics',
  templateUrl: './logistics.component.html',
})
export class LogisticsComponent {
  shipments = [
    { id: 'SHIP-101', destination: 'Delhi', status: 'In Transit' },
    { id: 'SHIP-102', destination: 'Mumbai', status: 'Delivered' },
  ];
}
