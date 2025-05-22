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
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
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
      setError("Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admindashboard/users/${id}`
      );
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError("Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const handleBlockToggle = async (id) => {
    try {
      const user = users.find((u) => u._id === id);
      const response = await axios.put(
        `http://localhost:5000/api/admindashboard/users/${id}/status`,
        { status: user.status === "active" ? "blocked" : "active" }
      );
      setUsers(users.map((u) => (u._id === id ? response.data : u)));
    } catch (err) {
      setError("Failed to update user status");
      console.error("Error updating user status:", err);
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
      setError("Failed to update role");
      console.error("Failed to update role", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
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
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
        User Management
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border min-w-[120px]">Role</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className={`${
                  user.status === "blocked" ? "bg-red-50" : ""
                } hover:bg-gray-50`}
              >
                <td className="px-4 py-3 border">{user.name}</td>
                <td className="px-4 py-3 border">{user.email}</td>
                <td className="px-4 py-3 border">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 border font-semibold">
                  <span
                    className={
                      user.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 border space-y-1 sm:space-y-0 sm:space-x-2 sm:flex sm:flex-wrap">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded m-2 hover:bg-blue-600"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded m-2 hover:bg-red-600"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleBlockToggle(user._id)}
                    className={`${
                      user.status === "active"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white px-3 m-2 py-1 rounded`}
                  >
                    {user.status === "active" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Role</label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
