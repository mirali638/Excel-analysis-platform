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

      // Decode token to get role
      const payload = JSON.parse(atob(token.split(".")[1]));
      const { role } = payload;

      // Redirect based on role
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
    // Clear form data on page load
    setForm({ email: "", password: "" });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
              autoComplete="off"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Login
            </button>
          </div>
          <div className="flex items-center justify-center mt-4">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-700 underline ml-1">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
