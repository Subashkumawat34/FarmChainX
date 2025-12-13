import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-distributor-profile',
  imports: [CommonModule],
  templateUrl: './distributor-profile.component.html',
})
export class DistributorProfileComponent {
  profile = {
    name: 'AgroLink Distributors',
    email: 'contact@agrolink.com',
    location: 'Jaipur, Rajasthan',
    license: 'DL-AGRO-98231',
    since: '2019',
    rating: 4.6,
  };
}
