import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/Login";
import SignUpForm from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/Admindashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
// Admin module pages
import WelcomeAdmin from "./pages/admin/WelcomeAdmin";
import UserManagement from "./pages/admin/UserManagement";
import DashboardOverview from "./pages/admin/DashboardOverview";
import ExcelFileManagement from "./pages/admin/ExcelFileManagement";
import SettingsConfig from "./pages/admin/SettingsConfig";
import ActivityLogs from "./pages/admin/ActivityLogs";
import ChartAnalytics from "./pages/admin/ChartAnalytics";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />

        {/* Protect the user route */}
        <Route
          path="/userdashboard/*"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protect the admin route with nested routes */}
        <Route
          path="/admindashboard/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<WelcomeAdmin />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="files" element={<ExcelFileManagement />} />
          <Route path="charts" element={<ChartAnalytics />} />
          <Route path="logs" element={<ActivityLogs />} />
          <Route path="settings" element={<SettingsConfig />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
