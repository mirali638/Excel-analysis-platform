import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import this

const Logout = () => {
  const navigate = useNavigate(); // Call the hook here

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        localStorage.removeItem("token");
        navigate("/login"); // Use it here
      } catch (error) {
        console.error("Logout failed:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate]);

  return null;
};

export default Logout;
