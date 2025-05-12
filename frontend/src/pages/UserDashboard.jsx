import Navbar from "../components/Navbar";
import Welcome from "./Welcome";
import Upload from "./Upload";
import History from "./History";
import Profile from "./Profile";
import About from "./About";
import Contact from "./Contact";
import Logout from "./Logout";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "../components/Footer";
function UserDashboard() {
  return (
    <div>
      <Navbar />
      <div className="pt-20">
        {" "}
        {/* Add padding so content doesn't hide under fixed navbar */}
        <Routes>
          {/* Default route redirecting to welcome */}
          <Route index element={<Navigate to="welcome" />} />

          {/* Nested routes (no /userdashboard prefix here) */}
          <Route path="welcome" element={<Welcome />} />
          <Route path="upload" element={<Upload />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default UserDashboard;
