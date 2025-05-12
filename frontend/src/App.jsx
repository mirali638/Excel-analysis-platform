import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/Login";
import SignUpForm from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Welcome from "./pages/Welcome";
function App() {
  return (
    <BrowserRouter>
      {/* ✅ Move this outside <Routes> */}
      <div>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />

          {/* Protected user route */}
          {/* <Route path="/" element={<Welcome />} /> */}
          <Route
            path="/userdashboard/*"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected admin route */}
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
