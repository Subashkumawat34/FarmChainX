# 🌾 FarmChainX
### *Transparent Agricultural Supply Chain Platform*

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-Angular_20_%2B_Spring_Boot_3.5-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**FarmChainX** is a next-generation agricultural supply chain management platform that leverages **database-powered transparency** and **modern web technologies** to connect farmers, distributors, retailers, and consumers. By digitizing the journey from *soil to shelf*, we ensure fair pricing for farmers, optimized logistics for distributors, and verified quality for consumers.

## 🌟 Live Demo

**Frontend**: [https://farmchainx-frontend.vercel.app/](https://farmchainx-frontend.vercel.app/)  
**Backend API**: [https://farmchainx-backend.onrender.com/](https://farmchainx-backend.onrender.com/)

---

## 🚀 Key Features

### 🎨 **Modern UI/UX**
- **Professional Design**: Premium glassmorphism effects with emerald/teal color scheme
- **Google Fonts**: Outfit for headings, Inter for body text
- **Responsive**: Fully optimized for mobile, tablet, and desktop
- **Dark Theme**: Sophisticated gradient backgrounds with animated orbs
- **Password Visibility**: Eye icon toggles on all password fields
- **Enhanced Forms**: Real-time validation with visual feedback

### 👨‍🌾 **Farmer Portal**
- Register and upload harvest details with photos
- AI-powered quality assessment
- QR code generation for product batches
- Sales analytics with interactive charts
- Product inventory management

### 🚚 **Distributor & Retailer**
- Real-time marketplace for procurement
- Inventory and stock management
- Supply chain flow visualization
- Shipment tracking and logistics
- Provenance verification

### 🛒 **Consumer Experience**
- Scan QR codes to view full product journey
- Verify organic status and quality certifications
- View eco-impact and sustainability data
- Purchase verified products directly

### 🔐 **Admin & Auditor**
- System-wide analytics dashboard
- User management with RBAC
- Activity logs and monitoring
- Quality verification overrides
- Fraud detection capabilities

---

## 🛠️ Technology Ecosystem

### **Frontend** ([`/frontend`](./frontend))
A premium, responsive Single Page Application (SPA).

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 20 | Modern web framework |
| **Tailwind CSS** | 4 | Utility-first styling |
| **TypeScript** | 5.7+ | Type-safe development |
| **Chart.js & ApexCharts** | Latest | Data visualization |
| **ZXing** | Latest | QR code scanning |
| **Google Fonts** | - | Outfit, Inter typography |

**Key Features**:
- ✅ Glassmorphism UI effects
- ✅ Password visibility toggles
- ✅ Real-time form validation
- ✅ Responsive navigation
- ✅ SEO optimized
- ✅ PWA ready

### **Backend** ([`/backend/farmchainX`](./backend/farmchainX))
A robust, secure, and high-performance REST API.

| Technology | Version | Purpose |
|------------|---------|---------|
| **Spring Boot** | 3.5.6 | Application framework |
| **Java** | 21 LTS | Programming language |
| **MySQL** | 8.0 | Relational database |
| **PostgreSQL** | 14+ | Production database (Render) |
| **JWT** | Latest | Authentication tokens |
| **Spring Security** | 6.x | Security framework |
| **Cloudinary** | Latest | Media storage |
| **ZXing** | Latest | QR code generation |

---

## 🏁 Quick Start

### Prerequisites
- **Node.js** v18+ and npm
- **Java** JDK 21
- **MySQL** 8.0 (for local development)
- **Maven** (bundled with project)

### 1. Clone the Repository
```bash
git clone https://github.com/Subashkumawat34/FarmChainX.git
cd FarmChainX
```

### 2. Database Setup

**For Local Development** (MySQL):
```sql
CREATE DATABASE farmchainx_db;
```

Update `backend/farmchainX/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/farmchainx_db
spring.datasource.username=root
spring.datasource.password=your_password
```

**For Production** (PostgreSQL):
The application is configured to use PostgreSQL on Render.

### 3. Backend Startup
```bash
cd backend/farmchainX
./mvnw spring-boot:run
```
Server runs on `http://localhost:8080`

### 4. Frontend Startup
```bash
cd frontend
npm install
npx ng serve
```
Client runs on `http://localhost:4200`

---

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
vercel --prod
```

### Backend (Render)
1. Push code to GitHub
2. Connect Render to your repository
3. Configure environment variables
4. Deploy with automatic PostgreSQL database

**Environment Variables** (Backend):
```
DATABASE_URL=<postgres_connection_string>
JWT_SECRET=<your_secret_key>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

---

## 🎨 UI/UX Highlights

### Design Philosophy
- **Professional**: Enterprise-grade visual design
- **Modern**: Latest design trends (glassmorphism, gradients)
- **Accessible**: WCAG compliant with proper contrast ratios
- **Fast**: Optimized performance with lazy loading

### Color Palette
- **Primary**: Emerald (#10b981) - Agriculture, growth
- **Secondary**: Teal (#14b8a6) - Trust, technology
- **Background**: Slate (700-900) - Professional, modern
- **Accents**: Gradient combinations for depth

### Typography
- **Headings**: Outfit (geometric sans-serif)
- **Body**: Inter (optimized for readability)
- **Size Scale**: Responsive from mobile to desktop

---

## 📱 Features Showcase

### Password Security
- 👁️ **Show/Hide Toggle**: Eye icons on all password fields
- ✅ **Real-time Validation**: Visual feedback as you type
- 🔒 **Secure**: Password complexity requirements enforced

### Form Experience
- ✨ **Icons**: Visual indicators for all input types
- 🎨 **Focus States**: Smooth transitions with emerald glow
- ⚡ **Instant Feedback**: Real-time validation messages
- 📱 **Mobile Optimized**: Touch-friendly interface

### SEO & Social Sharing
- 🔍 **SEO Optimized**: Comprehensive meta tags
- 📤 **Social Ready**: Open Graph and Twitter Card support
- 🎯 **Branded**: Custom favicon with geometric design
- 📱 **PWA Support**: Add to home screen capability

---

## 🗺️ Project Roadmap

- [x] **Core Architecture**: Spring Boot + Angular setup
- [x] **Authentication**: Secure login/register for all roles
- [x] **Farmer Module**: Product upload & management
- [x] **Distributor/Retailer**: Marketplace & inventory
- [x] **Consumer Experience**: Product verification
- [x] **Admin Panel**: Analytics & user management
- [x] **Modern UI/UX**: Professional design with glassmorphism
- [x] **Password Toggles**: Enhanced security UX
- [x] **Cloud Deployment**: Vercel (Frontend) + Render (Backend)
- [ ] **Mobile App**: React Native/Flutter wrapper
- [ ] **Blockchain Integration**: Ethereum/Hyperledger
- [ ] **AI Quality Scoring**: Enhanced computer vision
- [ ] **Real-time Notifications**: WebSocket implementation

---

## 👥 Contributors

- **Subash Kumar** - Full Stack Developer
- [GitHub](https://github.com/Subashkumawat34/FarmChainX)

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Contact & Support

- **Email**: farmchainx@example.com
- **GitHub**: [FarmChainX Repository](https://github.com/Subashkumawat34/FarmChainX)
- **Live Demo**: [farmchainx.vercel.app](https://farmchainx.vercel.app)

---

**FarmChainX** — *Empowering Agriculture with Technology. From Soil to Shelf.*

---

### Recent Updates (January 2026)
- ✨ Implemented modern UI with glassmorphism effects
- 🎨 Added professional color palette (emerald/teal)
- 👁️ Password visibility toggles on all forms
- 🔤 Professional typography with Google Fonts
- 📱 Enhanced SEO and social media meta tags
- 🚀 Deployed to production (Vercel + Render)
- 🎯 Custom favicon with geometric brand design
