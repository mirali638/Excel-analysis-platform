import React, { useState } from "react";
import axios from "axios";
import ScrollToTop from "../components/ScrollToTop";
const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );
      setStatus({ loading: false, success: res.data.message, error: null });
      setFormData({ fullName: "", email: "", message: "" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setStatus({ loading: false, success: null, error: errorMsg });
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-6">
      <ScrollToTop />
      <div className="max-w-4xl mx-auto bg-green-400 rounded-xl shadow-lg p-8 space-y-10">
        <h2 className="text-4xl font-bold text-center text-white">
          Contact Us
        </h2>

        <div className="grid md:grid-cols-2 gap-8 border-t-4 border-white">
          {/* Contact Info */}
          <div className="space-y-6 mt-3">
            <div>
              <h4 className="text-xl font-bold text-white">📧 Email</h4>
              <p className="text-white">support@excelanalysisplatform.com</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">📞 Phone</h4>
              <p className="text-white">+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">📍 Address</h4>
              <p className="text-white">
                123 Data Street, Analytics City, CA 94000
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            <div>
              <label className="block text-white font-bold mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your Name"
                required
                className="w-full border-2 border-white rounded-md px-4 py-2 focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your Email"
                className="w-full border-2 border-white rounded-md px-4 py-2 focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div>
              <label className="block text-white font-bold mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter your Message"
                className="w-full border-2 border-white rounded-md px-4 py-2 focus:ring-2 focus:ring-lime-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-800 transition"
              disabled={status.loading}
            >
              {status.loading ? "Sending..." : "Send Message"}
            </button>

            {/* Feedback Messages */}
            {status.success && (
              <p className="text-green-800 font-semibold mt-2">
                ✅ {status.success}
              </p>
            )}
            {status.error && (
              <p className="text-red-800 font-semibold mt-2">
                ❌ {status.error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
