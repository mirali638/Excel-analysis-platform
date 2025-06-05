import React, { useState, useEffect } from "react";

const ExcelFileManagement = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/admindashboard/excel/files")
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
        if (res.ok) return res.blob();
        throw new Error("Download failed");
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          files.find((file) => file._id === id)?.originalName || "Unknown";
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-10">
        📁 Excel File Management
      </h2>

      {loading && (
        <div className="text-center text-gray-600 font-medium">
          Loading files...
        </div>
      )}
      {error && (
        <div className="text-center text-red-600 font-medium">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.length === 0 ? (
            <div className="text-center text-gray-500 py-6 col-span-full">
              No files uploaded yet.
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file._id}
                className="rounded-2xl border border-gray-200 shadow-lg p-5 flex flex-col justify-between group max-w-full
                  transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-green-400"
              >
                {/* File Details */}
                <div className="mb-4 space-y-1 text-gray-700 leading-relaxed">
                  <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-green-700 transition">
                    {file.originalName}
                  </h3>
                  <p className="text-sm text-gray-500 italic">
                    Uploaded by:{" "}
                    <span className="not-italic text-gray-700 font-medium">
                      {file.uploadedBy?.name || "Unknown"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    📦 Size:{" "}
                    <span className="font-medium text-black">{file.size}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    🧭 Status:{" "}
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        file.status === "processed"
                          ? "bg-green-100 text-green-700"
                          : file.status === "processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {file.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    📅 Uploaded:{" "}
                    <span className="text-gray-800 font-medium">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                <hr className="border-t border-dashed border-gray-300 my-3" />

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 text-sm">
                  <button
                    onClick={() => handleViewMetadata(file._id)}
                    className="w-full bg-blue-600 text-white font-semibold rounded-lg py-2 px-4 shadow hover:bg-blue-700 hover:shadow-md transition duration-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDownload(file._id)}
                    className="w-full bg-green-600 text-white font-semibold rounded-lg py-2 px-4 shadow hover:bg-green-700 hover:shadow-md transition duration-200"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="w-full bg-red-600 text-white font-semibold rounded-lg py-2 px-4 shadow hover:bg-red-700 hover:shadow-md transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for File Metadata */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative border border-green-400"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">File Details</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6 text-gray-800 text-sm sm:text-base">
              <section>
                <h4 className="font-semibold text-gray-900 mb-2">
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
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
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
                <h4 className="font-semibold text-gray-900 mb-2">
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

              <section>
                <h4 className="font-semibold text-gray-900 mb-2">Metadata</h4>
                {selectedFile.metadata ? (
                  <pre className="bg-gray-100 rounded p-4 overflow-x-auto text-xs sm:text-sm">
                    {JSON.stringify(selectedFile.metadata, null, 2)}
                  </pre>
                ) : (
                  <p className="italic text-gray-600">No metadata available.</p>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelFileManagement;
