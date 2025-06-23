import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import ScrollToTop from "../components/ScrollToTop";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("User not authenticated");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setFormData(res.data);
      } catch (err) {
        setErrorMessage("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and Email are required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const updated = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };

      const res = await axios.put(
        "http://localhost:5000/api/profile",
        updated,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data);
      setFormData(res.data);
      setSuccessMessage("Profile updated successfully");
      setErrorMessage("");
      setEditMode(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 mb-5 px-6">
      <ScrollToTop />
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32"></div>

        <div className="p-6 -mt-16">
          <div className="flex items-center space-x-6">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                user.name
              }&ts=${Date.now()}`}
              alt="User avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {formData.name}
              </h2>
              <p className="text-sm text-gray-500">{formData.email}</p>
            </div>
            <div className="ml-auto flex space-x-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="p-2 bg-green-500 text-white rounded-full"
                    disabled={loading}
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData(user);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="p-2 bg-blue-500 text-white rounded-full"
                >
                  <FaEdit />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {["name", "email", "phone", "address"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-semibold text-gray-600 capitalize mb-1"
                >
                  {field}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  readOnly={!editMode}
                  className={`w-full px-4 py-2 border ${
                    editMode
                      ? "border-blue-400 focus:outline-blue-500"
                      : "border-gray-200 bg-gray-100"
                  } rounded transition-all`}
                />
              </div>
            ))}
          </div>

          {successMessage && (
            <div className="mt-6 text-green-600 font-semibold">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-6 text-red-600 font-semibold">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
