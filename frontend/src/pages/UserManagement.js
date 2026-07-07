import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [pendingRes, allRes] = await Promise.all([
        userService.getPendingUsers(token),
        userService.getAllUsers(token),
      ]);

      setPendingUsers(pendingRes.data);
      setAllUsers(allRes.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await userService.approveUser(token, userId);
      fetchUsers();
    } catch (err) {
      setError('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm('Are you sure you want to reject this user?')) {
      try {
        await userService.rejectUser(token, userId);
        fetchUsers();
      } catch (err) {
        setError('Failed to reject user');
      }
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await userService.changeUserRole(token, userId, newRole);
      fetchUsers();
    } catch (err) {
      setError('Failed to change user role');
    }
  };

  const handleDeactivate = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await userService.deactivateUser(token, userId);
        fetchUsers();
      } catch (err) {
        setError('Failed to deactivate user');
      }
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await userService.reactivateUser(token, userId);
      fetchUsers();
    } catch (err) {
      setError('Failed to reactivate user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user permanently?')) {
      try {
        await userService.deleteUser(token, userId);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) return <div className="um-container"><p>Loading...</p></div>;

  return (
    <div className="um-container">
      <h1>👥 User Management</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="um-tabs">
        <button
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Approval ({pendingUsers.length})
        </button>
        <button
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          👥 All Users ({allUsers.length})
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="um-section">
          <h2>Users Awaiting Approval</h2>
          {pendingUsers.length === 0 ? (
            <p className="um-empty">No pending users</p>
          ) : (
            <div className="um-table-wrap">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr key={user._id} className="pending-row">
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="um-actions">
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(user._id)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(user._id)}
                        >
                          ✕ Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'all' && (
        <div className="um-section">
          <h2>All Users</h2>
          {allUsers.length === 0 ? (
            <p className="um-empty">No users</p>
          ) : (
            <div className="um-table-wrap">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Approved</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user._id} className={!user.isActive ? 'inactive-row' : ''}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRole(user._id, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="org_owner">Org Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </td>
                      <td>
                        {user.isApproved ? (
                          <span className="badge-approved">✓ Approved</span>
                        ) : (
                          <span className="badge-pending">⏳ Pending</span>
                        )}
                      </td>
                      <td className="um-actions">
                        {user.isActive ? (
                          <button className="btn-deactivate" onClick={() => handleDeactivate(user._id)}>
                            ⊘ Deactivate
                          </button>
                        ) : (
                          <button className="btn-reactivate" onClick={() => handleReactivate(user._id)}>
                            ↻ Activate
                          </button>
                        )}
                        <button className="btn-delete" onClick={() => handleDelete(user._id)}>
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
