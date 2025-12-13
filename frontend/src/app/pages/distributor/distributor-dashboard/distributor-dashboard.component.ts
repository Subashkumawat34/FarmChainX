import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-distributor-dashboard',
  imports: [CommonModule],
  templateUrl: './distributor-dashboard.component.html',
})
export class DistributorDashboardComponent implements AfterViewInit {
  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineChart!: ElementRef<HTMLCanvasElement>;

  stats = {
    farmers: 142,
    batches: 56,
    orders: 21,
    revenue: 1875000,
  };

  ngAfterViewInit() {
    this.loadBarChart();
    this.loadPieChart();
    this.loadLineChart();
  }

  loadBarChart() {
    new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Rice', 'Wheat', 'Onion', 'Potato'],
        datasets: [
          {
            label: 'Stock (tons)',
            data: [120, 90, 70, 55],
            backgroundColor: '#34d399',
          },
        ],
      },
    });
  }

  loadPieChart() {
    new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Grade A', 'Grade B', 'Grade C'],
        datasets: [
          {
            data: [60, 25, 60],
            backgroundColor: ['#22c55e', '#facc15', '#f87171'],
          },
        ],
      },
    });
  }

  loadLineChart() {
    new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Dispatch Volume',
            data: [40, 52, 48, 66, 61, 84, 90],
            borderColor: '#6366f1',
            tension: 0.4,
          },
        ],
      },
    });
  }
}
