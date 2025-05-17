import React, { useState } from "react";

// Mock data for demonstration purposes
const mockFiles = [
  {
    id: 1,
    fileName: "sales_report_Q1_2024.xlsx",
    uploadedBy: "Admin User",
    size: "1.2MB",
    status: "processed",
    uploadDate: "2024-03-15T10:00:00Z",
    metadata: {
      sheets: ["Sheet1", "Summary"],
      rowCount: 500,
      columnCount: 15,
      lastModified: "2024-03-15T10:00:00Z",
    },
  },
  {
    id: 2,
    fileName: "customer_data.csv",
    uploadedBy: "Regular User",
    size: "500KB",
    status: "processing",
    uploadDate: "2024-03-16T11:30:00Z",
    metadata: {
      sheets: [],
      rowCount: 1200,
      columnCount: 8,
      lastModified: "2024-03-16T11:30:00Z",
    },
  },
  {
    id: 3,
    fileName: "inventory_list.xlsx",
    uploadedBy: "Admin User",
    size: "800KB",
    status: "failed",
    uploadDate: "2024-03-14T09:15:00Z",
    metadata: null,
  },
];

const ExcelFileManagement = () => {
  const [files, setFiles] = useState(mockFiles); // State to hold file list
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file details

  // Delete file from the list
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setFiles(files.filter((file) => file.id !== id));
    }
  };

  // Simulate download action
  const handleDownload = (id) => {
    const fileToDownload = files.find((file) => file.id === id);
    if (fileToDownload) {
      alert(`Mock Download: Initiating download for file: ${fileToDownload.fileName}`);
    }
  };

  // Show metadata modal
  const handleViewMetadata = (id) => {
    const fileDetails = files.find((file) => file.id === id);
    if (fileDetails) {
      setSelectedFile(fileDetails);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Excel File Management</h2>
      </div>

      {/* File table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.id}>
                <td className="px-6 py-4">{file.fileName}</td>
                <td className="px-6 py-4">{file.uploadedBy}</td>
                <td className="px-6 py-4">{file.size}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs font-semibold rounded-full 
                    ${file.status === 'processed' ? 'bg-green-100 text-green-800' :
                      file.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {file.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(file.uploadDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button onClick={() => handleViewMetadata(file.id)} className="text-blue-600 hover:text-blue-900">
                    View Details
                  </button>
                  <button onClick={() => handleDownload(file.id)} className="text-green-600 hover:text-green-900">
                    Download
                  </button>
                  <button onClick={() => handleDelete(file.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying file metadata */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">File Details (Mock Data)</h3>
              <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">File Information</h4>
                <p>Name: {selectedFile.fileName}</p>
                <p>Size: {selectedFile.size}</p>
                <p>Status: {selectedFile.status}</p>
              </div>
              <div>
                <h4 className="font-semibold">Upload Information</h4>
                <p>Uploaded by: {selectedFile.uploadedBy}</p>
                <p>Date: {new Date(selectedFile.uploadDate).toLocaleString()}</p>
              </div>
              {selectedFile.metadata ? (
                <div>
                  <h4 className="font-semibold">Excel Metadata (Mock)</h4>
                  <p>Sheets: {selectedFile.metadata.sheets?.join(', ') || 'N/A'}</p>
                  <p>Rows: {selectedFile.metadata.rowCount || 'N/A'}</p>
                  <p>Columns: {selectedFile.metadata.columnCount || 'N/A'}</p>
                  <p>Last Modified: {selectedFile.metadata.lastModified ? new Date(selectedFile.metadata.lastModified).toLocaleString() : 'N/A'}</p>
                </div>
              ) : (
                <p className="text-gray-500">No metadata available for this file.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelFileManagement;