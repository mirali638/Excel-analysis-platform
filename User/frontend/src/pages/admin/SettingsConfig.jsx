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
  const [settings, setSettings] = useState(initialSettings); // State for form settings
  const [success, setSuccess] = useState(false); // State to show success message on save

  // Handle input changes for both checkboxes and text/number inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission (currently only sets success message)
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);  // Hide success message after 2 seconds
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">System Settings</h2>
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Settings updated successfully!
        </div>
      )}
      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Settings */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">File Upload Settings</h3>
          {/* Max file size input */}
          <div className="mb-4">
            <label className="block mb-2">
              Maximum File Size (MB)
              <input
                type="number"
                name="maxFileSize"
                value={settings.maxFileSize}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                min="1"
                max="100"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Allowed File Types
              <input
                type="text"
                name="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                placeholder=".xlsx, .xls"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="autoProcessFiles"
                checked={settings.autoProcessFiles}
                onChange={handleChange}
                className="mr-2"
              />
              Auto-process uploaded files
            </label>
          </div>
        </div>
        {/* Notification Settings */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="mr-2"
              />
              Enable email notifications
            </label>
          </div>
        </div>
        {/* Data Retention Settings */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Data Retention</h3>
          <div className="mb-4">
            <label className="block mb-2">
              File Retention Period (days)
              <input
                type="number"
                name="retentionPeriod"
                value={settings.retentionPeriod}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-3 py-2"
                min="1"
                max="365"
              />
            </label>
          </div>
        </div>
        {/* Feature Toggles */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Feature Toggles</h3>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enable3DCharts"
                checked={settings.enable3DCharts}
                onChange={handleChange}
                className="mr-2"
              />
              Enable 3D Charts
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enableAISummary"
                checked={settings.enableAISummary}
                onChange={handleChange}
                className="mr-2"
              />
              Enable AI Summary
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enableExport"
                checked={settings.enableExport}
                onChange={handleChange}
                className="mr-2"
              />
              Enable Export (PDF/Image)
            </label>
          </div>
        </div>
        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsConfig; 