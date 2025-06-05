const express = require("express");
const cors = require("cors");
const session = require("express-session"); // ✅ You missed this line
const dotenv = require("dotenv");
const path = require('path');
const connectDB = require("./config/db");
const adminRoutes = require("../backend/routes/adminRoutes");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const profileRoutes = require("./routes/profileRoutes");
const fileRoutes = require("./routes/fileRoutes");
const chartRoutes = require("./routes/chartRoutes");
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow cookies
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/", contactRoutes); // /api/contact
app.use("/api/profile", profileRoutes); // /api/profile
app.use("/api/files", fileRoutes);
app.use("/api/charts", chartRoutes);

//Admin
app.use("/api/admindashboard", adminRoutes);
app.use("/api/admindashboard/users", adminRoutes);
app.use("/api/admindashboard/excel", adminRoutes);
app.use("/api/admindashboard/excel", adminRoutes);
app.use("/api/admindashboard/activity", adminRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
