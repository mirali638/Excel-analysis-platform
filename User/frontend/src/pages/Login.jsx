import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      const token = res.data.token;
      localStorage.setItem("token", token);
       localStorage.setItem("userInfo", JSON.stringify(res.data.user));

      const payload = JSON.parse(atob(token.split(".")[1]));
      const { role } = payload;

      if (role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/userdashboard");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Login failed. Please try again.");
    }
  };

  useEffect(() => {
    setForm({ email: "", password: "" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      {/* Logo */}
      <img
        src="/Excel_logo.jpg"
        alt="Excel Logo"
        className="w-auto h-24 mb-6"
      />

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
        Welcome Back to{" "}
        <span className="text-green-600">Excel Analytics</span>
      </h1>
      <p className="text-gray-600 text-lg mb-6 text-center">
        Log in to continue exploring your data
      </p>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-green-50 p-8 rounded-2xl shadow-md w-full max-w-md space-y-6 border-2 border-green-700"
      >
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold text-lg transition shadow-lg hover:scale-105 cursor-pointer"
        >
          Log In
        </button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-700 underline font-medium">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
