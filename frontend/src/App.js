import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OrgDashboard from './pages/OrgDashboard';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  const userData = JSON.parse(user);
  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <Router>
      <div className="app">
        {user && (
          <nav className="navbar">
            <div className="nav-container">
              <h1 className="nav-brand">CRM System</h1>
              <div className="nav-right">
                <span className="user-name">{user.name}</span>
                <button
                  className="logout-btn"
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/org/dashboard"
            element={
              <ProtectedRoute allowedRoles={['org_owner']}>
                <OrgDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user', 'org_owner']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
