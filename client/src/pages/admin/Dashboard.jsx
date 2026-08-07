import React, { useState, useEffect } from 'react';
import visitorService from '../../services/visitorService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  const [stats, setStats] = useState({
    totalEmployees: 2,
    totalUsers: 5,
    todayVisitors: 0,
    currentlyInside: 0,
    pendingRequests: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await visitorService.getDashboardStats();
        if (statsData) {
          setStats(statsData);
        }

        const activitiesData = await visitorService.getActivities();
        if (activitiesData && Array.isArray(activitiesData)) {
          setActivities(activitiesData.slice(0, 5));
        }
      } catch (err) {
        console.warn('Using default system dashboard metrics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0', minHeight: '300px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      
      {/* Topbar Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#062132', letterSpacing: '-0.02em', margin: 0 }}>
            {isSuperAdmin ? '👑 Secret Admin Dashboard' : '📊 Admin Dashboard'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px', margin: 0 }}>
            {isSuperAdmin ? 'Super Admin Master Control & Workplace Operations Center' : 'System Overview & Gate Pass Metrics'}
          </p>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#334155',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: '24px' }}>{error}</div>}

      {/* KPI Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="card stat-card">
          <div>
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{stats.totalEmployees || 0}</div>
          </div>
          <div className="stat-icon primary">👥</div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">User Accounts</div>
            <div className="stat-value">{stats.totalUsers || 0}</div>
          </div>
          <div className="stat-icon info">🔑</div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Today's Visitors</div>
            <div className="stat-value">{stats.todayVisitors || 0}</div>
          </div>
          <div className="stat-icon warning">🎫</div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Currently Inside</div>
            <div className="stat-value">{stats.currentlyInside || 0}</div>
          </div>
          <div className="stat-icon success">🚪</div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Pending Approval</div>
            <div className="stat-value">{stats.pendingRequests || 0}</div>
          </div>
          <div className="stat-icon danger">⏳</div>
        </div>
      </div>

      {/* Super Admin Command Banner */}
      {isSuperAdmin && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, #0b1329 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '24px 32px',
          borderRadius: '16px',
          marginBottom: '32px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px' }}>
              👑 Super Admin Access Active
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '750', margin: 0, color: '#ffffff' }}>
              Secret Master Control Center
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
              You have unrestricted privileges to review user queries, manage employee accounts, and oversee security logs.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/support-tickets" className="btn btn-primary" style={{ background: '#f59e0b', border: 'none', fontWeight: '700', padding: '10px 20px', color: '#000000' }}>
              💬 Review Support Queries
            </Link>
            <Link to="/users" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', fontWeight: '600', padding: '10px 20px' }}>
              🔑 Manage System Users
            </Link>
          </div>
        </div>
      )}

      <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        {/* Recent Activities Section */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '750', color: '#062132', margin: 0 }}>
              Recent Visitor Activities
            </h2>
            <Link to="/activities" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#00bcd4', textDecoration: 'none' }}>
              View All ➔
            </Link>
          </div>

          {activities.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
              No activities logged today.
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Visitor Name</th>
                    <th>Action</th>
                    <th>Performed By</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((act) => (
                    <tr key={act._id}>
                      <td style={{ fontWeight: '600' }}>{act.visitorId?.name || 'Visitor'}</td>
                      <td>
                        <span className={`badge badge-${act.action}`}>
                          {act.action.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{act.performedBy?.username} ({act.performedBy?.role})</td>
                      <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Reference Side Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '750', color: '#062132', margin: 0 }}>Quick Reference</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6' }}>
            As a System Administrator, you possess complete authorization to register employees, manage security credentials, review support queries, and inspect real-time visitor activity.
          </p>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', color: '#00bcd4' }}>
              System Portals
            </div>
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px', color: '#334155' }}>
              <div><strong>Receptionist:</strong> Entry registration & visitor check-in/out logging.</div>
              <div><strong>Employee:</strong> Host visitor authorization & approval requests.</div>
              <div><strong>Super Admin:</strong> Full system governance & support query clearing.</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
