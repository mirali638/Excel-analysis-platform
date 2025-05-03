import React from "react";
import { useNavigate } from "react-router-dom";
const UserDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div>
      <div>User Dashboard</div>
    </div>
  );
};

export default UserDashboard;
