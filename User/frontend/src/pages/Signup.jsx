import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://excel-analysis-platform-s54m.onrender.com/api/auth/signup", form);
      alert("Signup successful. Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  useEffect(() => {
    setForm({ name: "", email: "", password: "" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-green-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transition hover:shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <img src="/Excel_logo.jpg" alt="Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-3xl font-bold text-green-600">Create Account</h2>
          <p className="text-gray-600 text-sm">Join us and start analyzing today</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full shadow-md transition hover:scale-105"
          >
            Sign Up
          </button>

          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?
              <Link to="/login" className="text-green-600 font-semibold underline ml-1">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
