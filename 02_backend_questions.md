# Backend Interview Questions (Spring Boot/Java) - FarmChainX

## ☕ Spring Boot & Java Questions

### Q1: What is Spring Boot?
**Easy Answer:**
Spring Boot is a framework that makes it SUPER EASY to create Java applications. It does a lot of work automatically.

**Without Spring Boot (Old way):**
- Write lots of configuration files (XML)
- Manually configure database, security, etc.
- Takes days to setup

**With Spring Boot (New way):**
- Minimal configuration
- Auto-configuration does everything
- Start coding in minutes

**Example:**
```java
@SpringBootApplication
public class FarmChainXApplication {
    public static void main(String[] args) {
        SpringApplication.run(FarmChainXApplication.class, args);
        // That's it! Application running!
    }
}
```

**What Spring Boot Provides:**
- ✅ Web server (Tomcat) built-in
- ✅ Database connection auto-configured
- ✅ Security framework included
- ✅ No XML configuration needed
- ✅ Production-ready features

---

### Q2: What is REST API?
**Easy Answer:**
REST API is a way for frontend and backend to talk to each other using HTTP.

**Think of it like ordering food:**
- **GET** = View menu (get data)
- **POST** = Place order (create data)
- **PUT** = Change order (update data)
- **DELETE** = Cancel order (delete data)

**Example in FarmChainX:**
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    // GET all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.findAll();
    }
    
    // GET one product
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.findById(id);
    }
    
    // POST - Create new product
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.save(product);
    }
    
    // PUT - Update product
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.update(id, product);
    }
    
    // DELETE product
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.delete(id);
    }
}
```

**URL Examples:**
```
GET    /api/products           → Get all products
GET    /api/products/1         → Get product with ID 1
POST   /api/products           → Create new product
PUT    /api/products/1         → Update product 1
DELETE /api/products/1         → Delete product 1
```

---

### Q3: What is MVC Architecture?
**Easy Answer:**
MVC separates code into 3 layers for organization.

**M = Model** (Data)
- Database tables
- What data looks like

**V = View** (Display)
- In our case, Angular frontend
- What user sees

**C = Controller** (Logic)
- Handles requests
- Connects Model and View

**Flow in FarmChainX:**
```
User clicks "Get Products"
    ↓
Frontend calls /api/products
    ↓
Controller receives request
    ↓
Controller asks Service for products
    ↓
Service asks Repository (Database)
    ↓
Database returns products
    ↓
Products sent back to frontend
    ↓
User sees products
```

**Code Structure:**
```java
// MODEL - What data looks like
@Entity
public class Product {
    private Long id;
    private String name;
    private Double price;
}

// CONTROLLER - Handle requests
@RestController
public class ProductController {
    @GetMapping("/products")
    public List<Product> getProducts() {
        return service.getAllProducts();
    }
}

// VIEW - Angular frontend (separate project)
```

---

### Q4: What are the layers in your backend?
**Easy Answer:**
Like floors in a building, each layer has a specific job.

**Architecture:**
```
Controller Layer
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Database
```

**1. Controller (Top floor - Meets customers):**
```java
@RestController
public class ProductController {
    @Autowired
    private ProductService service;
    
    @GetMapping("/products")
    public List<Product> getProducts() {
        return service.getAllProducts();  // Calls service
    }
}
```
**Job:** Handle HTTP requests, return responses

**2. Service (Middle floor - Business logic):**
```java
@Service
public class ProductService {
    @Autowired
    private ProductRepository repository;
    
    public List<Product> getAllProducts() {
        return repository.findAll();  // Calls repository
    }
    
    public Product createProduct(Product product) {
        // Business logic here
        if (product.getPrice() < 0) {
            throw new Exception("Price can't be negative");
        }
        return repository.save(product);
    }
}
```
**Job:** Business rules, validation, calculations

**3. Repository (Bottom floor - Database access):**
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Auto-generates database queries!
}
```
**Job:** Talk to database

**Why separate layers?**
- Easy to test
- Easy to change
- One layer doesn't affect others
- Code is organized

---

### Q5: What is Dependency Injection in Spring?
**Easy Answer:**
Spring creates objects for you and gives them when needed.

**Without DI (Manual - Bad):**
```java
public class ProductController {
    private ProductService service = new ProductService();  // You create it
}
```

**With DI (Automatic - Good):**
```java
@RestController
public class ProductController {
    @Autowired
    private ProductService service;  // Spring creates and injects it
    
    // OR use constructor injection (better!)
    public ProductController(ProductService service) {
        this.service = service;
    }
}
```

**How it works:**
1. Spring scans all classes with `@Service`, `@Repository`, `@Controller`
2. Spring creates instances (beans)
3. When you need a bean, Spring injects it

**Benefits:**
- Don't create objects manually
- Single instance shared
- Easy to test (can mock)
- Loose coupling

---

### Q6: What are Spring Boot Annotations?
**Easy Answer:**
Annotations are like labels that tell Spring what to do.

**Common Annotations:**

**1. @SpringBootApplication:**
```java
@SpringBootApplication  // Main annotation - starts everything
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```

**2. @RestController:**
```java
@RestController  // This class handles HTTP requests
public class ProductController { }
```

**3. @Service:**
```java
@Service  // This class contains business logic
public class ProductService { }
```

**4. @Repository:**
```java
@Repository  // This class talks to database
public interface ProductRepository extends JpaRepository { }
```

**5. @Entity:**
```java
@Entity  // This class is a database table
public class Product {
    @Id  // Primary key
    @GeneratedValue  // Auto-generate ID
    private Long id;
}
```

**6. Request Mapping:**
```java
@GetMapping("/products")  // GET request
@PostMapping("/products")  // POST request
@PutMapping("/products/{id}")  // PUT request
@DeleteMapping("/products/{id}")  // DELETE request
```

**7. @Autowired:**
```java
@Autowired  // Inject dependency
private ProductService service;
```

---

### Q7: What is JPA and Hibernate?
**Easy Answer:**
JPA lets you work with database using Java objects instead of SQL.

**Without JPA (Old way - Write SQL):**
```java
String sql = "SELECT * FROM products WHERE id = ?";
PreparedStatement stmt = connection.prepareStatement(sql);
stmt.setLong(1, id);
ResultSet rs = stmt.executeQuery();
// Manually convert ResultSet to Product object
```

**With JPA (Easy way - Use Java):**
```java
Product product = repository.findById(id);
// Done! No SQL needed!
```

**Terms:**
- **JPA** = Java Persistence API (the standard)
- **Hibernate** = Implementation of JPA (does the actual work)

**Example Entity:**
```java
@Entity  // This is a database table
@Table(name = "products")
public class Product {
    
    @Id  // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;
    
    @Column(name = "product_name", nullable = false)
    private String name;
    
    private Double price;
    
    @ManyToOne  // Many products belong to one farmer
    @JoinColumn(name = "farmer_id")
    private Farmer farmer;
}
```

**Repository (Auto-generates queries!):**
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // No code needed! JPA generates these automatically:
    // - save()
    // - findAll()
    // - findById()
    // - delete()
    
    // Custom queries (JPA generates SQL from method name!)
    List<Product> findByFarmerId(Long farmerId);
    List<Product> findByPriceGreaterThan(Double price);
    Product findByName(String name);
}
```

---

### Q8: What is Spring Security?
**Easy Answer:**
Spring Security protects your application from unauthorized access.

**What it does:**
1. Check if user is logged in
2. Check if user has permission
3. Encrypt passwords
4. Protect against attacks

**Basic Configuration:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // Public
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Only admin
                .anyRequest().authenticated()  // Rest need login
            )
            .csrf().disable()  // Disable for REST API
            .sessionManagement().sessionCreationPolicy(STATELESS);  // No sessions
        
        return http.build();
    }
}
```

**Password Encryption:**
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// Encrypt password during registration
String hashedPassword = passwordEncoder.encode("user123");
// Stored: $2a$10$KqX... (encrypted, can't reverse)

// Verify during login
boolean matches = passwordEncoder.matches("user123", hashedPassword);
```

---

### Q9: What is JWT Authentication?
**Easy Answer:**
JWT is like a VIP pass. Once you login, you get a pass (token) to enter without logging in again.

**Flow:**
```
1. User sends email + password
2. Backend verifies
3. Backend creates JWT token
4. User stores token
5. User sends token with every request
6. Backend verifies token
7. User gets data
```

**JWT Structure:**
```
header.payload.signature
```

**Example:**
```
eyJhbGci... (header)
.eyJ1c2Vy... (payload - user info)
.SflKxwRJ... (signature - security)
```

**Implementation:**
```java
@Service
public class JwtService {
    
    private String SECRET_KEY = "my-secret-key-12345";
    
    // Create token
    public String generateToken(User user) {
        return Jwts.builder()
            .setSubject(user.getEmail())
            .claim("role", user.getRole())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))  // 24 hours
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
            .compact();
    }
    
    // Verify token
    public String extractEmail(String token) {
        return Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

**Login Controller:**
```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    // Verify credentials
    User user = authService.authenticate(request.getEmail(), request.getPassword());
    
    if (user != null) {
        // Generate token
        String token = jwtService.generateToken(user);
        
        return ResponseEntity.ok(new LoginResponse(token, user.getRole()));
    } else {
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
```

---

### Q10: How do you handle file uploads?
**Easy Answer:**
Use Cloudinary to store images in the cloud.

**Why Cloudinary?**
- Free tier available
- Automatic optimization
- Fast CDN delivery
- Easy to use

**Upload Process:**
```java
@Service
public class CloudinaryService {
    
    @Autowired
    private Cloudinary cloudinary;
    
    public String uploadFile(MultipartFile file) {
        try {
            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.emptyMap()
            );
            
            // Get URL
            String url = (String) uploadResult.get("secure_url");
            return url;
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file");
        }
    }
}
```

**Controller:**
```java
@PostMapping("/upload")
public ResponseEntity<?> uploadProduct(
    @RequestParam("file") MultipartFile file,
    @RequestParam("name") String name,
    @RequestParam("price") Double price
) {
    // Upload image to Cloudinary
    String imageUrl = cloudinaryService.uploadFile(file);
    
    // Save product with image URL
    Product product = new Product();
    product.setName(name);
    product.setPrice(price);
    product.setImageUrl(imageUrl);
    
    Product saved = productService.save(product);
    return ResponseEntity.ok(saved);
}
```

**Frontend sends:**
```typescript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('name', 'Wheat');
formData.append('price', '100');

this.http.post('/api/upload', formData).subscribe();
```

---

### Q11: How do you generate QR Codes?
**Easy Answer:**
Using ZXing library (Google's QR library).

**Add Dependency:**
```xml
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>core</artifactId>
    <version>3.5.1</version>
</dependency>
```

**Service:**
```java
@Service
public class QRCodeService {
    
    public String generateQRCode(String content) throws Exception {
        // Create QR code
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(
            content,  // Data to encode
            BarcodeFormat.QR_CODE,
            300,  // Width
            300   // Height
        );
        
        // Convert to image
        BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
        
        // Convert to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "PNG", baos);
        byte[] imageBytes = baos.toByteArray();
        
        // Upload to Cloudinary
        String qrUrl = cloudinaryService.uploadBytes(imageBytes);
        
        return qrUrl;
    }
}
```

**Usage:**
```java
@PostMapping("/products")
public Product createProduct(@RequestBody Product product) {
    // Save product first to get ID
    Product saved = productRepository.save(product);
    
    // Generate QR code with product URL
    String qrContent = "https://farmchainx.vercel.app/product?id=" + saved.getId();
    String qrUrl = qrCodeService.generateQRCode(qrContent);
    
    // Update product with QR URL
    saved.setQrCodeUrl(qrUrl);
    return productRepository.save(saved);
}
```

---

### Q12: What is @RequestBody and @RequestParam?
**Easy Answer:**

**@RequestBody** - Get data from request body (JSON)
```java
@PostMapping("/products")
public Product create(@RequestBody Product product) {
    // product object automatically created from JSON
    return productService.save(product);
}
```
**Frontend sends:**
```json
{
  "name": "Wheat",
  "price": 100
}
```

**@RequestParam** - Get data from URL parameters
```java
@GetMapping("/products/search")
public List<Product> search(
    @RequestParam String name,
    @RequestParam(required = false) Double minPrice
) {
    // /products/search?name=Wheat&minPrice=50
    return productService.search(name, minPrice);
}
```
**Frontend calls:**
```
/api/products/search?name=Wheat&minPrice=50
```

**@PathVariable** - Get data from URL path
```java
@GetMapping("/products/{id}")
public Product getById(@PathVariable Long id) {
    // /products/123 → id = 123
    return productService.findById(id);
}
```

---

### Q13: What is CORS and how do you handle it?
**Easy Answer:**
CORS = Cross-Origin Resource Sharing. It's a security feature.

**Problem:**
- Frontend: `https://farmchainx.vercel.app`
- Backend: `https://farmchainx.onrender.com`
- Different domains → Browser blocks it!

**Solution - Allow frontend domain:**
```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")  // All API endpoints
                    .allowedOrigins(
                        "http://localhost:4200",  // Development
                        "https://farmchainx.vercel.app"  // Production
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

**Or use annotation:**
```java
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController { }
```

---

### Q14: How do you handle exceptions?
**Easy Answer:**
Use `@ControllerAdvice` to catch all errors in one place.

**Global Exception Handler:**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    // Handle specific exception
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<?> handleProductNotFound(ProductNotFoundException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }
    
    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
    
    // Handle all other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception ex) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("An error occurred"));
    }
}
```

**Custom Exception:**
```java
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long id) {
        super("Product not found with id: " + id);
    }
}
```

**Usage:**
```java
@GetMapping("/{id}")
public Product getProduct(@PathVariable Long id) {
    return productRepository.findById(id)
        .orElseThrow(() -> new ProductNotFoundException(id));
}
```

---

### Q15: What are DTOs?
**Easy Answer:**
DTO = Data Transfer Object. It's like a filtered version of your entity.

**Why use DTOs?**
1. Don't expose sensitive data (passwords)
2. Send only required fields
3. Combine data from multiple entities

**Example:**

**Entity (has everything):**
```java
@Entity
public class User {
    private Long id;
    private String email;
    private String password;  // SENSITIVE! Don't send to frontend
    private String role;
    private String phone;
}
```

**DTO (only safe data):**
```java
public class UserDTO {
    private String email;
    private String role;
    // No password!
    // No phone!
}
```

**Controller:**
```java
@GetMapping("/users")
public List<UserDTO> getUsers() {
    List<User> users = userService.findAll();
    
    // Convert Entity to DTO
    return users.stream()
        .map(user -> new UserDTO(user.getEmail(), user.getRole()))
        .collect(Collectors.toList());
}
```

**Or use mapper:**
```java
@Service
public class UserMapper {
    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}
```

---

### Q16: What is Validation?
**Easy Answer:**
Check if data is correct before saving to database.

**Add Dependency:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

**Entity with Validation:**
```java
@Entity
public class Product {
    
    @NotNull(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be 3-100 characters")
    private String name;
    
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be positive")
    private Double price;
    
    @Email(message = "Invalid email")
    private String farmerEmail;
    
    @Pattern(regexp = "^\\d{10}$", message = "Phone must be 10 digits")
    private String phone;
}
```

**Controller (Enable validation):**
```java
@PostMapping("/products")
public ResponseEntity<?> create(@Valid @RequestBody Product product) {
    // @Valid triggers validation
    // If validation fails, error automatically sent to frontend
    return ResponseEntity.ok(productService.save(product));
}
```

**Error Response:**
```json
{
  "name": "Name is required",
  "price": "Price must be positive",
  "email": "Invalid email"
}
```

---

### Q17: What is application.properties?
**Easy Answer:**
Configuration file where you set database, port, etc.

**Location:**
```
src/main/resources/application.properties
```

**Common Configurations:**
```properties
# Server port
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/farmchainx_db
spring.datasource.username=root
spring.datasource.password=yourpassword

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# File upload size
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# JWT Secret
jwt.secret=my-secret-key-12345

# Cloudinary
cloudinary.cloud-name=your-cloud
cloudinary.api-key=your-key
cloudinary.api-secret=your-secret
```

**Access in Code:**
```java
@Value("${jwt.secret}")
private String jwtSecret;

@Value("${cloudinary.cloud-name}")
private String cloudName;
```

---

### Q18: What is Pagination?
**Easy Answer:**
Instead of loading 10,000 products at once, load 10 at a time.

**Without Pagination:**
```java
// Returns all 10,000 products → Slow!
List<Product> findAll();
```

**With Pagination:**
```java
@GetMapping("/products")
public Page<Product> getProducts(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    Pageable pageable = PageRequest.of(page, size);
    return productRepository.findAll(pageable);
}
```

**Response:**
```json
{
  "content": [ /* 10 products */ ],
  "totalElements": 10000,
  "totalPages": 1000,
  "number": 0,
  "size": 10
}
```

**Custom Query with Pagination:**
```java
@Query("SELECT p FROM Product p WHERE p.price > :minPrice")
Page<Product> findExpensiveProducts(
    @Param("minPrice") Double minPrice,
    Pageable pageable
);
```

---

### Q19: What are Relationships in JPA?
**Easy Answer:**

**1. One-to-Many:**
One Farmer has many Products
```java
@Entity
public class Farmer {
    @Id
    private Long id;
    
    @OneToMany(mappedBy = "farmer")  // One farmer, many products
    private List<Product> products;
}

@Entity
public class Product {
    @Id
    private Long id;
    
    @ManyToOne  // Many products, one farmer
    @JoinColumn(name = "farmer_id")
    private Farmer farmer;
}
```

**2. Many-to-Many:**
Many Students, Many Courses
```java
@Entity
public class Student {
    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private List<Course> courses;
}
```

**3. One-to-One:**
One User, One Profile
```java
@Entity
public class User {
    @OneToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;
}
```

---

### Q20: What is @Transactional?
**Easy Answer:**
Ensures all database operations succeed together or fail together.

**Without @Transactional:**
```java
public void transferMoney(Long from, Long to, Double amount) {
    accountService.deduct(from, amount);  // ✅ Success
    // App crashes here!
    accountService.add(to, amount);  // ❌ Never executes
    // Money deducted but not added! Data corrupt!
}
```

**With @Transactional:**
```java
@Transactional
public void transferMoney(Long from, Long to, Double amount) {
    accountService.deduct(from, amount);  // ✅ Success
    // App crashes here!
    accountService.add(to, amount);  // ❌ Never executes
    // ROLLBACK! Both operations cancelled!
}
```

**Another Example:**
```java
@Transactional
public void createOrder(Order order) {
    // Save order
    orderRepository.save(order);
    
    // Update product stock
    Product product = productRepository.findById(order.getProductId());
    product.setStock(product.getStock() - order.getQuantity());
    productRepository.save(product);
    
    // Send email
    emailService.send(order.getUserEmail());
    
    // If ANY step fails, EVERYTHING is rolled back!
}
```

---

## 🎯 Quick Backend Interview Tips

### Most Important Concepts:
1. ✅ REST API (GET, POST, PUT, DELETE)
2. ✅ MVC Architecture (Controller → Service → Repository)
3. ✅ JPA/Hibernate (Database without SQL)
4. ✅ Spring Security + JWT
5. ✅ Dependency Injection
6. ✅ Exception Handling

### Common Interview Question:
**"Explain how a product is created in your app"**

**Your Answer:**
1. Frontend sends POST request to `/api/products`
2. **Controller** receives request with `@PostMapping`
3. Validates data with `@Valid`
4. Calls **Service** layer
5. **Service** checks business rules
6. Uploads image to **Cloudinary**
7. Generates **QR code**
8. **Repository** saves to database using JPA
9. Returns saved product to frontend
10. Frontend shows success message

### Be Ready to Show:
- Controller file
- Service file
- Repository interface
- Entity with relationships
- Security configuration
- How JWT works

---

**Master these concepts and you'll ace the backend interview! ☕**
