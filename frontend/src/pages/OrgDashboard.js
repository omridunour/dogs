import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { organizationService, subscriptionService } from '../services/api';
import '../styles/Dashboard.css';

const OrgDashboard = () => {
  const [organization, setOrganization] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const orgRes = await organizationService.getOrganization(token, user.organization);
      setOrganization(orgRes.data);

      if (orgRes.data.subscription) {
        const subRes = await subscriptionService.getOrgSubscriptions(token, user.organization);
        setSubscription(subRes.data[0]);
      }
    } catch (err) {
      setError('Failed to load organization data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      await organizationService.addUserToOrganization(token, user.organization, newUserEmail);
      setNewUserEmail('');
      setShowAddUserForm(false);
      fetchData();
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleRemoveUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        await organizationService.removeUserFromOrganization(token, user.organization, userId);
        fetchData();
      } catch (err) {
        setError('Failed to remove user');
      }
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <h1>Organization Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {organization && (
        <div>
          <div className="org-header">
            <h2>{organization.name}</h2>
            <p className="org-email">{organization.email}</p>
          </div>

          {subscription && (
            <div className="subscription-card">
              <h3>Subscription Plan</h3>
              <div className="plan-details">
                <div>
                  <strong>Plan:</strong> <span className="plan-badge">{subscription.plan}</span>
                </div>
                <div>
                  <strong>Status:</strong> <span className="status-badge">{subscription.status}</span>
                </div>
                <div>
                  <strong>Max Users:</strong> {subscription.maxUsers}
                </div>
                <div>
                  <strong>Expires:</strong> {new Date(subscription.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          <div className="users-section">
            <div className="users-header">
              <h3>Team Members ({organization.users?.length || 0})</h3>
              <button
                className="btn-primary"
                onClick={() => setShowAddUserForm(!showAddUserForm)}
              >
                {showAddUserForm ? 'Cancel' : 'Add User'}
              </button>
            </div>

            {showAddUserForm && (
              <div className="add-user-form">
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
                <button onClick={handleAddUser}>Add</button>
              </div>
            )}

            {organization.users && organization.users.length > 0 ? (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organization.users.map((usr) => (
                    <tr key={usr._id}>
                      <td>{usr.name}</td>
                      <td>{usr.email}</td>
                      <td>{usr.role}</td>
                      <td>
                        {usr._id !== user.id && (
                          <button
                            className="btn-remove"
                            onClick={() => handleRemoveUser(usr._id)}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No team members yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgDashboard;
