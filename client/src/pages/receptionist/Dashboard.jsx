import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import visitorService from '../../services/visitorService.js';

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await visitorService.getDashboardStats();
        setStats(statsData);
      } catch (err) {
        setError('Failed to fetch dashboard stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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
        <h1>Receptionist Desk</h1>
        <div className="topbar-date">
          Front Desk Workspace &middot; {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          <div className="card stat-card">
            <div>
              <div className="stat-label">Today's Visits</div>
              <div className="stat-value">{stats.todayVisitors}</div>
            </div>
            <div className="stat-icon info">🎫</div>
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
              <div className="stat-label">Pending Approval</div>
              <div className="stat-value">{stats.pendingRequests}</div>
            </div>
            <div className="stat-icon warning">⏳</div>
          </div>

          <div className="card stat-card">
            <div>
              <div className="stat-label">Approved & Scheduled</div>
              <div className="stat-value">{stats.totalScheduledToday}</div>
            </div>
            <div className="stat-icon primary">✅</div>
          </div>
        </div>
      )}

      <div className="form-grid">
        {/* Reception Action Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Receptionist Quick Tasks</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Choose an action below to register a new visitor or verify their badge credentials to check them in/out of the facility.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/register-visitor')}
            >
              📝 Register Visitor
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/visitors')}
            >
              🎟️ Action Center (Check-In/Out)
            </button>
          </div>
        </div>

        {/* Policy & Guide Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Front Desk Regulations</h2>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>📌 <strong>Approval Rule:</strong> Visitors cannot check-in until their host employee approves the request.</div>
            <div>📌 <strong>One Active Visit:</strong> A visitor can only have one active request registration at any time.</div>
            <div>📌 <strong>Checking Out:</strong> Make sure to log visitor check-outs immediately upon their departure to keep the occupancy logs accurate.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
