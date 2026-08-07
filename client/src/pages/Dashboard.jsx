import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from './admin/Dashboard.jsx';
import ReceptionistDashboard from './receptionist/Dashboard.jsx';
import EmployeeDashboard from './employee/Dashboard.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'super_admin':
    case 'admin':
      return <AdminDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    default:
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Error</h2>
          <p>Invalid account configuration. Unknown role: {user.role}</p>
        </div>
      );
  }
};

export default Dashboard;
