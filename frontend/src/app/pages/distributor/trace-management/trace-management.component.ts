import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-trace-management',
  templateUrl: './trace-management.component.html',
})
export class TraceManagementComponent {
  traces = [
    { batch: 'BATCH-01', status: 'Verified' },
    { batch: 'BATCH-02', status: 'Pending' },
  ];
}
