# Database Interview Questions - FarmChainX

## 🗄️ Database Concepts

### Q1: What is a Database?
**Easy Answer:**
A database is like an Excel sheet but more powerful. It stores data in organized tables.

**Why use Database instead of files?**
- ✅ Fast searches
- ✅ Handle millions of records
- ✅ Multiple users can access together
- ✅ Data relationships
- ✅ Security

**Example - Product Table:**
```
| id | name   | price | farmer_id |
|----|--------|-------|-----------|
| 1  | Wheat  | 100   | 5         |
| 2  | Rice   | 80    | 5         |
| 3  | Corn   | 60    | 8         |
```

---

### Q2: SQL vs NoSQL - Which did you use and why?
**Easy Answer:**

**SQL (Relational)** - Used in FarmChainX
- Data in tables (rows and columns)
- Relationships between tables
- Examples: MySQL, PostgreSQL

**NoSQL (Non-Relational)**
- Data in documents (like JSON)
- No fixed structure
- Examples: MongoDB, Firebase

**Why we used SQL (MySQL/PostgreSQL):**
1. ✅ Clear relationships (Farmer → Products → Orders)
2. ✅ Data integrity
3. ✅ Complex queries
4. ✅ ACID properties (reliable)

**Comparison:**
```
SQL (Our choice):
{
  "farmer": {
    "id": 1,
    "name": "John",
    "products": [123, 456]  // Relationship
  }
}

NoSQL:
{
  "farmer": {
    "id": 1,
    "name": "John",
    "products": [  // Embedded
      {"id": 123, "name": "Wheat"},
      {"id": 456, "name": "Rice"}
    ]
  }
}
```

---

### Q3: MySQL vs PostgreSQL - What's the difference?
**Easy Answer:**

**MySQL:**
- ✅ Easy to setup
- ✅ Good for beginners
- ✅ Used in development

**PostgreSQL:**
- ✅ More features
- ✅ Better for big applications
- ✅ Used in production

**In FarmChainX:**
- **Development:** MySQL (easy local setup)
- **Production (Render):** PostgreSQL (free tier, better)

**Good news:**
JPA/Hibernate works with both! No code changes needed!

```properties
# Development (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/farmchainx_db

# Production (PostgreSQL)
spring.datasource.url=jdbc:postgresql://host/farmchainx_db
```

---

### Q4: Explain your database schema
**Easy Answer:**
Schema = How tables are organized.

**Main Tables in FarmChainX:**

**1. Users Table:**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,  -- FARMER, DISTRIBUTOR, etc.
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. Products Table:**
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT,
    image_url VARCHAR(500),
    qr_code_url VARCHAR(500),
    farmer_id BIGINT,
    FOREIGN KEY (farmer_id) REFERENCES users(id)
);
```

**3. Orders Table:**
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT,
    buyer_id BIGINT,
    quantity INT,
    total_price DECIMAL(10, 2),
    status VARCHAR(50),  -- PENDING, DELIVERED
    order_date TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);
```

**4. Feedback Table:**
```sql
CREATE TABLE feedback (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT,
    user_id BIGINT,
    rating INT,  -- 1-5
    comment TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

### Q5: What are Database Relationships?
**Easy Answer:**
How tables are connected to each other.

**Types:**

**1. One-to-Many (Most Common):**
One Farmer has Many Products
```
Farmer (1) -------- (*) Products

Farmer:
| id | name |
|----|------|
| 1  | John |

Products:
| id | name  | farmer_id |
|----|-------|-----------|
| 1  | Wheat | 1         |
| 2  | Rice  | 1         |
| 3  | Corn  | 1         |
```

**2. Many-to-One:**
Many Products belong to One Farmer
(Same as above, just different perspective)

**3. Many-to-Many:**
Many Distributors can buy Many Products
```
Distributor -------- Product_Distributor -------- Product

Needs a junction table:
| distributor_id | product_id |
|----------------|------------|
| 5              | 1          |
| 5              | 2          |
| 8              | 1          |
```

**4. One-to-One:**
One User has One Profile
```
| user_id | profile_id |
|---------|------------|
| 1       | 10         |
```

---

### Q6: What is Normalization?
**Easy Answer:**
Organizing data to reduce redundancy (duplicate data).

**Bad Design (Unnormalized):**
```
| order_id | customer_name | customer_email | product_name | price |
|----------|---------------|----------------|--------------|-------|
| 1        | John          | john@mail.com  | Wheat        | 100   |
| 2        | John          | john@mail.com  | Rice         | 80    |
```
Problem: John's email repeated!

**Good Design (Normalized):**
```
Customers:
| id | name | email         |
|----|------|---------------|
| 1  | John | john@mail.com |

Orders:
| order_id | customer_id | product_name | price |
|----------|-------------|--------------|-------|
| 1        | 1           | Wheat        | 100   |
| 2        | 1           | Rice         | 80    |
```
Email stored only once!

**Benefits:**
- Less storage
- Easier updates
- No duplicate data

---

### Q7: What are Primary Key and Foreign Key?
**Easy Answer:**

**Primary Key:**
- Unique identifier for each row
- Can't be null
- Can't be duplicate

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,  -- Primary key
    email VARCHAR(255)
);
```

**Foreign Key:**
- Links to another table's primary key
- Creates relationships

```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    farmer_id BIGINT,  -- Foreign key
    FOREIGN KEY (farmer_id) REFERENCES users(id)
);
```

**Visual:**
```
Users Table:
| id (PK) | name |
|---------|------|
| 1       | John |
| 2       | Jane |

Products Table:
| id (PK) | name  | farmer_id (FK) |
|---------|-------|----------------|
| 10      | Wheat | 1              | → Points to John
| 11      | Rice  | 1              | → Points to John
| 12      | Corn  | 2              | → Points to Jane
```

---

### Q8: What are JPA Annotations for Database?
**Easy Answer:**
Annotations tell JPA how to map Java class to database table.

**Entity Annotations:**
```java
@Entity  // This class is a table
@Table(name = "products")  // Table name (optional, defaults to class name)
public class Product {
    
    @Id  // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long id;
    
    @Column(name = "product_name", nullable = false, length = 100)
    private String name;
    
    @Column(precision = 10, scale = 2)  // For decimal
    private Double price;
    
    @Temporal(TemporalType.TIMESTAMP)  // For dates
    private Date createdAt;
    
    @Transient  // Don't save to database
    private String tempData;
}
```

**Relationship Annotations:**
```java
@Entity
public class Product {
    
    @ManyToOne  // Many products, one farmer
    @JoinColumn(name = "farmer_id")
    private Farmer farmer;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Review> reviews;
}
```

---

### Q9: How do you write queries in JPA?
**Easy Answer:**
JPA generates queries automatically from method names!

**Repository:**
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // JPA generates:  SELECT * FROM products WHERE name = ?
    Product findByName(String name);
    
    // WHERE price > ?
    List<Product> findByPriceGreaterThan(Double price);
    
    // WHERE farmer_id = ?
    List<Product> findByFarmerId(Long farmerId);
    
    // WHERE name LIKE ? AND price > ?
    List<Product> findByNameContainingAndPriceGreaterThan(String name, Double price);
    
    // Custom SQL query
    @Query("SELECT p FROM Product p WHERE p.price > :minPrice ORDER BY p.price DESC")
    List<Product> findExpensiveProducts(@Param("minPrice") Double minPrice);
    
    // Native SQL (if needed)
    @Query(value = "SELECT * FROM products WHERE farmer_id = ?", nativeQuery = true)
    List<Product> findByFarmerNative(Long farmerId);
}
```

**Usage:**
```java
@Service
public class ProductService {
    @Autowired
    private ProductRepository repository;
    
    public List<Product> getExpensiveProducts() {
        return repository.findByPriceGreaterThan(100.0);
    }
}
```

---

### Q10: What is Database Indexing?
**Easy Answer:**
Index = Like index in a book, helps find data faster.

**Without Index:**
```
Find product with id=1000
→ Check all 10,000 rows → SLOW!
```

**With Index:**
```
Find product with id=1000
→ Use index → Jump directly → FAST!
```

**Create Index:**
```sql
CREATE INDEX idx_farmer_id ON products(farmer_id);
```

**Or in JPA:**
```java
@Entity
@Table(
    name = "products",
    indexes = {
        @Index(name = "idx_farmer_id", columnList = "farmer_id"),
        @Index(name = "idx_price", columnList = "price")
    }
)
public class Product { }
```

**When to use Index:**
- Columns used in WHERE clause
- Columns used in JOIN
- Foreign keys

**Don't overuse:**
- Slows down INSERT/UPDATE
- Takes extra storage

---

### Q11: What are Transactions?
**Easy Answer:**
Transaction = Group of operations that must all succeed or all fail.

**Example - Bank Transfer:**
```java
@Transactional
public void transferMoney(Long from, Long to, Double amount) {
    // Step 1: Deduct from account
    Account fromAccount = accountRepo.findById(from);
    fromAccount.setBalance(fromAccount.getBalance() - amount);
    accountRepo.save(fromAccount);
    
    // If app crashes here, Step 1 will be ROLLED BACK!
    
    // Step 2: Add to account
    Account toAccount = accountRepo.findById(to);
    toAccount.setBalance(toAccount.getBalance() + amount);
    accountRepo.save(toAccount);
    
    // Both succeed or both fail (no in-between)
}
```

**In FarmChainX:**
```java
@Transactional
public void createOrder(OrderDTO orderDTO) {
    // Save order
    Order order = orderRepository.save(new Order(orderDTO));
    
    // Update product stock
    Product product = productRepository.findById(orderDTO.getProductId());
    product.setStock(product.getStock() - orderDTO.getQuantity());
    productRepository.save(product);
    
    // Send email
    emailService.send(orderDTO.getEmail());
    
    // If ANY step fails, ALL are rolled back!
}
```

---

### Q12: What are ACID Properties?
**Easy Answer:**
ACID = Rules that make database reliable.

**A = Atomicity:**
All or nothing. Transaction either fully completes or fully fails.
```
Transfer money: Deduct + Add
✅ Both happen
❌ None happen
⚠️ NOT: Deduct happens but Add doesn't
```

**C = Consistency:**
Database goes from one valid state to another valid state.
```
Before: Account A = 100, Account B = 50, Total = 150
Transfer 20 from A to B
After: Account A = 80, Account B = 70, Total = 150 ✅
(Total always same - consistent!)
```

**I = Isolation:**
Transactions don't interfere with each other.
```
User 1: Reading balance
User 2: Updating balance
→ They don't conflict
```

**D = Durability:**
Once committed, data is permanent (even if power fails).
```
You save product
System crashes
Restart system
Product still there ✅
```

---

### Q13: What is Database Migration?
**Easy Answer:**
Changing database structure without losing data.

**Example - Add new column:**
```
Old Table:
| id | name  | price |
|----|-------|-------|
| 1  | Wheat | 100   |

New Table (after migration):
| id | name  | price | category |
|----|-------|-------|----------|
| 1  | Wheat | 100   | Grain    |
```

**In Spring Boot:**
```properties
# application.properties
spring.jpa.hibernate.ddl-auto=update
```

**Options:**
- **create** - Drop tables and recreate (LOSE DATA!)
- **update** - Add new columns, keep data
- **validate** - Just check if schema matches
- **none** - Do nothing

**Production Best Practice:**
Use **Flyway** or **Liquibase** for controlled migrations.

**Flyway Example:**
```sql
-- V1__initial_schema.sql
CREATE TABLE users (...);

-- V2__add_phone_column.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

---

### Q14: What is Connection Pooling?
**Easy Answer:**
Reuse database connections instead of creating new ones every time.

**Without Pool:**
```
Request 1 → Create connection → Use → Close
Request 2 → Create connection → Use → Close
Request 3 → Create connection → Use → Close
(Creating connection is SLOW!)
```

**With Pool:**
```
Startup → Create 10 connections → Keep ready
Request 1 → Take connection 1 → Use → Return to pool
Request 2 → Take connection 2 → Use → Return to pool
(Reusing is FAST!)
```

**Spring Boot Auto-Configures:**
```properties
# application.properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
```

**HikariCP** is the default connection pool (fastest!).

---

### Q15: How do you optimize database queries?
**Easy Answer:**

**1. Use Indexes:**
```sql
CREATE INDEX idx_farmer_id ON products(farmer_id);
```

**2. Select Only Required Columns:**
```java
// Bad - Gets all columns
@Query("SELECT p FROM Product p")

// Good - Gets only needed columns
@Query("SELECT p.id, p.name, p.price FROM Product p")
```

**3. Use Pagination:**
```java
// Bad - Gets all 10,000 products
List<Product> findAll();

// Good - Gets 10 at a time
Page<Product> findAll(Pageable pageable);
```

**4. Avoid N+1 Query Problem:**
```java
// Bad - Loads farmer separately for each product
List<Product> products = productRepo.findAll();
products.forEach(p -> System.out.println(p.getFarmer().getName()));
// Executes: 1 query for products + N queries for farmers = N+1

// Good - Load farmer with product
@Query("SELECT p FROM Product p JOIN FETCH p.farmer")
List<Product> findAllWithFarmer();
// Executes: 1 query only
```

**5. Use Caching:**
```java
@Cacheable("products")
public List<Product> getAllProducts() {
    return repository.findAll();
}
```

**6. Database Tuning:**
- Regular backups
- Update statistics
- Monitor slow queries
- Clean old data

---

## 🎯 Quick Database Interview Tips

### Most Important Concepts:
1. ✅ SQL vs NoSQL
2. ✅ Tables, Primary Key, Foreign Key
3. ✅ Relationships (One-to-Many, etc.)
4. ✅ JPA/Hibernate
5. ✅ Indexing
6. ✅ Transactions

### Common Interview Question:
**"How is product related to farmer in database?"**

**Your Answer:**
1. **Relationship Type:** One-to-Many (One farmer has many products)
2. **Database:** products table has `farmer_id` as foreign key
3. **JPA:**
```java
@Entity
public class Product {
    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private Farmer farmer;
}
```
4. **Query:** `repository.findByFarmerId(farmerId)` - JPA generates SQL automatically

### Be Ready to Show:
- Entity classes with relationships
- Repository with custom queries
- Database schema diagram
- How transactions work
- Optimization techniques

---

**Master these database concepts and you'll be database-ready! 🗄️**
