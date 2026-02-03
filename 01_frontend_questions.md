# Frontend Interview Questions (Angular) - FarmChainX

## 🎨 Angular Framework Questions

### Q1: What is Angular and why did you use it?
**Easy Answer:**
Angular is a framework made by Google to build websites. Think of it like a complete toolkit with everything you need.

**Why I chose Angular:**
- ✅ Everything included (no need to find separate tools)
- ✅ TypeScript (catches errors before running code)
- ✅ Good for big projects
- ✅ Many companies use it

**Real example in project:**
```typescript
// This is a component - like a building block
@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.component.html'
})
export class FarmerDashboardComponent { }
```

---

### Q2: What is a Component?
**Easy Answer:**
A component is like a LEGO block for your website. Each part of the website is a component.

**Example in FarmChainX:**
- Navbar = 1 component
- Login form = 1 component
- Product card = 1 component

**Component has 3 parts:**
1. **HTML file** - What it looks like
2. **CSS file** - How it's styled
3. **TypeScript file** - What it does

```typescript
@Component({
  selector: 'app-login',           // How to use: <app-login></app-login>
  templateUrl: './login.html',     // The design
  styleUrls: ['./login.css']       // The colors/styling
})
export class LoginComponent {
  username = '';
  password = '';
  
  login() {
    // Login logic here
  }
}
```

---

### Q3: What is TypeScript?
**Easy Answer:**
TypeScript is like JavaScript but safer. It checks your code for mistakes before running.

**Normal JavaScript (can have errors):**
```javascript
let age = "25";
age = age + 5;  // Result: "255" (WRONG! String + number)
```

**TypeScript (prevents errors):**
```typescript
let age: number = 25;
age = age + 5;  // Result: 30 (CORRECT!)
// age = "hello";  // ERROR! Can't put text in number
```

**Benefits:**
- Finds bugs early
- Better code completion in editor
- Easier to understand code

---

### Q4: What is Data Binding?
**Easy Answer:**
Data binding connects your TypeScript code to HTML automatically.

**Types of Binding:**

**1. One-Way Binding (TypeScript → HTML):**
```typescript
// TypeScript
username = "John";
```
```html
<!-- HTML -->
<h1>Hello {{username}}</h1>  <!-- Shows: Hello John -->
```

**2. Two-Way Binding (↔ Both ways):**
```typescript
email = "";
```
```html
<input [(ngModel)]="email">
<p>Your email: {{email}}</p>
<!-- Type in input → updates email → shows in <p> -->
```

**3. Event Binding (Click, Submit):**
```html
<button (click)="login()">Login</button>
```

---

### Q5: What are Services?
**Easy Answer:**
Services are like helpers that do specific jobs. They keep your code organized.

**When to use Services:**
- Call backend API
- Share data between components
- Reusable logic

**Example - API Service:**
```typescript
@Injectable()
export class ProductService {
  
  getAllProducts() {
    // Call backend API
    return this.http.get('/api/products');
  }
  
  addProduct(product) {
    return this.http.post('/api/products', product);
  }
}
```

**Use in Component:**
```typescript
export class FarmerComponent {
  products = [];
  
  constructor(private productService: ProductService) {
    // Service automatically injected!
  }
  
  ngOnInit() {
    this.productService.getAllProducts()
      .subscribe(data => this.products = data);
  }
}
```

---

### Q6: What is Routing?
**Easy Answer:**
Routing shows different pages without refreshing the browser.

**Setup Routes:**
```typescript
const routes = [
  { path: '', component: HomeComponent },              // localhost:4200/
  { path: 'login', component: LoginComponent },        // localhost:4200/login
  { path: 'farmer', component: FarmerComponent },      // localhost:4200/farmer
  { path: 'product/:id', component: ProductComponent } // localhost:4200/product/123
];
```

**Navigate Between Pages:**

**Method 1 - In HTML:**
```html
<a routerLink="/login">Go to Login</a>
```

**Method 2 - In TypeScript:**
```typescript
constructor(private router: Router) {}

goToProducts() {
  this.router.navigate(['/products']);
}
```

---

### Q7: What are Route Guards?
**Easy Answer:**
Route guards are like security guards. They check if you can enter a page.

**Example - Must be logged in:**
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  
  canActivate() {
    const token = localStorage.getItem('token');
    if (token) {
      return true;  // Allow entry
    } else {
      this.router.navigate(['/login']);  // Redirect to login
      return false;  // Block entry
    }
  }
}
```

**Use Guard:**
```typescript
{
  path: 'farmer',
  component: FarmerComponent,
  canActivate: [AuthGuard]  // Must pass guard to enter
}
```

---

### Q8: What are HTTP Interceptors?
**Easy Answer:**
Interceptors catch every HTTP request/response and can modify them.

**Use Cases:**
1. Add authentication token to all requests
2. Show loading spinner
3. Handle errors globally

**Example - Add Token:**
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get token
    const token = localStorage.getItem('token');
    
    // Add token to request
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    // Continue with modified request
    return next.handle(req);
  }
}
```

**Flow:**
```
Your Code → Interceptor → Add Token → Send to Backend
```

---

### Q9: What is RxJS and Observables?
**Easy Answer:**
Think of Observable like a YouTube channel. You subscribe to get videos (data) over time.

**Simple Example:**
```typescript
// Create an Observable (YouTube channel)
const channel = new Observable(observer => {
  observer.next('Video 1');
  observer.next('Video 2');
  observer.next('Video 3');
  observer.complete();
});

// Subscribe (like subscribing to channel)
channel.subscribe({
  next: (video) => console.log('New video:', video),
  complete: () => console.log('No more videos')
});
```

**In FarmChainX:**
```typescript
// HTTP calls return Observables
this.http.get('/api/products').subscribe(
  data => {
    console.log('Got products:', data);
    this.products = data;
  },
  error => console.error('Error:', error)
);
```

**Why use Observables?**
- Handle async data (API calls)
- Cancel requests
- Transform data easily
- Handle multiple values over time

---

### Q10: What are RxJS Operators?
**Easy Answer:**
Operators transform data in the stream, like filters on Instagram.

**Common Operators:**

**1. map - Transform data:**
```typescript
this.http.get('/api/products').pipe(
  map(response => response.data)  // Extract just the data
).subscribe(products => this.products = products);
```

**2. filter - Filter data:**
```typescript
products$.pipe(
  filter(product => product.price > 100)  // Only expensive products
).subscribe(products => console.log(products));
```

**3. debounceTime - Wait before executing:**
```typescript
// Search box - wait 500ms after user stops typing
this.searchBox.valueChanges.pipe(
  debounceTime(500)
).subscribe(searchTerm => this.search(searchTerm));
```

**4. catchError - Handle errors:**
```typescript
this.http.get('/api/products').pipe(
  catchError(error => {
    console.error('Error:', error);
    return of([]);  // Return empty array
  })
).subscribe(products => this.products = products);
```

---

### Q11: What are Forms in Angular?
**Easy Answer:**
Angular has 2 ways to handle forms:

**1. Template-Driven Forms (Simple):**
```html
<form #loginForm="ngForm" (submit)="login()">
  <input name="email" ngModel required email>
  <input name="password" ngModel required type="password">
  <button type="submit">Login</button>
</form>
```

**2. Reactive Forms (Better control - Used in FarmChainX):**
```typescript
// TypeScript
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }
}
```

```html
<!-- HTML -->
<form [formGroup]="loginForm" (submit)="login()">
  <input formControlName="email">
  <div *ngIf="loginForm.get('email').invalid">Invalid email</div>
  
  <input formControlName="password" type="password">
  <div *ngIf="loginForm.get('password').invalid">Password too short</div>
  
  <button [disabled]="loginForm.invalid">Login</button>
</form>
```

---

### Q12: What is Dependency Injection?
**Easy Answer:**
Instead of creating objects yourself, Angular gives them to you automatically.

**Without DI (Manual - Bad):**
```typescript
export class FarmerComponent {
  productService = new ProductService();  // Manual creation
}
```

**With DI (Automatic - Good):**
```typescript
export class FarmerComponent {
  constructor(private productService: ProductService) {
    // Angular automatically provides ProductService
  }
}
```

**Benefits:**
- Don't worry about creating objects
- Easy to test (can provide fake services)
- Single instance shared across app

---

### Q13: What is the Component Lifecycle?
**Easy Answer:**
Components are born, live, and die. Angular provides hooks for each stage.

**Lifecycle Hooks:**

```typescript
export class FarmerComponent {
  
  // 1. Constructor - Component created
  constructor() {
    console.log('Component created');
  }
  
  // 2. ngOnInit - Component initialized (MOST USED)
  ngOnInit() {
    console.log('Component ready, load data here');
    this.loadProducts();
  }
  
  // 3. ngOnChanges - Input properties changed
  ngOnChanges() {
    console.log('Input data changed');
  }
  
  // 4. ngOnDestroy - Component about to be destroyed
  ngOnDestroy() {
    console.log('Component dying, cleanup here');
  }
}
```

**When to use:**
- **ngOnInit:** Load data, API calls
- **ngOnDestroy:** Unsubscribe, cleanup
- **ngOnChanges:** React to input changes

---

### Q14: What is Lazy Loading?
**Easy Answer:**
Load code only when needed, not all at once. Makes app faster.

**Without Lazy Loading:**
```
App loads → Downloads ALL code (10MB) → Slow!
```

**With Lazy Loading:**
```
App loads → Downloads Home code (1MB) → Fast!
User clicks Farmer → Downloads Farmer code (2MB)
User clicks Admin → Downloads Admin code (3MB)
```

**Implementation:**
```typescript
const routes = [
  { path: '', component: HomeComponent },
  {
    path: 'farmer',
    loadChildren: () => import('./farmer/farmer.module')
      .then(m => m.FarmerModule)  // Load only when needed
  }
];
```

---

### Q15: What is Tailwind CSS?
**Easy Answer:**
Instead of writing CSS files, you add classes directly to HTML.

**Traditional CSS:**
```css
/* style.css */
.btn {
  background-color: #10b981;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}
```
```html
<button class="btn">Click</button>
```

**Tailwind CSS:**
```html
<button class="bg-emerald-500 text-white px-4 py-2 rounded">
  Click
</button>
```

**Benefits:**
- No need to think of class names
- Consistent design
- Responsive classes built-in
- Smaller final CSS (unused removed)

**Example in FarmChainX:**
```html
<div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
  <h3 class="text-xl font-bold text-gray-800">Product Name</h3>
  <p class="text-gray-600 mt-2">Description</p>
  <button class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full mt-4">
    Buy Now
  </button>
</div>
```

---

### Q16: How do you handle errors in Angular?
**Easy Answer:**

**1. HTTP Errors:**
```typescript
this.http.get('/api/products').subscribe(
  data => {
    // Success
    this.products = data;
  },
  error => {
    // Error handling
    if (error.status === 404) {
      alert('Products not found');
    } else if (error.status === 500) {
      alert('Server error');
    } else {
      alert('Something went wrong');
    }
  }
);
```

**2. Global Error Handler:**
```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error) {
    console.error('Global error:', error);
    alert('An error occurred: ' + error.message);
  }
}
```

**3. Using Interceptor:**
```typescript
intercept(req, next) {
  return next.handle(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Unauthorized - redirect to login
        this.router.navigate(['/login']);
      }
      return throwError(error);
    })
  );
}
```

---

### Q17: How does QR Code Scanning work?
**Easy Answer:**
Using ZXing library to access camera and decode QR codes.

**Step-by-Step:**

**1. Install Library:**
```bash
npm install @zxing/ngx-scanner
```

**2. Component Code:**
```typescript
export class ScannerComponent {
  qrResult: string;
  
  onCodeResult(result: string) {
    this.qrResult = result;  // Got QR data!
    console.log('Scanned:', result);
    
    // Extract product ID from URL
    const productId = this.extractId(result);
    
    // Call API to get product details
    this.productService.getProduct(productId)
      .subscribe(product => {
        this.showProductDetails(product);
      });
  }
}
```

**3. HTML Template:**
```html
<zxing-scanner 
  (scanSuccess)="onCodeResult($event)">
</zxing-scanner>

<div *ngIf="qrResult">
  <h3>Scanned QR Code:</h3>
  <p>{{qrResult}}</p>
</div>
```

**Flow:**
```
Open Camera → Point at QR → Library decodes → Get URL/ID → Call API → Show Product
```

---

### Q18: How do you display Charts?
**Easy Answer:**
Using Chart.js and ApexCharts libraries.

**Chart.js Example:**
```typescript
// Component
export class DashboardComponent {
  chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Sales',
      data: [12, 19, 3, 5, 2],
      backgroundColor: 'rgba(16, 185, 129, 0.5)'
    }]
  };
}
```

```html
<!-- HTML -->
<canvas id="myChart">
  <chart [data]="chartData" type="line"></chart>
</canvas>
```

**ApexCharts Example (Better for advanced charts):**
```typescript
chartOptions = {
  series: [{
    name: 'Revenue',
    data: [44, 55, 41, 67, 22, 43]
  }],
  chart: {
    type: 'line',
    height: 350
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  }
};
```

---

### Q19: How do you store data in Browser?
**Easy Answer:**
3 ways to store data in browser:

**1. localStorage (Most Common):**
```typescript
// Save
localStorage.setItem('token', 'abc123');
localStorage.setItem('user', JSON.stringify({name: 'John'}));

// Get
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Remove
localStorage.removeItem('token');

// Clear all
localStorage.clear();
```

**2. sessionStorage (Only for current tab):**
```typescript
sessionStorage.setItem('temp', 'data');
// Deleted when tab closes
```

**3. Cookies:**
```typescript
document.cookie = "token=abc123; expires=Fri, 31 Dec 2026 23:59:59 GMT";
```

**In FarmChainX:**
```typescript
// Save token after login
login() {
  this.authService.login(this.credentials).subscribe(response => {
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role);
    this.router.navigate(['/dashboard']);
  });
}

// Check if logged in
isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

// Logout
logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
}
```

---

### Q20: How do you make API calls?
**Easy Answer:**
Using Angular's HttpClient.

**Setup:**
```typescript
// app.config.ts
import { HttpClientModule } from '@angular/common/http';

export const appConfig = {
  providers: [
    provideHttpClient()
  ]
};
```

**Service:**
```typescript
@Injectable()
export class ProductService {
  apiUrl = 'http://localhost:8080/api';
  
  constructor(private http: HttpClient) {}
  
  // GET request
  getAllProducts() {
    return this.http.get(`${this.apiUrl}/products`);
  }
  
  // POST request
  addProduct(product) {
    return this.http.post(`${this.apiUrl}/products`, product);
  }
  
  // PUT request
  updateProduct(id, product) {
    return this.http.put(`${this.apiUrl}/products/${id}`, product);
  }
  
  // DELETE request
  deleteProduct(id) {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }
}
```

**Component:**
```typescript
export class ProductListComponent {
  products = [];
  
  constructor(private productService: ProductService) {}
  
  ngOnInit() {
    this.productService.getAllProducts()
      .subscribe(
        data => this.products = data,
        error => console.error('Error:', error)
      );
  }
  
  addProduct(product) {
    this.productService.addProduct(product)
      .subscribe(
        response => {
          console.log('Product added');
          this.products.push(response);
        }
      );
  }
}
```

---

## 🎯 Quick Tips for Interview

### Most Important Frontend Concepts:
1. ✅ Components (building blocks)
2. ✅ Services (for API calls)
3. ✅ Routing (navigation)
4. ✅ Forms (user input)
5. ✅ HTTP Interceptors (add token)
6. ✅ Observables (async data)

### Common Interview Flow:
**Interviewer:** "How does login work in your app?"

**Your Answer:**
1. User enters email/password in **Reactive Form**
2. Form validates input (required, email format)
3. On submit, call **AuthService**
4. Service makes **HTTP POST** to backend
5. Backend returns **JWT token**
6. Save token in **localStorage**
7. **HTTP Interceptor** adds token to all future requests
8. **Route Guard** checks token before allowing protected pages
9. If token invalid, redirect to login

### Be Ready to Show Code:
- Open your project
- Show component file
- Explain HTML, TypeScript, CSS
- Show service calling API
- Demo the feature in browser

---

**Practice these concepts and you'll ace the frontend interview! 🚀**
