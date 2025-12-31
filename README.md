# 🏪 Nasiry POS - Point of Sale & Bill Management System

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

**A comprehensive Point of Sale system with invoice creation, bill management, and customer tracking capabilities.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

Nasiry POS is a full-stack Point of Sale and bill management system designed for retail businesses. It provides comprehensive tools for managing customer bills, generating invoices, tracking weekly payments, and analyzing business performance. The system features a modern, responsive interface built with Next.js and a robust backend powered by Express.js and MongoDB.

## ✨ Features

### 🧾 Bill Management
- **Create and manage customer bills** with unique bill numbers
- **Weekly tracking system** for installment payments
- **Automatic calculation** of remaining amounts and carry-forwards
- **Bill status management** (Active/Closed)
- **Customer information tracking** (Name, Address, Phone, Area)

### 📄 Invoice Generation
- **Quick invoice creation** linked to customer bills
- **Automatic invoice numbering**
- **Date and amount tracking**
- **PDF export capabilities** using jsPDF
- **Print-ready invoice templates**

### 👥 Customer Management
- **Comprehensive customer database**
- **Customer search and filtering**
- **Purchase history tracking**
- **Area-based customer organization**

### 📊 Analytics Dashboard
- **Real-time business metrics**
- **Revenue tracking and visualization**
- **Weekly performance reports**
- **Customer analytics**
- **Interactive charts** powered by modern UI components

### 🔐 Authentication & Security
- **Secure JWT-based authentication**
- **Password hashing with bcryptjs**
- **Protected routes and API endpoints**
- **Cookie-based session management**

### 🎨 Modern UI/UX
- **Responsive design** for all devices
- **Dark mode support** with next-themes
- **Smooth animations** using GSAP
- **Beautiful components** with Radix UI
- **Toast notifications** for user feedback
- **Form validation** with React Hook Form and Zod

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15.3.2 (App Router)
- **UI Library:** React 18.3.1
- **Styling:** Tailwind CSS 4
- **State Management:** Redux Toolkit
- **Form Handling:** React Hook Form + Zod validation
- **UI Components:** Radix UI (Dialog, Dropdown, Toast, etc.)
- **Animations:** GSAP
- **PDF Generation:** jsPDF + jsPDF-AutoTable
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 4.21.2
- **Database:** MongoDB (Mongoose 8.15.0)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Cloud Storage:** Cloudinary
- **Payment Integration:** PayPal REST SDK
- **CORS:** cors middleware
- **Environment Variables:** dotenv

### DevOps & Deployment
- **Hosting:** Vercel
- **Database:** MongoDB Atlas
- **Version Control:** Git

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- Git

### Clone the Repository
```bash
git clone https://github.com/yourusername/nasiry-pos.git
cd nasiry-pos
```

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# PayPal (optional)
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: Add any other environment variables
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🚀 Usage

### Running in Development Mode

1. **Start Backend:**
```bash
cd Backend
npm start
```

2. **Start Frontend (in a new terminal):**
```bash
cd frontend
npm run dev
```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Building for Production

#### Frontend
```bash
cd frontend
npm run build
npm start
```

#### Backend
The backend runs the same in production, but ensure:
- Environment variables are properly set
- MongoDB Atlas is configured
- CORS origins include your production domain

## 📚 API Documentation

### Authentication Endpoints

#### POST `/auth/register`
Register a new admin user.

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "securepassword"
}
```

#### POST `/auth/login`
Login with credentials.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

### Bill Endpoints

#### GET `/bill/all`
Get all bills for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

#### POST `/bill/create`
Create a new bill.

**Request Body:**
```json
{
  "billNo": 1001,
  "customerName": "John Doe",
  "customerAddress": "123 Main St",
  "customerPhone": "+1234567890",
  "customerArea": "Downtown"
}
```

#### PUT `/bill/update/:id`
Update an existing bill.

#### DELETE `/bill/delete/:id`
Delete a bill.

#### POST `/bill/add-week/:id`
Add a new week to a bill with invoices.

### Invoice Endpoints

#### GET `/invoice/all`
Get all invoices.

#### POST `/invoice/create`
Create a new invoice.

**Request Body:**
```json
{
  "invoiceNo": "INV-001",
  "date": "2024-01-01",
  "amount": 1000,
  "billNo": "1001"
}
```

#### DELETE `/invoice/delete/:id`
Delete an invoice.

## 📁 Project Structure

```
nasiry-pos/
├── Backend/
│   ├── controllers/        # Business logic
│   ├── models/            # Mongoose schemas
│   │   ├── Admin.js       # Admin user model
│   │   ├── Bill.js        # Bill model with weekly tracking
│   │   └── Invoice.js     # Invoice model
│   ├── routes/            # API routes
│   │   ├── auth-routes.js
│   │   ├── bill-routes.js
│   │   └── invoice-routes.js
│   ├── utils/             # Utility functions
│   │   └── db.js          # Database connection
│   ├── .env               # Environment variables (not in repo)
│   ├── server.js          # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── app/               # Next.js app directory
│   │   ├── (pages)/       # Application pages
│   │   │   ├── analytics/ # Analytics dashboard
│   │   │   ├── bills/     # Bill management
│   │   │   ├── customers/ # Customer management
│   │   │   ├── dashboard/ # Main dashboard
│   │   │   ├── login/     # Authentication
│   │   │   └── profile/   # User profile
│   │   ├── layout.jsx     # Root layout
│   │   └── globals.css    # Global styles
│   ├── components/        # Reusable React components
│   ├── redux/             # Redux store and slices
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── public/            # Static assets
│   ├── .env.local         # Frontend environment variables (not in repo)
│   └── package.json
│
├── .gitignore
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

## 🔒 Security

- All passwords are hashed using bcryptjs before storage
- JWT tokens are used for authentication
- Protected API routes require valid authentication tokens
- CORS is configured to allow only trusted origins
- Environment variables are used for sensitive data

For security concerns, please see [SECURITY.md](SECURITY.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**RDX**

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

For support, email support@nasiry.com or open an issue in the GitHub repository.

---

<div align="center">
Made with ❤️ by RDX
</div>
