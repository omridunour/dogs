const User = require('../models/User');

// Get all pending users (admin only)
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false })
      .select('-password')
      .populate('organization', 'name')
      .populate('approvedBy', 'name email');

    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending users', error: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('organization', 'name')
      .populate('approvedBy', 'name email');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Approve user (admin only)
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: req.userId,
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User approved successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving user', error: error.message });
  }
};

// Reject user (admin only)
exports.rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User rejected and deleted',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting user', error: error.message });
  }
};

// Change user role (admin only)
exports.changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'org_owner', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};

// Deactivate user (admin only)
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User deactivated',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating user', error: error.message });
  }
};

// Reactivate user (admin only)
exports.reactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User reactivated',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error reactivating user', error: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};
