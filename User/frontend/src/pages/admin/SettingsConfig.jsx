import React, { useState } from "react";

const initialSettings = {
  maxFileSize: 10,
  allowedFileTypes: ".xlsx, .xls",
  autoProcessFiles: true,
  emailNotifications: true,
  retentionPeriod: 30,
  enable3DCharts: false,
  enableAISummary: true,
  enableExport: true,
};

const SettingsConfig = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          ⚙️ System Settings
        </h2>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow text-center">
            ✅ Settings updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Settings */}
          <SectionCard title="📁 File Upload Settings">
            <Field label="Maximum File Size (MB)">
              <input
                type="number"
                name="maxFileSize"
                value={settings.maxFileSize}
                onChange={handleChange}
                className="input"
                min="1"
                max="100"
              />
            </Field>
            <Field label="Allowed File Types">
              <input
                type="text"
                name="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={handleChange}
                className="input"
                placeholder=".xlsx, .xls"
              />
            </Field>
            <Checkbox
              name="autoProcessFiles"
              checked={settings.autoProcessFiles}
              onChange={handleChange}
              label="Auto-process uploaded files"
            />
          </SectionCard>

          {/* Notification Settings */}
          <SectionCard title="🔔 Notification Settings">
            <Checkbox
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
              label="Enable email notifications"
            />
          </SectionCard>

          {/* Data Retention */}
          <SectionCard title="🗃️ Data Retention">
            <Field label="File Retention Period (days)">
              <input
                type="number"
                name="retentionPeriod"
                value={settings.retentionPeriod}
                onChange={handleChange}
                className="input"
                min="1"
                max="365"
              />
            </Field>
          </SectionCard>

          {/* Feature Toggles */}
          <SectionCard title="🧩 Feature Toggles">
            <Checkbox
              name="enable3DCharts"
              checked={settings.enable3DCharts}
              onChange={handleChange}
              label="Enable 3D Charts"
            />
            <Checkbox
              name="enableAISummary"
              checked={settings.enableAISummary}
              onChange={handleChange}
              label="Enable AI Summary"
            />
            <Checkbox
              name="enableExport"
              checked={settings.enableExport}
              onChange={handleChange}
              label="Enable Export (PDF/Image)"
            />
          </SectionCard>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
            >
              💾 Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Components
const SectionCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
    <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <label className="block text-gray-700 font-medium mb-2">
    {label}
    <div>{children}</div>
  </label>
);

const Checkbox = ({ name, checked, onChange, label }) => (
  <label className="flex items-center space-x-2 text-gray-700 font-medium">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
    />
    <span>{label}</span>
  </label>
);

export default SettingsConfig;
