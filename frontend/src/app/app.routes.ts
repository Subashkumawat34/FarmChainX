// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.RegisterComponent),
  },

  {
    path: 'verify/:uuid',
    loadComponent: () =>
      import('./components/verify-product/verify-product').then((m) => m.VerifyProduct),
  },

  // User routes
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'upload',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/upload-product/upload-product').then((m) => m.UploadProduct),
  },
  {
    path: 'scanner',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/qr-scanner/qr-scanner/qr-scanner').then((m) => m.QrScanner),
  },
  {
    path: 'products/my',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/my-products/my-products').then((m) => m.MyProducts),
  },

  // CONSUMER ROUTES
  {
    path: 'consumer',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/consumer/consumer-layout/consumer-layout.component').then(
        (m) => m.ConsumerLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/consumer/consumer-dashboard/consumer-dashboard.component').then(
            (m) => m.ConsumerDashboardComponent
          ),
      },
      {
        path: 'verify',
        loadComponent: () =>
          import('./pages/consumer/consumer-verify/consumer-verify.component').then(
            (m) => m.ConsumerVerifyComponent
          ),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/consumer/consumer-history/consumer-history.component').then(
            (m) => m.ConsumerHistoryComponent
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/consumer/consumer-notifications/consumer-notifications.component').then(
            (m) => m.ConsumerNotificationsComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // ADMIN ROUTES
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/admin/admin-overview/admin-overview').then((m) => m.AdminOverview),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/admin/admin-users/admin-users').then((m) => m.AdminUsers),
      },
      {
        path: 'promotion-requests',
        loadComponent: () =>
          import('./pages/admin/admin-promotion-requests/admin-promotion-requests').then(
            (m) => m.AdminPromotionRequests
          ),
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },

  // RETAILER ROUTES (placed under src/app/pages/retailer/*)
  // Parent route uses AuthGuard so only authenticated users can access retailer panel.
  {
    path: 'retailer',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/retailer/retailer-layout/retailer-layout.component').then(
        (m) => m.RetailerLayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/retailer/retailer-dashboard/retailer-dashboard.component').then(
            (m) => m.RetailerDashboardComponent
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./pages/retailer/retailer-inventory/retailer-inventory.component').then(
            (m) => m.RetailerInventoryComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/retailer/retailer-orders/retailer-orders.component').then(
            (m) => m.RetailerOrdersComponent
          ),
      },
      {
        path: 'shipments',
        loadComponent: () =>
          import('./pages/retailer/retailer-shipments/retailer-shipments.component').then(
            (m) => m.RetailerShipmentsComponent
          ),
      },
      {
        path: 'provenance',
        loadComponent: () =>
          import('./pages/retailer/provenance-viewer/provenance-viewer.component').then(
            (m) => m.ProvenanceViewerComponent
          ),
      },
    ],
  },

  // fallback
  { path: '**', redirectTo: '' },
];
