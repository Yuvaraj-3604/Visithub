import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import visitorService from '../../services/visitorService.js';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [todayVisitors, setTodayVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await visitorService.getDashboardStats();
        setStats(statsData);

        // Fetch today's scheduled visits
        const today = new Date().toISOString().split('T')[0];
        const visits = await visitorService.getVisitors({ visitDate: today });
        setTodayVisitors(visits);
      } catch (err) {
        setError('Failed to fetch employee dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="topbar">
        <h1>Employee Dashboard</h1>
        <div className="topbar-date">
          Host Workspace &middot; {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          <div className="card stat-card">
            <div>
              <div className="stat-label">Pending Requests</div>
              <div className="stat-value">{stats.pendingRequests}</div>
            </div>
            <div className="stat-icon warning">⏳</div>
          </div>

          <div className="card stat-card">
            <div>
              <div className="stat-label">Today's Visitors</div>
              <div className="stat-value">{stats.todayVisitors}</div>
            </div>
            <div className="stat-icon info">👥</div>
          </div>

          <div className="card stat-card">
            <div>
              <div className="stat-label">Currently Inside</div>
              <div className="stat-value">{stats.currentlyInside}</div>
            </div>
            <div className="stat-icon success">🚪</div>
          </div>

          <div className="card stat-card">
            <div>
              <div className="stat-label">Approved & Scheduled</div>
              <div className="stat-value">{stats.totalApproved}</div>
            </div>
            <div className="stat-icon primary">✅</div>
          </div>
        </div>
      )}

      <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Today's Schedule panel */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: '600' }}>Your Schedule Today</h2>
          {todayVisitors.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You have no visitors scheduled for today.</p>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Visitor Name</th>
                    <th>Organization</th>
                    <th>Expected Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayVisitors.map((v) => (
                    <tr key={v._id}>
                      <td style={{ fontWeight: '500' }}>{v.name}</td>
                      <td>{v.organization}</td>
                      <td>{v.expectedArrivalTime}</td>
                      <td>
                        <span className={`badge badge-${v.status}`}>
                          {v.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Requests Management redirect card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Pending Action Item</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Check if you have any incoming visitor requests from clients, maintenance workers, or interviews. You must approve requests before guests can check in at reception.
          </p>
          <button 
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            onClick={() => navigate('/requests')}
          >
            ✉️ Review Requests
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
