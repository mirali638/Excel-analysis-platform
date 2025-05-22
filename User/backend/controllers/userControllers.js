const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Update user (name, email, role)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Block or unblock user
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = user.status === 'active' ? 'blocked' : 'active';
    user.blocked = user.status === 'blocked';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user status' });
  }
}; 