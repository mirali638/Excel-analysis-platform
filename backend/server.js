const express = require("express");
const cors = require("cors");
const session = require("express-session"); // ✅ You missed this line
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const profileRoutes = require("./routes/profileRoutes");
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

app.use(express.json());

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
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
