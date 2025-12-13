import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-quality-grading',
  templateUrl: './quality-grading.component.html',
})
export class QualityGradingComponent {
  grades = [
    { batch: 'BATCH-01', grade: 'A', inspector: 'QC Team' },
    { batch: 'BATCH-02', grade: 'B', inspector: 'QC Team' },
  ];
}
