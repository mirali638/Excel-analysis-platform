import React, { useState, useEffect } from "react";
import axios from "../../axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);                // Stores all users
  const [loading, setLoading] = useState(true);          // Shows a loading spinner
  const [error, setError] = useState(null);              // Stores any error messages
  const [editingUser, setEditingUser] = useState(null);  // Stores the user being edited
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "user" }); // Form values for edit modal

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/users'); // Send GET request to backend
      setUsers(response.data); // Store the users in state
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user); // Set current user to edit
    setEditForm({ name: user.name, email: user.email, role: user.role }); // Pre-fill form
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/admin/users/${editingUser._id}`, editForm);
      setUsers(users.map(u => u._id === editingUser._id ? response.data : u));  // Update in list
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id)); // Remove user from state
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleBlockToggle = async (id) => {
    try {
      const user = users.find(u => u._id === id);
      const response = await axios.put(`/admin/users/${id}/status`, {
        status: user.status === "active" ? "blocked" : "active"
      });
      setUsers(users.map(u => u._id === id ? response.data : u)); // Update list
    } catch (err) {
      setError('Failed to update user status');
      console.error('Error updating user status:', err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await axios.put(`/admin/users/${id}`, { role: newRole });
      setUsers(users.map(u => u._id === id ? response.data : u));
    } catch (err) {
      console.error("Failed to update role", err);
      setError("Failed to update role");
    }
  };

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
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className={user.status === "blocked" ? "bg-red-50" : ""}>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2 border">
                  <span className={user.status === "active" ? "text-green-600" : "text-red-600"}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleBlockToggle(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    disabled={user.blocked}
                  >
                    Block
                  </button>
                  <button
                    onClick={() => handleBlockToggle(user._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    disabled={!user.blocked}
                  >
                    Unblock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Role</label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
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