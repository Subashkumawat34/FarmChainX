// src/app/pages/retailer/provenance-viewer/provenance-viewer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-provenance-viewer',
  templateUrl: './provenance-viewer.component.html',
})
export class ProvenanceViewerComponent {
  viewFullTrace() {
    alert('Open full trace (UI placeholder).');
  }

  verifyOnChain(e?: Event) {
    if (e) e.preventDefault();
    alert('Open blockchain verifier or link (UI placeholder).');
  }
}
