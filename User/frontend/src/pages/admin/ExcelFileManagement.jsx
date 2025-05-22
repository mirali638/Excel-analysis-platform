import React, { useState, useEffect } from "react";

const ExcelFileManagement = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/admindashboard/excel/files`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load files");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      fetch(`http://localhost:5000/api/admindashboard/excel/files/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Delete failed");
          setFiles(files.filter((file) => file._id !== id));
        })
        .catch(() => alert("Failed to delete file"));
    }
  };

  const handleDownload = (id) => {
    fetch(`http://localhost:5000/api/admindashboard/excel/files/${id}/download`)
      .then((res) => {
        if (res.ok) {
          return res.blob();
        } else {
          throw new Error("Download failed");
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "filename.xlsx"; // You can make this dynamic if you want
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert("Download failed"));
  };

  const handleViewMetadata = (id) => {
    fetch(`http://localhost:5000/api/admindashboard/excel/files/${id}`)
      .then((res) => res.json())
      .then((data) => setSelectedFile(data))
      .catch(() => alert("Failed to load file details"));
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 font-semibold">
        Loading files...
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="p-6 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-extrabold tracking-wide text-gray-900">
          Excel File Management
        </h2>
      </div>

      {/* Scrollable container to avoid table overflow */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="w-1/4 px-2 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide whitespace-normal break-words"
                style={{ minWidth: "120px" }}
              >
                File Name
              </th>
              <th
                className="w-1/5 px-2 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide whitespace-normal break-words"
                style={{ minWidth: "120px" }}
              >
                Uploaded By
              </th>
              <th
                className="w-1/12 px-2 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide whitespace-nowrap"
                style={{ minWidth: "60px" }}
              >
                Size
              </th>
              <th
                className="w-1/12 px-2 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide whitespace-nowrap"
                style={{ minWidth: "70px" }}
              >
                Status
              </th>
              <th
                className="w-1/5 px-2 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide whitespace-normal break-words"
                style={{ minWidth: "120px" }}
              >
                Upload Date
              </th>
              <th
                className="w-1/6 px-2 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide"
                style={{ minWidth: "140px" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {files.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-500 py-6 select-none"
                >
                  No files uploaded yet.
                </td>
              </tr>
            )}
            {files.map((file) => (
              <tr key={file._id} className="hover:bg-gray-50 transition">
                <td
                  className="px-2 py-3 max-w-[200px] truncate"
                  title={file.originalName}
                >
                  {file.originalName}
                </td>
                <td
                  className="px-2 py-3 max-w-[150px] truncate"
                  title={file.uploadedBy?.name || "Unknown"}
                >
                  {file.uploadedBy?.name || "Unknown"}
                </td>
                <td className="px-2 py-3 whitespace-nowrap">{file.size}</td>
                <td className="px-2 py-3 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-block text-xs font-semibold rounded-full select-none ${
                      file.status === "processed"
                        ? "bg-green-100 text-green-800"
                        : file.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {file.status}
                  </span>
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-gray-600">
                  {new Date(file.createdAt).toLocaleDateString()}
                </td>
                <td className="px-2 py-3 whitespace-nowrap">
                  {/* Vertical stack of action buttons */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleViewMetadata(file._id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDownload(file._id)}
                      className="text-green-600 hover:text-green-800 font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="text-red-600 hover:text-red-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for selected file details */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">File Details</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="space-y-6 text-gray-800 text-sm sm:text-base">
              <section>
                <h4 className="font-semibold mb-2 text-gray-900">
                  File Information
                </h4>
                <p>
                  <strong>Name:</strong> {selectedFile.originalName}
                </p>
                <p>
                  <strong>Size:</strong> {selectedFile.size}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold select-none ${
                      selectedFile.status === "processed"
                        ? "bg-green-100 text-green-800"
                        : selectedFile.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedFile.status}
                  </span>
                </p>
              </section>

              <section>
                <h4 className="font-semibold mb-2 text-gray-900">
                  Upload Information
                </h4>
                <p>
                  <strong>Uploaded By:</strong>{" "}
                  {selectedFile.uploadedBy?.name || "Unknown"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedFile.createdAt).toLocaleString()}
                </p>
              </section>

              {selectedFile.metadata ? (
                <section>
                  <h4 className="font-semibold mb-2 text-gray-900">Metadata</h4>
                  <pre className="bg-gray-100 rounded p-3 overflow-x-auto text-xs sm:text-sm">
                    {JSON.stringify(selectedFile.metadata, null, 2)}
                  </pre>
                </section>
              ) : (
                <p className="italic text-gray-600">No metadata available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelFileManagement;
