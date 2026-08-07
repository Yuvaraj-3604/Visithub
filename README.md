# 🏢 VisitHub — Visitor Pass Management System

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.2-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v8.2-646CFF?logo=vite)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express-v4.19-000000?logo=express)](https://expressjs.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment%20Ready-000000?logo=vercel)](./vercel.md)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**VisitHub** is an enterprise-grade, full-stack **Visitor Pass Management System** built on the MERN stack (MongoDB, Express, React 19, Node.js). Designed for modern offices and enterprise facilities, VisitHub features Role-Based Access Control (RBAC), real-time visitor lifecycle tracking, digital visitor pass generation, interactive analytics dashboards, audit activity logging, and strict automated business rule enforcement.

---

## 🌟 Key Features & Highlights

### 🛡️ 1. Role-Based Access Control (RBAC)
Dedicated user consoles tailored to organizational workflows:
- **Admin Console**: Full administrative oversight, employee directory management, user login provision, audit logs, and system analytics.
- **Receptionist Console**: Seamless visitor check-in/out desk, express visitor registration, digital pass generation, and live visitor directory.
- **Employee Host Console**: Personal visitor host portal for approving/rejecting incoming visitor requests with custom host remarks.

### 🎫 2. Digital Visitor Pass Generation
- Automatic badge/pass issuance upon receptionist check-in.
- Includes visitor details, host information, entry/exit timestamps, pass status, and printable layout.

### 💼 3. Enforced Business Rule Engine
10 automated operational rules validated server-side to ensure compliance and security:
1. **Single Active Visit Limit**: A visitor cannot hold more than one active visit (`pending`, `approved`, or `checked_in`) simultaneously.
2. **Duplicate Registration Prevention**: Prevents duplicate registrations for the same visitor contact on the same date.
3. **Future & Present Date Guard**: Visit date cannot be earlier than today's date.
4. **Arrival Time Validation**: Arrival time for today's visits cannot be in the past.
5. **Host Queue Limit**: Host employees cannot have more than 3 pending visitor requests awaiting action.
6. **Approval Requirement**: Visitors can only be checked in after receiving host approval.
7. **Single Check-In Restriction**: Prevents double check-ins for already checked-in visitors.
8. **Chronological Time Ordering**: Check-out timestamp must always be later than check-in timestamp.
9. **Rejection Safeguard**: Rejected requests cannot be checked in by receptionists.
10. **Clean Desk View**: Cancelled visits are automatically filtered out from active desk views.

### 📊 4. Analytics & Activity Audit Logs
- Comprehensive metrics: Total visits, active visits, checked-in count, pending approvals, and rejection rates.
- Date range filtering and printable summary reports.
- Real-time audit log tracking user activities, logins, and status updates across the system.

### 🎧 5. Integrated Help & Support System
- Built-in ticket submission portal for reporting issues or requesting assistance.
- Admin support management console to track and resolve user inquiries.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router v7 | Fast Single Page Application (SPA) with responsive glassmorphism UI |
| **Styling** | Vanilla CSS (CSS Custom Properties) | Modern design tokens, dark/light theme, custom CSS components |
| **HTTP Client** | Axios | Promised-based API communication with automatic JWT header handling |
| **Backend** | Node.js (ES Modules), Express.js | Scalable RESTful API architecture |
| **Database** | MongoDB & Mongoose ORM | Document store with schemas, indexes, and validation |
| **Authentication** | JSON Web Tokens (JWT) & BcryptJS | Secure token-based authentication & hashed passwords |
| **Deployment** | Vercel / Render / Railway | Production-ready serverless and static deployment |

---

## 📁 Repository Directory Structure

```text
Visitor Pass Management/
├── client/                     # React 19 + Vite Frontend Application
│   ├── public/                 # Static assets & web manifest
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Sidebar, Cards, Modal)
│   │   ├── context/            # React AuthContext & Global state
│   │   ├── pages/              # Page views (Admin, Receptionist, Employee, Auth, Help)
│   │   ├── routes/             # Protected routes & Navigation rules
│   │   ├── services/           # Axios API services
│   │   ├── index.css           # Global Design Tokens & Utility CSS
│   │   └── App.jsx             # Main Application Entry & Routing
│   ├── index.html              # HTML Entrypoint
│   ├── vite.config.js          # Vite Configuration
│   └── package.json            # Frontend Dependencies & Scripts
│
├── server/                     # Node.js + Express REST API Backend
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # Request handlers (auth, visitor, employee, report, etc.)
│   ├── middleware/             # Auth middleware & Global error handling
│   ├── models/                 # Mongoose Data Schemas (User, Employee, Visitor, Activity, SupportTicket)
│   ├── routes/                 # Express API Endpoint Routers
│   ├── utils/                  # Helper utilities & email senders
│   ├── app.js                  # Express Application setup
│   ├── server.js               # HTTP Server listener
│   ├── seed.js                 # Database Seeding script
│   └── package.json            # Backend Dependencies & Scripts
│
├── README.md                   # Project Documentation
└── vercel.md                   # Vercel Deployment Guide
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/visitor_pass_db`) OR **MongoDB Atlas** Connection URI

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/visitor-pass-management.git
cd visitor-pass-management
```

---

### Step 2: Configure Environment Variables

#### Backend (`server/.env`):
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/visitor_pass_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env`):
Create a `.env` file inside the `client/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Step 3: Install Dependencies

#### Install Backend Dependencies:
```bash
cd server
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

---

### Step 4: Seed the Database
Run the seed script from the `server` directory to populate default users, employees, and roles:
```bash
cd ../server
npm run seed
```

---

### Step 5: Start Development Servers

#### 1. Start the Backend API (Port 5000):
```bash
cd server
npm run dev
```

#### 2. Start the Frontend Client (Port 5173):
In a new terminal window:
```bash
cd client
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Pre-Seeded Test Credentials

Use these credentials to explore the different role-based views:

| Role | Username | Password | Access Rights & Features |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | System analytics, Manage Employees, Create User accounts, Audit activity logs, Reports |
| **Receptionist** | `receptionist` | `receptionist123` | Visitor Desk: New Visitor Registration, Check In, Check Out, Printable Passes |
| **Employee Host** | `employee` | `employee123` | Host Console for *John Doe*: Approve/Reject pending visitor visits |
| **Employee Host 2** | `employee2` | `employee123` | Host Console for *Sarah Smith*: Approve/Reject pending visitor visits |

---

## 📡 API Endpoint Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate user and receive JWT token.
- `GET /api/auth/me` — Get current logged-in user details.

### 👥 Users & Employees (`/api/users` & `/api/employees`)
- `GET /api/employees` — Fetch list of active employee hosts.
- `POST /api/employees` — Add new employee host *(Admin only)*.
- `GET /api/users` — List user login accounts *(Admin only)*.
- `POST /api/users` — Create user login account *(Admin only)*.

### 📋 Visitor Operations (`/api/visitors`)
- `POST /api/visitors` — Register new visitor (Receptionist).
- `GET /api/visitors` — List all visitors with status filters.
- `GET /api/visitors/my-visitors` — Fetch visitor requests assigned to logged-in host.
- `PUT /api/visitors/:id/status` — Approve or reject visit request (Host).
- `PUT /api/visitors/:id/checkin` — Check in approved visitor (Receptionist).
- `PUT /api/visitors/:id/checkout` — Check out active visitor (Receptionist).
- `PUT /api/visitors/:id/cancel` — Cancel visit request.

### 📈 Reports & Audit Logs (`/api/reports` & `/api/activities`)
- `GET /api/reports/dashboard` — Fetch dashboard metrics & visitor stats.
- `GET /api/activities` — Fetch system audit log history *(Admin only)*.

### 🎧 Support (`/api/support`)
- `POST /api/support` — Submit help ticket.
- `GET /api/support` — List help tickets *(Admin/Support view)*.

---

## 🌐 Deployment

For complete, step-by-step instructions on deploying VisitHub to **Vercel** (Frontend static app + Backend Express serverless API + MongoDB Atlas), please refer to the detailed guide:

👉 [**Vercel Deployment Guide (vercel.md)**](./vercel.md)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
