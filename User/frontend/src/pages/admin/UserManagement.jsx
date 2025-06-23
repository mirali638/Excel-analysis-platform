import React, { useState, useEffect } from "react";
import axios from "../../axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/admindashboard/users"
      );
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("❌ Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admindashboard/users/${editingUser._id}`,
        editForm
      );
      setUsers(
        users.map((u) => (u._id === editingUser._id ? response.data : u))
      );
      setEditingUser(null);
    } catch (err) {
      setError("❌ Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admindashboard/users/${id}`
      );
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError("❌ Failed to delete user.");
    }
  };

  const handleBlockToggle = async (id) => {
    try {
      const user = users.find((u) => u._id === id);
      const newStatus = user.status === "active" ? "blocked" : "active";
      const response = await axios.put(
        `http://localhost:5000/api/admindashboard/users/${id}/status`,
        { status: newStatus }
      );
      setUsers(users.map((u) => (u._id === id ? response.data : u)));
    } catch (err) {
      setError("❌ Failed to update status.");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admindashboard/users/${id}`,
        { role: newRole }
      );
      setUsers(users.map((u) => (u._id === id ? response.data : u)));
    } catch (err) {
      setError("❌ Failed to update role.");
    }
  };

  const UserCard = ({ user }) => {
    const isBlocked = user.status === "blocked";

    return (
      <div
        className={`rounded-2xl border border-gray-200 shadow-lg p-5 flex flex-col gap-4 max-w-full sm:max-w-[400px] break-words
          transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-green-400
          ${
            isBlocked
              ? "bg-red-100/80"
              : "bg-gradient-to-br from-white to-gray-50"
          }`}
      >
        <h3 className="text-lg font-semibold text-gray-800 break-words">
          {user.name}
        </h3>
        <p className="text-gray-600 text-sm break-all">{user.email}</p>

        <div className="flex justify-between items-center text-sm flex-wrap gap-2">
          <span className="font-medium">
            Status:{" "}
            <span
              className={`font-bold ${
                isBlocked ? "text-red-600" : "text-green-600"
              }`}
            >
              {user.status}
            </span>
          </span>
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(user._id, e.target.value)}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => handleEdit(user)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg shadow hover:shadow-md transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(user._id)}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-lg shadow hover:shadow-md transition"
          >
            Delete
          </button>
          <button
            onClick={() => handleBlockToggle(user._id)}
            className={`text-white text-sm px-4 py-1.5 rounded-lg shadow hover:shadow-md transition ${
              user.status === "active"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {user.status === "active" ? "Block" : "Unblock"}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">{error}</div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      <h2 className="text-4xl font-extrabold text-green-700 text-center mb-12 tracking-tight drop-shadow-sm">
        👥 User Management
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 transition-all transform scale-100">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;