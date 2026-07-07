import React, { useState, useEffect } from 'react';
import { subscriptionService, organizationService, userService } from '../services/api';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsRes, orgsRes, pendingRes, allUsersRes] = await Promise.all([
        subscriptionService.getAllSubscriptions(token),
        organizationService.getAllOrganizations(token),
        userService.getPendingUsers(token),
        userService.getAllUsers(token),
      ]);

      setSubscriptions(subsRes.data);
      setOrganizations(orgsRes.data);
      setPendingUsers(pendingRes.data);
      setAllUsers(allUsersRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        await subscriptionService.cancelSubscription(token, subscriptionId);
        fetchData();
      } catch (err) {
        setError('Failed to cancel subscription');
      }
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await userService.approveUser(token, userId);
      fetchData();
    } catch (err) {
      setError('Failed to approve user');
    }
  };

  const handleRejectUser = async (userId) => {
    if (window.confirm('Are you sure you want to reject this user?')) {
      try {
        await userService.rejectUser(token, userId);
        fetchData();
      } catch (err) {
        setError('Failed to reject user');
      }
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      await userService.changeUserRole(token, userId, newRole);
      fetchData();
    } catch (err) {
      setError('Failed to change user role');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await userService.deactivateUser(token, userId);
        fetchData();
      } catch (err) {
        setError('Failed to deactivate user');
      }
    }
  };

  const handleReactivateUser = async (userId) => {
    try {
      await userService.reactivateUser(token, userId);
      fetchData();
    } catch (err) {
      setError('Failed to reactivate user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user permanently?')) {
      try {
        await userService.deleteUser(token, userId);
        fetchData();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="tab-buttons">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({pendingUsers.length} pending)
        </button>
        <button
          className={activeTab === 'subscriptions' ? 'active' : ''}
          onClick={() => setActiveTab('subscriptions')}
        >
          📋 Subscriptions
        </button>
        <button
          className={activeTab === 'organizations' ? 'active' : ''}
          onClick={() => setActiveTab('organizations')}
        >
          🏢 Organizations
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="tab-content">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>⏳ Pending User Approvals ({pendingUsers.length})</h2>
            {pendingUsers.length === 0 ? (
              <p style={{ color: '#999', padding: '1rem' }}>No pending users</p>
            ) : (
              <table className="data-table">
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
                    <tr key={user._id} style={{ backgroundColor: '#fef8f0' }}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn-approve-sm"
                          onClick={() => handleApproveUser(user._id)}
                          style={{ marginRight: '0.5rem' }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn-reject-sm"
                          onClick={() => handleRejectUser(user._id)}
                        >
                          ✕ Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div>
            <h2 style={{ marginBottom: '1rem' }}>👥 All Users ({allUsers.length})</h2>
            {allUsers.length === 0 ? (
              <p style={{ color: '#999', padding: '1rem' }}>No users</p>
            ) : (
              <table className="data-table">
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
                    <tr key={user._id} style={{ opacity: user.isActive ? 1 : 0.6 }}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeUserRole(user._id, e.target.value)}
                          style={{
                            padding: '0.4rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                          }}
                        >
                          <option value="user">User</option>
                          <option value="org_owner">Org Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{user.isActive ? '🟢 Active' : '🔴 Inactive'}</td>
                      <td>{user.isApproved ? '✓ Yes' : '⏳ No'}</td>
                      <td>
                        {user.isActive ? (
                          <button
                            className="btn-deactivate-sm"
                            onClick={() => handleDeactivateUser(user._id)}
                            style={{ marginRight: '0.5rem' }}
                          >
                            ⊘ Deactivate
                          </button>
                        ) : (
                          <button
                            className="btn-reactivate-sm"
                            onClick={() => handleReactivateUser(user._id)}
                            style={{ marginRight: '0.5rem' }}
                          >
                            ↻ Activate
                          </button>
                        )}
                        <button
                          className="btn-delete-sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="tab-content">
          <h2>All Subscriptions</h2>
          {subscriptions.length === 0 ? (
            <p>No subscriptions found</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Max Users</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub._id}>
                    <td>{sub.organization?.name || 'Unknown'}</td>
                    <td>{sub.plan}</td>
                    <td>{sub.status}</td>
                    <td>{sub.maxUsers}</td>
                    <td>{new Date(sub.endDate).toLocaleDateString()}</td>
                    <td>
                      {sub.status !== 'cancelled' && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancelSubscription(sub._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'organizations' && (
        <div className="tab-content">
          <h2>All Organizations</h2>
          {organizations.length === 0 ? (
            <p>No organizations found</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Owner</th>
                  <th>Users</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr key={org._id}>
                    <td>{org.name}</td>
                    <td>{org.email}</td>
                    <td>{org.owner?.name || 'Unknown'}</td>
                    <td>{org.users?.length || 0}</td>
                    <td>{org.isActive ? 'Active' : 'Inactive'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
