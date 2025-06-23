import React, { useEffect, useState } from "react";
import axios from "axios";
import ScrollToTop from "../components/ScrollToTop";

const History = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUploads = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found.");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/files/my-uploads",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUploads(res.data.uploads || []);
    } catch (error) {
      console.error("Failed to fetch uploads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <ScrollToTop />
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-10">
          Your Upload History
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading upload history...</p>
        ) : uploads.length === 0 ? (
          <p className="text-center text-gray-500">No uploads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">Filename</th>
                  <th className="p-3 border-b">Upload Date</th>
                  <th className="p-3 border-b">Row Count</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload) => (
                  <tr key={upload._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{upload.originalName}</td>
                    <td className="p-3">
                      {new Date(upload.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3">{upload.rowCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
