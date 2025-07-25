# Excel-analysis-platform

## Overview
Excel Analysis Platform is a full-stack web application that empowers users to effortlessly upload, analyze, and visualize Excel data. It provides dynamic 2D/3D charting, interactive dashboards, and robust admin controls, making complex data approachable for analysts, business professionals, and enthusiasts.

---

## Features
- **Upload & Process Excel/CSV Files**: Seamless upload and parsing of `.xls`, `.xlsx`, and `.csv` files.
- **Dynamic Visualization**: Create 2D/3D charts (bar, line, pie, scatter, radar, etc.).
- **Interactive & Responsive UI**: Modern, mobile-friendly React interface.
- **User Authentication**: Secure login, signup, and session management.
- **Profile Management**: Update user details and manage account.
- **Admin Dashboard**: User management, file management, activity logs, and analytics.
- **Contact & Feedback**: Built-in contact form for user queries.
- **Activity Logging**: Track user actions for auditing.

---

## Technologies Used
### Frontend
- React (with Vite)
- Tailwind CSS
- Chart.js, Plotly.js, react-plotly.js
- Axios
- React Router DOM
- Three.js (for 3D charts)
- jsPDF, html2canvas, html-to-image (exporting charts)

### Backend
- Node.js, Express.js
- MongoDB (via Mongoose)
- Multer (file uploads)
- JWT (authentication)
- bcryptjs (password hashing)
- Nodemailer (emails)
- dotenv, cors, express-session
- xlsx (Excel parsing)

---

## Folder Structure
```
Excel-analysis-platform/
├── User/
│   ├── backend/
│   │   ├── config/           # DB config
│   │   ├── controllers/      # Route controllers (auth, file, chart, etc.)
│   │   ├── middlewares/      # Auth, user status, etc.
│   │   ├── models/           # Mongoose models (User, File, Chart, etc.)
│   │   ├── routes/           # Express routes (auth, admin, file, etc.)
│   │   ├── uploads/          # Uploaded files
│   │   ├── utils/            # Utility functions (logging, etc.)
│   │   └── server.js         # Main server file
│   └── frontend/
│       ├── public/           # Static assets
│       ├── src/
│       │   ├── assets/       # Images, icons
│       │   ├── components/   # Navbar, Footer, etc.
│       │   ├── pages/        # Main pages (Login, Signup, Upload, etc.)
│       │   │   └── admin/    # Admin dashboard pages
│       │   ├── routes/       # Protected routes
│       │   └── utils/        # Chart utilities, axios config
│       ├── index.html        # App entry
│       └── main.jsx          # React entry
└── README.md
```

---

## Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Backend
```bash
cd User/backend
npm install
# Create a .env file with MongoDB URI and JWT_SECRET
npm start
```

### Frontend
```bash
cd User/frontend
npm install
npm run dev
```

---

## Usage
1. **Register/Login** as a user.
2. **Upload** Excel/CSV files from the dashboard.
3. **Visualize** data with interactive charts.
4. **Admins** can manage users, files, and view activity logs from the admin dashboard.

---

## API & Routes (Backend)
- `/api/auth` - Authentication (login, signup, logout)
- `/api/profile` - User profile management
- `/api/files` - File upload, list, delete
- `/api/charts` - Chart data endpoints
- `/api/admindashboard` - Admin dashboard (users, files, activity, analytics)
- `/api/contact` - Contact form

---

## Contribution
1. Fork the repo & clone locally.
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes & push.
4. Open a Pull Request.

---

*Empowering everyone to turn Excel data into insights!*
