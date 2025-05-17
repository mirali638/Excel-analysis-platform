import React, { useState, useEffect } from "react";
import axios from "../../axios";

const AISummaryMonitor = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/ai-summaries');
      setSummaries(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch AI summaries');
      console.error('Error fetching summaries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateSummary = async (id) => {
    try {
      const response = await axios.post(`/admin/ai-summaries/${id}/regenerate`);
      setSummaries(summaries.map(summary => 
        summary.id === id ? response.data : summary
      ));
    } catch (err) {
      setError('Failed to regenerate summary');
      console.error('Error regenerating summary:', err);
    }
  };

  const filteredSummaries = summaries.filter(summary => {
    if (filter === 'all') return true;
    return summary.status === filter;
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">AI Summary Monitor</h2>

      {/* Filter Controls */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Summaries</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSummaries.map((summary) => (
          <div key={summary.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{summary.fileName}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                summary.status === 'completed' ? 'bg-green-100 text-green-800' :
                summary.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {summary.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {summary.summary}
            </p>
            
            <div className="text-sm text-gray-500 mb-4">
              <p>Generated: {new Date(summary.generatedAt).toLocaleString()}</p>
              <p>Confidence Score: {summary.confidenceScore}%</p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedSummary(summary)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                View Details
              </button>
              <button
                onClick={() => handleRegenerateSummary(summary.id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Regenerate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Detail Modal */}
      {selectedSummary && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedSummary.fileName}</h3>
              <button
                onClick={() => setSelectedSummary(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-gray-700">{selectedSummary.summary}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Insights</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedSummary.keyInsights.map((insight, index) => (
                    <li key={index} className="text-gray-700">{insight}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Metadata</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Generated At</p>
                    <p>{new Date(selectedSummary.generatedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Confidence Score</p>
                    <p>{selectedSummary.confidenceScore}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Processing Time</p>
                    <p>{selectedSummary.processingTime}s</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p>{selectedSummary.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISummaryMonitor; 