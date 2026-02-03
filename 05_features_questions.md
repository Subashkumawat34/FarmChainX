# Feature & Functionality Questions - FarmChainX

## 🌾 Project-Specific Features

### Q1: Explain the complete Farmer workflow
**Easy Answer:**
How a farmer uses the system from registration to selling products.

**Step-by-Step Flow:**

**1. Registration:**
```typescript
// Frontend
registerFarmer(data: FarmerRegistration) {
  return this.http.post('/api/auth/register', {
    email: data.email,
    password: data.password,
    role: 'FARMER',
    farmDetails: data.farmDetails
  });
}
```

**2. Login:**
```java
// Backend
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    User user = authService.authenticate(request);
    String token = jwtService.generateToken(user);
    return ResponseEntity.ok(new AuthResponse(token, user.getRole()));
}
```

**3. Upload Product:**
```typescript
// Frontend - farmer uploads
uploadProduct(productData, imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('name', productData.name);
  formData.append('price', productData.price);
  formData.append('quantity', productData.quantity);
  formData.append('soilType', productData.soilType);
  formData.append('organic', productData.organic);
  
  return this.http.post('/api/products/upload', formData);
}
```

```java
// Backend - processes upload
@PostMapping("/upload")
public ResponseEntity<?> uploadProduct(
    @RequestParam MultipartFile file,
    @RequestParam String name,
    @RequestParam Double price,
    @RequestParam Integer quantity
) {
    // 1. Upload image to Cloudinary
    String imageUrl = cloudinaryService.upload(file);
    
    // 2. Create product
    Product product = new Product();
    product.setName(name);
    product.setPrice(price);
    product.setQuantity(quantity);
    product.setImageUrl(imageUrl);
    product.setFarmer(getCurrentFarmer());
    
    // 3. Save to database
    Product saved = productRepository.save(product);
    
    // 4. Generate QR code
    String qrUrl = qrCodeService.generate(
        "https://farmchainx.vercel.app/product?id=" + saved.getId()
    );
    saved.setQrCodeUrl(qrUrl);
    
    // 5. Update with QR
    return ResponseEntity.ok(productRepository.save(saved));
}
```

**4. View Dashboard:**
```java
// Backend - Analytics for farmer
@GetMapping("/dashboard/stats")
public ResponseEntity<?> getDashboardStats() {
    Farmer farmer = getCurrentFarmer();
    
    DashboardStats stats = new DashboardStats();
    stats.setTotalProducts(productRepo.countByFarmerId(farmer.getId()));
    stats.setTotalRevenue(orderRepo.getTotalRevenue(farmer.getId()));
    stats.setProductsSold(orderRepo.countSoldProducts(farmer.getId()));
    stats.setActiveProducts(productRepo.countActiveByFarmerId(farmer.getId()));
    
    return ResponseEntity.ok(stats);
}
```

**5. Manage Inventory:**
- View all products
- Edit product details
- Update prices
- Mark as sold

---

### Q2: How does Supply Chain Tracking work?
**Easy Answer:**
Tracks product journey from farmer to consumer.

**Journey:**
```
Farmer → Distributor → Retailer → Consumer
```

**Database Table:**
```sql
CREATE TABLE supply_chain_tracking (
    id BIGINT PRIMARY KEY,
    product_id BIGINT,
    current_owner_id BIGINT,
    previous_owner_id BIGINT,
    transfer_date TIMESTAMP,
    status VARCHAR(50),  -- HARVESTED, WITH_DISTRIBUTOR, WITH_RETAILER, DELIVERED
    location VARCHAR(255)
);
```

**Model:**
```java
@Entity
public class SupplyChainTracking {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    private Product product;
    
    @ManyToOne
    private User currentOwner;
    
    @ManyToOne
    private User previousOwner;
    
    private LocalDateTime transferDate;
    
    @Enumerated(EnumType.STRING)
    private SupplyChainStatus status;
    
    private String location;
}
```

**Transfer Flow:**

**1. Distributor purchases from Farmer:**
```java
@PostMapping("/distributor/purchase")
@Transactional
public ResponseEntity<?> purchaseProduct(
    @RequestParam Long productId,
    @RequestParam Integer quantity
) {
    Product product = productRepo.findById(productId).orElseThrow();
    User distributor = getCurrentUser();
    
    // Create order
    Order order = Order.builder()
        .product(product)
        .buyer(distributor)
        .seller(product.getFarmer())
        .quantity(quantity)
        .totalPrice(product.getPrice() * quantity)
        .build();
    orderRepo.save(order);
    
    // Update supply chain
    SupplyChainTracking tracking = new SupplyChainTracking();
    tracking.setProduct(product);
    tracking.setPreviousOwner(product.getFarmer());
    tracking.setCurrentOwner(distributor);
    tracking.setStatus(SupplyChainStatus.WITH_DISTRIBUTOR);
    tracking.setTransferDate(LocalDateTime.now());
    trackingRepo.save(tracking);
    
    return ResponseEntity.ok("Purchase successful");
}
```

**2. Consumer views complete journey:**
```java
@GetMapping("/consumer/product/{id}/journey")
public ResponseEntity<?> getProductJourney(@PathVariable Long id) {
    Product product = productRepo.findById(id).orElseThrow();
    
    List<SupplyChainTracking> journey = trackingRepo
        .findByProductIdOrderByTransferDateAsc(id);
    
    ProductJourneyDTO dto = new ProductJourneyDTO();
    dto.setProduct(product);
    dto.setFarmer(product.getFarmer());
    dto.setJourney(journey);
    
    return ResponseEntity.ok(dto);
}
```

**Frontend Display:**
```typescript
export class ProductJourneyComponent {
  journey: any;
  
  ngOnInit() {
    const productId = this.route.snapshot.params['id'];
    this.productService.getJourney(productId).subscribe(data => {
      this.journey = data;
    });
  }
}
```

```html
<div class="timeline">
  <div *ngFor="let step of journey.journey" class="timeline-item">
    <div class="step-icon">✓</div>
    <div class="step-details">
      <h3>{{step.status}}</h3>
      <p>Owner: {{step.currentOwner.name}}</p>
      <p>Location: {{step.location}}</p>
      <p>Date: {{step.transferDate | date}}</p>
    </div>
  </div>
</div>
```

---

### Q3: How does QR Code work end-to-end?
**Easy Answer:**

**Generation (Backend):**
```java
@Service
public class QRCodeService {
    
    public String generateAndUpload(String content) throws Exception {
        // 1. Generate QR matrix
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(
            content,
            BarcodeFormat.QR_CODE,
            300, 300
        );
        
        // 2. Convert to image
        BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
        
        // 3. Convert to bytes
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "PNG", baos);
        byte[] imageBytes = baos.toByteArray();
        
        // 4. Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
            imageBytes,
            ObjectUtils.emptyMap()
        );
        
        return (String) uploadResult.get("secure_url");
    }
}
```

**Scanning (Frontend):**
```typescript
export class QRScannerComponent {
  scanResult: string;
  
  onCodeResult(result: string) {
    this.scanResult = result;
    
    // Extract product ID from URL
    // result = "https://farmchainx.vercel.app/product?id=123"
    const url = new URL(result);
    const productId = url.searchParams.get('id');
    
    // Navigate to product details
    this.router.navigate(['/product', productId]);
  }
}
```

```html
<zxing-scanner
  (scanSuccess)="onCodeResult($event)"
  [formats]="['QR_CODE']">
</zxing-scanner>
```

**Product Details:**
```typescript
export class ProductDetailsComponent {
  product: any;
  
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    
    this.productService.getProductDetails(id).subscribe(data => {
      this.product = data;
    });
  }
}
```

**Backend API:**
```java
@GetMapping("/consumer/product/{id}")
public ResponseEntity<?> getProductDetails(@PathVariable Long id) {
    Product product = productRepo.findById(id).orElseThrow();
    
    ProductDetailsDTO dto = new ProductDetailsDTO();
    dto.setId(product.getId());
    dto.setName(product.getName());
    dto.setPrice(product.getPrice());
    dto.setImageUrl(product.getImageUrl());
    dto.setFarmerName(product.getFarmer().getName());
    dto.setFarmLocation(product.getFarmer().getLocation());
    dto.setOrganic(product.isOrganic());
    dto.setQualityScore(product.getQualityScore());
    dto.setSupplyChain(getSupplyChain(id));
    
    return ResponseEntity.ok(dto);
}
```

---

### Q4: How does the Consumer experience work?
**Easy Answer:**

**1. Scan QR Code:**
- Open scanner
- Point at product QR
- Auto-redirects to product page

**2. View Product Details:**
```java
@GetMapping("/consumer/product/{id}")
public ProductDetailsDTO getProduct(@PathVariable Long id) {
    Product product = productRepo.findById(id).orElseThrow();
    
    return ProductDetailsDTO.builder()
        .productInfo(product)
        .farmerInfo(product.getFarmer())
        .supplyChain(getSupplyChain(id))
        .reviews(getReviews(id))
        .qualityCertificates(getCertificates(id))
        .build();
}
```

**3. Verify Authenticity:**
```typescript
verifyProduct(productId) {
  return this.http.get(`/api/consumer/verify/${productId}`)
    .pipe(
      map(response => ({
        isAuthentic: response.isAuthentic,
        farmerVerified: response.farmerVerified,
        qualityChecked: response.qualityChecked,
        organicCertified: response.organicCertified
      }))
    );
}
```

**4. Purchase:**
```java
@PostMapping("/consumer/purchase")
@Transactional
public ResponseEntity<?> purchaseProduct(@RequestBody PurchaseRequest request) {
    Product product = productRepo.findById(request.getProductId()).orElseThrow();
    User consumer = getCurrentUser();
    
    // Create order
    Order order = new Order();
    order.setProduct(product);
    order.setBuyer(consumer);
    order.setQuantity(request.getQuantity());
    order.setTotalPrice(product.getPrice() * request.getQuantity());
    order.setStatus(OrderStatus.PENDING);
    orderRepo.save(order);
    
    // Update stock
    product.setQuantity(product.getQuantity() - request.getQuantity());
    productRepo.save(product);
    
    // Send confirmation email
    emailService.sendOrderConfirmation(consumer.getEmail(), order);
    
    return ResponseEntity.ok(order);
}
```

**5. Write Review:**
```java
@PostMapping("/consumer/review")
public ResponseEntity<?> writeReview(@RequestBody ReviewRequest request) {
    // Verify user purchased product
    boolean hasPurchased = orderRepo.existsByBuyerIdAndProductId(
        getCurrentUser().getId(),
        request.getProductId()
    );
    
    if (!hasPurchased) {
        return ResponseEntity.badRequest()
            .body("You must purchase product to review");
    }
    
    Review review = new Review();
    review.setProduct(productRepo.findById(request.getProductId()).get());
    review.setUser(getCurrentUser());
    review.setRating(request.getRating());
    review.setComment(request.getComment());
    reviewRepo.save(review);
    
    return ResponseEntity.ok("Review added");
}
```

---

### Q5: What does the Admin Panel do?
**Easy Answer:**
Admin can monitor everything and manage users.

**Features:**

**1. User Management:**
```java
@GetMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> getAllUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    Pageable pageable = PageRequest.of(page, size);
    Page<User> users = userRepo.findAll(pageable);
    
    return ResponseEntity.ok(users.map(this::convertToDTO));
}

@PutMapping("/admin/users/{id}/status")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> updateUserStatus(
    @PathVariable Long id,
    @RequestParam boolean active
) {
    User user = userRepo.findById(id).orElseThrow();
    user.setActive(active);
    userRepo.save(user);
    
    return ResponseEntity.ok("User status updated");
}
```

**2. System Analytics:**
```java
@GetMapping("/admin/analytics")
public ResponseEntity<?> getAnalytics() {
    AdminAnalyticsDTO analytics = new AdminAnalyticsDTO();
    
    // User statistics
    analytics.setTotalUsers(userRepo.count());
    analytics.setTotalFarmers(userRepo.countByRole("FARMER"));
    analytics.setTotalDistributors(userRepo.countByRole("DISTRIBUTOR"));
    analytics.setTotalRetailers(userRepo.countByRole("RETAILER"));
    analytics.setTotalConsumers(userRepo.countByRole("CONSUMER"));
    
    // Product statistics
    analytics.setTotalProducts(productRepo.count());
    analytics.setActiveProducts(productRepo.countByActiveTrue());
    
    // Order statistics
    analytics.setTotalOrders(orderRepo.count());
    analytics.setTotalRevenue(orderRepo.getTotalRevenue());
    
    // Recent activities
    analytics.setRecentUsers(userRepo.findTop10ByOrderByCreatedAtDesc());
    analytics.setRecentOrders(orderRepo.findTop10ByOrderByOrderDateDesc());
    
    return ResponseEntity.ok(analytics);
}
```

**3. Activity Logs:**
```java
@Entity
public class ActivityLog {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User user;
    
    private String action;  // LOGIN, REGISTER, PRODUCT_UPLOAD, etc.
    private String details;
    private LocalDateTime timestamp;
}

@GetMapping("/admin/logs")
public ResponseEntity<?> getActivityLogs(
    @RequestParam(required = false) String action,
    @RequestParam(required = false) Long userId,
    Pageable pageable
) {
    if (action != null && userId != null) {
        return ResponseEntity.ok(
            logRepo.findByActionAndUserId(action, userId, pageable)
        );
    } else if (action != null) {
        return ResponseEntity.ok(
            logRepo.findByAction(action, pageable)
        );
    } else {
        return ResponseEntity.ok(logRepo.findAll(pageable));
    }
}
```

**4. Quality Verification:**
```java
@PutMapping("/admin/products/{id}/verify")
public ResponseEntity<?> verifyQuality(
    @PathVariable Long id,
    @RequestBody QualityVerification verification
) {
    Product product = productRepo.findById(id).orElseThrow();
    product.setQualityScore(verification.getScore());
    product.setQualityVerified(true);
    product.setVerifiedBy(getCurrentAdmin());
    productRepo.save(product);
    
    // Notify farmer
    notificationService.notifyFarmer(
        product.getFarmer(),
        "Your product has been quality verified"
    );
    
    return ResponseEntity.ok("Quality verified");
}
```

---

### Q6: Explain the Authentication Flow
**Easy Answer:**

**Registration:**
```java
@PostMapping("/auth/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    // 1. Check if email exists
    if (userRepo.existsByEmail(request.getEmail())) {
        return ResponseEntity.badRequest().body("Email already exists");
    }
    
    // 2. Hash password
    String hashedPassword = passwordEncoder.encode(request.getPassword());
    
    // 3. Create user
    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(hashedPassword);
    user.setRole(request.getRole());
    user.setName(request.getName());
    user.setActive(true);
    userRepo.save(user);
    
   // 4. Log activity
    activityLogService.log(user, "REGISTER", "New user registered");
    
    return ResponseEntity.ok("Registration successful");
}
```

**Login:**
```java
@PostMapping("/auth/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    // 1. Find user
    User user = userRepo.findByEmail(request.getEmail())
        .orElseThrow(() -> new BadCredentialsException("User not found"));
    
    // 2. Verify password
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        return ResponseEntity.status(401).body("Invalid password");
    }
    
    // 3. Check if active
    if (!user.isActive()) {
        return ResponseEntity.status(403).body("Account disabled");
    }
    
    // 4. Generate JWT token
    String token = jwtService.generateToken(user);
    
    // 5. Log activity
    activityLogService.log(user, "LOGIN", "User logged in");
    
    // 6. Return response
    return ResponseEntity.ok(new AuthResponse(
        token,
        user.getRole(),
        user.getName()
    ));
}
```

**Protected Endpoint:**
```java
@GetMapping("/farmer/dashboard")
@PreAuthorize("hasRole('FARMER')")
public ResponseEntity<?> getFarmerDashboard() {
    User farmer = getCurrentUser();  // From JWT token
    // ... logic
}
```

**JWT Filter:**
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) {
        // 1. Get token from header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String token = authHeader.substring(7);
        
        // 2. Extract email from token
        String email = jwtService.extractEmail(token);
        
        // 3. Load user
        User user = userRepo.findByEmail(email).orElse(null);
        
        // 4. Validate token
        if (user != null && jwtService.isTokenValid(token, user)) {
            // 5. Set authentication
            UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities()
                );
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        
        filterChain.doFilter(request, response);
    }
}
```

---

### Q7: How does Product Management work?
**Easy Answer:**

**Create Product:**
Already covered in Q1 (Farmer workflow)

**Get All Products (Farmer's products):**
```java
@GetMapping("/farmer/products")
public ResponseEntity<?> getMyProducts() {
    User farmer = getCurrentUser();
    List<Product> products = productRepo.findByFarmerId(farmer.getId());
    return ResponseEntity.ok(products);
}
```

**Update Product:**
```java
@PutMapping("/farmer/products/{id}")
public ResponseEntity<?> updateProduct(
    @PathVariable Long id,
    @RequestBody ProductUpdateRequest request
) {
    Product product = productRepo.findById(id).orElseThrow();
    
    // Verify ownership
    if (!product.getFarmer().getId().equals(getCurrentUser().getId())) {
        return ResponseEntity.status(403).body("Not your product");
    }
    
    // Update fields
    product.setName(request.getName());
    product.setPrice(request.getPrice());
    product.setQuantity(request.getQuantity());
    product.setDescription(request.getDescription());
    
    productRepo.save(product);
    return ResponseEntity.ok(product);
}
```

**Delete Product:**
```java
@DeleteMapping("/farmer/products/{id}")
public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
    Product product = productRepo.findById(id).orElseThrow();
    
    // Verify ownership
    if (!product.getFarmer().getId().equals(getCurrentUser().getId())) {
        return ResponseEntity.status(403).body("Not your product");
    }
    
    // Check if has active orders
    if (orderRepo.existsByProductIdAndStatusNot(id, OrderStatus.DELIVERED)) {
        return ResponseEntity.badRequest()
            .body("Cannot delete product with active orders");
    }
    
    productRepo.delete(product);
    return ResponseEntity.ok("Product deleted");
}
```

**Search Products (Marketplace):**
```java
@GetMapping("/marketplace/search")
public ResponseEntity<?> searchProducts(
    @RequestParam(required = false) String keyword,
    @RequestParam(required = false) Double minPrice,
    @RequestParam(required = false) Double maxPrice,
    @RequestParam(required = false) String category,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    Specification<Product> spec = Specification.where(null);
    
    if (keyword != null) {
        spec = spec.and((root, query, cb) ->
            cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%")
        );
    }
    
    if (minPrice != null) {
        spec = spec.and((root, query, cb) ->
            cb.greaterThanOrEqualTo(root.get("price"), minPrice)
        );
    }
    
    if (maxPrice != null) {
        spec = spec.and((root, query, cb) ->
            cb.lessThanOrEqualTo(root.get("price"), maxPrice)
        );
    }
    
    if (category != null) {
        spec = spec.and((root, query, cb) ->
            cb.equal(root.get("category"), category)
        );
    }
    
    Pageable pageable = PageRequest.of(page, size);
    Page<Product> products = productRepo.findAll(spec, pageable);
    
    return ResponseEntity.ok(products);
}
```

---

### Q8: How does Analytics Dashboard work?
**Easy Answer:**

**Farmer Analytics:**
```java
@GetMapping("/farmer/analytics")
public ResponseEntity<?> getFarmerAnalytics() {
    User farmer = getCurrentUser();
    
    FarmerAnalyticsDTO analytics = new FarmerAnalyticsDTO();
    
    // Revenue over time
    List<RevenueData> revenue = orderRepo.getRevenueByMonth(farmer.getId());
    analytics.setMonthlyRevenue(revenue);
    
    // Top selling products
    List<ProductSalesData> topProducts = orderRepo.getTopSellingProducts(farmer.getId(), 5);
    analytics.setTopProducts(topProducts);
    
    // Sales by category
    List<CategorySalesData> categoryData = productRepo.getSalesByCategory(farmer.getId());
    analytics.setCategoryBreakdown(categoryData);
    
    return ResponseEntity.ok(analytics);
}
```

**Repository Query:**
```java
@Query("SELECT new com.farmchainx.dto.RevenueData(MONTH(o.orderDate), SUM(o.totalPrice)) " +
       "FROM Order o WHERE o.product.farmer.id = :farmerId " +
       "GROUP BY MONTH(o.orderDate)")
List<RevenueData> getRevenueByMonth(@Param("farmerId") Long farmerId);
```

**Frontend (Chart.js):**
```typescript
export class AnalyticsComponent implements OnInit {
  revenueChart: any;
  
  ngOnInit() {
    this.analyticsService.getFarmerAnalytics().subscribe(data => {
      this.createRevenueChart(data.monthlyRevenue);
    });
  }
  
  createRevenueChart(data: RevenueData[]) {
    this.revenueChart = new Chart('revenueCanvas', {
      type: 'line',
      data: {
        labels: data.map(d => this.getMonthName(d.month)),
        datasets: [{
          label: 'Revenue',
          data: data.map(d => d.amount),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Revenue'
          }
        }
      }
    });
  }
}
```

---

### Q9: How would you add Payment Integration?
**Easy Answer:**

**Using Stripe/Razorpay:**

**Backend:**
```java
@Service
public class PaymentService {
    
    @Value("${stripe.secret-key}")
    private String stripeSecretKey;
    
    public PaymentIntent createPaymentIntent(Order order) {
        Stripe.apiKey = stripeSecretKey;
        
        PaymentIntentCreateParams params =
            PaymentIntentCreateParams.builder()
                .setAmount((long) (order.getTotalPrice() * 100))  // Convert to cents
                .setCurrency("inr")
                .putMetadata("orderId", order.getId().toString())
                .build();
                
        return PaymentIntent.create(params);
    }
}
```

**Controller:**
```java
@PostMapping("/consumer/payment/create")
public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) {
    Order order = orderRepo.findById(request.getOrderId()).orElseThrow();
    
    PaymentIntent paymentIntent = paymentService.createPaymentIntent(order);
    
    return ResponseEntity.ok(Map.of(
        "clientSecret", paymentIntent.getClientSecret()
    ));
}

@PostMapping("/consumer/payment/confirm")
public ResponseEntity<?> confirmPayment(@RequestBody PaymentConfirmation confirmation) {
    Order order = orderRepo.findById(confirmation.getOrderId()).orElseThrow();
    order.setPaymentStatus(PaymentStatus.COMPLETED);
    order.setPaymentId(confirmation.getPaymentId());
    orderRepo.save(order);
    
    // Send confirmation
    emailService.sendPaymentConfirmation(order);
    
    return ResponseEntity.ok("Payment confirmed");
}
```

---

### Q10: How does real-time notification work? (Future feature)
**Easy Answer:**

**Using WebSockets:**

**Backend Configuration:**
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOrigins("https://farmchainx.vercel.app")
            .withSockJS();
    }
}
```

**Send Notification:**
```java
@Service
public class NotificationService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void notifyOrderPlaced(Order order) {
        NotificationDTO notification = new NotificationDTO();
        notification.setType("ORDER_PLACED");
        notification.setMessage("New order for " + order.getProduct().getName());
        notification.setOrderId(order.getId());
        
        // Send to specific farmer
        messagingTemplate.convertAndSendToUser(
            order.getProduct().getFarmer().getId().toString(),
            "/queue/notifications",
            notification
        );
    }
}
```

**Frontend (Angular):**
```typescript
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

export class NotificationService {
  private stompClient: any;
  
  connect() {
    const socket = new SockJS('https://farmchainx.onrender.com/ws');
    this.stompClient = Stomp.over(socket);
    
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/user/queue/notifications', (message) => {
        const notification = JSON.parse(message.body);
        this.showNotification(notification);
      });
    });
  }
  
  showNotification(notification: any) {
    // Show toast/alert
    alert(notification.message);
  }
}
```

---

## 🎯 Quick Feature Interview Tips

### Be Ready to Explain:
1. ✅ Complete user flow (Registration → Dashboard → Actions)
2. ✅ How QR code works (Generation + Scanning)
3. ✅ Supply chain tracking logic
4. ✅ Authentication & Authorization
5. ✅ Role-based access (Farmer vs Admin)

### Common Question:
**"Walk me through a feature"**

Pick any feature and explain:
1. **User's perspective** (what they see/do)
2. **Frontend code** (components, services)
3. **API call** (HTTP request)
4. **Backend code** (controller, service, repository)
5. **Database** (what gets saved)
6. **Response** (what user sees)

### Demo Tips:
- Have live site ready to show
- Walk through actual user flow
- Show both frontend and backend code
- Explain database relationships
- Mention error handling

---

**Confidently explain these features and impress your interviewers! 🌾**
