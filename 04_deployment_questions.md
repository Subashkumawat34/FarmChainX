# Deployment Interview Questions - FarmChainX

## 🚀 Deployment & DevOps

### Q1: What is Deployment?
**Easy Answer:**
Deployment = Making your app available on the internet so others can use it.

**Development:**
- Runs on your computer
- Only you can access
- URL: localhost:4200

**Production (Deployed):**
- Runs on cloud server
- Everyone can access
- URL: farmchainx.vercel.app

**Steps:**
```
Code on Computer
    ↓
Push to GitHub
    ↓
Deploy to Cloud (Vercel/Render)
    ↓
Live on Internet!
```

---

### Q2: Where did you deploy your application?
**Easy Answer:**

**Frontend → Vercel**
- URL: https://farmchainx.vercel.app
- Free tier
- Auto-deploys from GitHub
- Fast CDN worldwide

**Backend → Render**
- URL: https://farmchainx.onrender.com
- Free tier
- Includes PostgreSQL database
- Auto-deploys from GitHub

**Why split frontend and backend?**
- Independent scaling
- Better performance
- Frontend on CDN (fast)
- Backend near database (efficient)

---

### Q3: How did you deploy Frontend on Vercel?
**Easy Answer:**

**Step-by-Step:**

**1. Build the Project:**
```bash
cd frontend
npm run build
```
This creates `dist/` folder with optimized code.

**2. Create vercel.json:**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This handles Angular routing.

**3. Connect to Vercel:**
- Go to vercel.com
- Sign in with GitHub
- Click "New Project"
- Select your repository
- Framework: Angular
- Build Command: `npm run build`
- Output Directory: `dist/farmchainx-frontend/browser`
- Click "Deploy"

**4. Set Environment Variables:**
```
API_URL=https://farmchainx.onrender.com
```

**5. Done!**
Every git push → Auto-deploys!

**Vercel Features:**
- ✅ Free SSL (HTTPS)
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Automatic builds

---

### Q4: How did you deploy Backend on Render?
**Easy Answer:**

**Step-by-Step:**

**1. Create Build Script:**
Make sure `pom.xml` has:
```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

**2. Connect to Render:**
- Go to render.com
- Sign in with GitHub
- Click "New +" → "Web Service"
- Select your repository
- Name: farmchainx-backend
- Environment: Java
- Build Command: `./mvnw clean package -DskipTests`
- Start Command: `java -jar target/*.jar`

**3. Create PostgreSQL Database:**
- Click "New +" → "PostgreSQL"
- Name: farmchainx-db
- Free tier
- Copy internal database URL

**4. Set Environment Variables:**
```
DATABASE_URL=<from step 3>
JWT_SECRET=your-secret-key-12345
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
ALLOWED_ORIGINS=https://farmchainx.vercel.app
```

**5. Deploy:**
Click "Create Web Service"

**6. Done!**
Every git push → Auto-builds and deploys!

---

### Q5: What are Environment Variables?
**Easy Answer:**
Environment variables = Secret values that change between development and production.

**Why use them?**
- ✅ Keep secrets secure (not in code)
- ✅ Different values for dev/prod
- ✅ Easy to change without code change

**Example:**

**Bad (Hardcoded):**
```java
String apiKey = "abc123xyz";  // EXPOSED IN CODE!
```

**Good (Environment Variable):**
```java
@Value("${cloudinary.api-key}")
private String apiKey;  // Value from environment
```

**application.properties:**
```properties
cloudinary.api-key=${CLOUDINARY_API_KEY}
```

**Set in Render:**
```
Environment Tab:
CLOUDINARY_API_KEY = abc123xyz
```

**Common Environment Variables:**

**Backend:**
```
DATABASE_URL=<database_connection>
JWT_SECRET=<secret_key>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
ALLOWED_ORIGINS=https://farmchainx.vercel.app
PORT=8080
```

**Frontend:**
```
API_BASE_URL=https://farmchainx.onrender.com
```

---

### Q6: What is CI/CD?
**Easy Answer:**
CI/CD = Automatic build and deployment.

**CI = Continuous Integration:**
- Automatically test code when you push
- Catches bugs early

**CD = Continuous Deployment:**
- Automatically deploy if tests pass
- No manual deployment needed

**Our Setup:**
```
1. Make code changes
    ↓
2. Push to GitHub
    ↓
3. Vercel/Render detects change
    ↓
4. Automatically builds
    ↓
5. Runs tests (if configured)
    ↓
6. Deploys to production
    ↓
7. Live on internet!
```

**Benefits:**
- Fast releases
- Less manual work
- Fewer deployment errors

**Advanced CI/CD with GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
      - name: Install
        run: npm install
      - name: Test
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        run: vercel --prod
```

---

### Q7: What is the difference between Development and Production?
**Easy Answer:**

| Feature | Development | Production |
|---------|-------------|------------|
| **Environment** | Your computer | Cloud server |
| **Database** | MySQL (local) | PostgreSQL (Render) |
| **Frontend URL** | localhost:4200 | farmchainx.vercel.app |
| **Backend URL** | localhost:8080 | farmchainx.onrender.com |
| **HTTPS** | Not needed | Required (SSL) |
| **CORS** | Allow all | Specific origins |
| **Error Messages** | Detailed | Generic (security) |
| **Logging** | DEBUG level | INFO/WARN level |
| **Code** | Not optimized | Minified/optimized |
| **Testing** | Test data | Real data |

**Configuration for Both:**

**Backend - application.properties:**
```properties
# Development (application-dev.properties)
spring.datasource.url=jdbc:mysql://localhost:3306/farmchainx_db
spring.jpa.show-sql=true
logging.level.root=DEBUG

# Production (application-prod.properties)
spring.datasource.url=${DATABASE_URL}
spring.jpa.show-sql=false
logging.level.root=INFO
```

**Activate profile:**
```bash
# Development
java -jar app.jar --spring.profiles.active=dev

# Production
java -jar app.jar --spring.profiles.active=prod
```

---

### Q8: How do you handle CORS in production?
**Easy Answer:**
CORS = Cross-Origin Resource Sharing.

**Problem:**
- Frontend: farmchainx.vercel.app
- Backend: farmchainx.onrender.com
- Different domains → Browser blocks!

**Solution:**

**Backend Configuration:**
```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:4200",  // Dev
                        "https://farmchainx.vercel.app"  // Prod
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

**Or use Environment Variable:**
```java
@Value("${allowed.origins}")
private String allowedOrigins;

registry.addMapping("/api/**")
    .allowedOrigins(allowedOrigins.split(","));
```

**Environment Variable:**
```
# Development
ALLOWED_ORIGINS=http://localhost:4200

# Production
ALLOWED_ORIGINS=https://farmchainx.vercel.app,https://www.farmchainx.com
```

---

### Q9: How do you set up a custom domain?
**Easy Answer:**

**Steps for Vercel:**

**1. Buy Domain:**
- GoDaddy, Namecheap, Google Domains
- Example: farmchainx.com

**2. Add Domain in Vercel:**
- Project Settings → Domains
- Add: farmchainx.com
- Vercel provides DNS records

**3. Update DNS:**
Go to domain provider:
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**4. Wait (5-48 hours):**
DNS propagation takes time

**5. Done!**
farmchainx.com now works with free SSL!

**For Backend (Render):**
Similar process, Render provides DNS values.

---

### Q10: What is SSL/HTTPS?
**Easy Answer:**
SSL = Secure Socket Layer. Makes connection encrypted.

**HTTP (Not Secure):**
```
Browser → Data sent in plain text → Server
Anyone can read: passwords, credit cards!
```

**HTTPS (Secure with SSL):**
```
Browser → Data encrypted → Server
Encrypted: xj8#kL@9pQ (nobody can read)
```

**In FarmChainX:**
- Vercel: FREE SSL automatic
- Render: FREE SSL automatic
- URLs start with https:// 🔒

**Why Important:**
- ✅ Security (data encrypted)
- ✅ Trust (browsers show lock icon)
- ✅ SEO (Google ranks HTTPS higher)
- ✅ Required for modern features (camera, location)

---

### Q11: How do you monitor your application?
**Easy Answer:**
Monitoring = Watching your app to know if something breaks.

**Built-in Monitoring:**

**Vercel:**
- Analytics dashboard
- Shows: Page views, load time, errors
- Real-time logs

**Render:**
- Metrics: CPU, Memory usage
- Logs: See console.log() output
- Health checks

**Advanced Monitoring Tools:**

**1. Application Performance Monitoring (APM):**
- New Relic
- Datadog
- Monitor: Response time, errors, database queries

**2. Error Tracking:**
- Sentry
- Catches JavaScript errors
- Alerts you immediately

**3. Uptime Monitoring:**
- UptimeRobot
- Pings your site every 5 minutes
- Alerts if site is down

**4. Logging:**
- Papertrail
- Loggly
- Centralized logs from all servers

**5. Custom Health Check:**
```java
@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", new Date(),
            "database", checkDatabase(),
            "diskSpace", checkDisk()
        ));
    }
}
```

---

### Q12: How would you scale the application?
**Easy Answer:**
Scaling = Handling more users without slowing down.

**Types of Scaling:**

**1. Vertical Scaling (Scale Up):**
More powerful server
```
Before: 1GB RAM, 1 CPU
After: 4GB RAM, 4 CPU
```

**2. Horizontal Scaling (Scale Out):**
More servers
```
Before: 1 server
After: 5 servers + Load balancer
```

**Scaling Strategy for FarmChainX:**

**Level 1: Optimize Code**
- Database indexing
- Caching (Redis)
- Image optimization
- Code profiling

**Level 2: Vertical Scaling**
- Upgrade Render plan
- More RAM, CPU

**Level 3: Horizontal Scaling**
```
                Load Balancer
                /     |     \
          Server 1  Server 2  Server 3
                \     |     /
              Database Pool
                    |
            Primary + Replicas
```

**Level 4: Microservices**
Split into services:
- User Service
- Product Service
- Order Service
- Payment Service

**Level 5: Cloud Infrastructure**
- AWS: EC2, RDS, S3, CloudFront
- Google Cloud: Compute Engine, Cloud SQL
- Azure: App Service, SQL Database

**Caching Strategy:**
```java
@Cacheable("products")
public List<Product> getAllProducts() {
    return repository.findAll();
}

@CacheEvict(value = "products", allEntries = true)
public Product createProduct(Product product) {
    return repository.save(product);
}
```

**Database Scaling:**
- Read replicas for queries
- Master for writes
- Connection pooling
- Database sharding

---

## 🎯 Quick Deployment Interview Tips

### Most Important Concepts:
1. ✅ Vercel for Frontend
2. ✅ Render for Backend
3. ✅ Environment Variables
4. ✅ CI/CD workflow
5. ✅ HTTPS/SSL
6. ✅ CORS configuration

### Common Interview Question:
**"Walk me through your deployment process"**

**Your Answer:**
1. **Development:**
   - Code on local machine
   - Test on localhost

2. **Version Control:**
   - Push code to GitHub
   - Main branch for production

3. **Frontend Deployment:**
   - Vercel connected to GitHub
   - Auto-detects Angular
   - Builds: `npm run build`
   - Deploys to global CDN
   - URL: farmchainx.vercel.app

4. **Backend Deployment:**
   - Render connected to GitHub
   - Builds: `./mvnw clean package`
   - Starts: `java -jar app.jar`
   - PostgreSQL database included
   - URL: farmchainx.onrender.com

5. **Environment Variables:**
   - Database credentials
   - API keys
   - JWT secret
   - CORS origins

6. **Auto-Deployment:**
   - Git push triggers build
   - Tests run (if configured)
   - Auto-deploys if successful

7. **Monitoring:**
   - Vercel/Render dashboards
   - Check logs for errors
   - Monitor performance

### Be Ready to Show:
- Live deployed website
- Vercel/Render dashboard
- Environment variables setup
- Git workflow (branches, commits)
- How to rollback if needed

### Troubleshooting Questions:

**"What if deployment fails?"**
1. Check build logs
2. Verify environment variables
3. Test build locally first
4. Check CORS configuration
5. Verify database connection

**"How do you handle database migrations in production?"**
- Use Hibernate `ddl-auto=update` carefully
- Better: Use Flyway/Liquibase
- Backup before migration
- Test on staging first

**"What if server crashes?"**
- Auto-restart (Render does this)
- Load balancer redirects traffic
- Health checks detect issues
- Alerts notify you

---

**Master these deployment concepts and you'll ace the DevOps questions! 🚀**
