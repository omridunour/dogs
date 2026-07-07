import React, { useState, useEffect } from 'react';
import { organizationService, subscriptionService } from '../services/api';
import '../styles/Dashboard.css';

const UserDashboard = () => {
  const [organization, setOrganization] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (user.organization) {
        const orgRes = await organizationService.getOrganization(token, user.organization);
        setOrganization(orgRes.data);

        if (orgRes.data.subscription) {
          const subRes = await subscriptionService.getOrgSubscriptions(
            token,
            user.organization
          );
          setSubscription(subRes.data[0]);
        }
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name}!</h1>

      {error && <div className="error-message">{error}</div>}

      {organization ? (
        <div className="org-info">
          <h2>{organization.name}</h2>
          <p>
            <strong>Email:</strong> {organization.email}
          </p>
          <p>
            <strong>Users:</strong> {organization.users?.length || 0}
          </p>

          {subscription && (
            <div className="subscription-info">
              <h3>Current Subscription</h3>
              <div className="info-grid">
                <div>
                  <strong>Plan:</strong> {subscription.plan}
                </div>
                <div>
                  <strong>Status:</strong> {subscription.status}
                </div>
                <div>
                  <strong>Max Users:</strong> {subscription.maxUsers}
                </div>
                <div>
                  <strong>Expires:</strong> {new Date(subscription.endDate).toLocaleDateString()}
                </div>
              </div>

              {subscription.features?.length > 0 && (
                <div className="features">
                  <h4>Features:</h4>
                  <ul>
                    {subscription.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="no-org">
          <p>You are not part of any organization yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
