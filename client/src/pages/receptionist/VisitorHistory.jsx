import React, { useState, useEffect } from 'react';
import visitorService from '../../services/visitorService.js';

const VisitorHistory = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchHistory = async () => {
    try {
      const data = await visitorService.getVisitors();
      setVisitors(data);
    } catch (err) {
      setError('Failed to load historic visitor logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = visitors.filter((v) => {
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? v.name.toLowerCase().includes(searchLower) ||
        v.passCode.toLowerCase().includes(searchLower) ||
        v.hostEmployee?.name.toLowerCase().includes(searchLower)
      : true;
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="topbar">
        <h1>Visitor History Log</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card filter-bar" style={{ marginBottom: '24px' }}>
        <div className="filter-group">
          <label>Search Directory</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search visitor, host or passcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Filter by Status</label>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">-- All Statuses --</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <div className="spinner"></div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No visitor history records found.
          </p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Pass Code</th>
                  <th>Visitor Details</th>
                  <th>Host Employee</th>
                  <th>Visit details</th>
                  <th>Check In/Out Logs</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((v) => (
                  <tr key={v._id}>
                    <td style={{ fontWeight: '700', color: 'var(--color-info)' }}>{v.passCode}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{v.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {v.organization} &middot; {v.phone}
                      </div>
                    </td>
                    <td>{v.hostEmployee?.name}</td>
                    <td>
                      <div>📅 {new Date(v.scheduleDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Purpose: {v.purpose}</div>
                    </td>
                    <td>
                      {v.checkInTime ? (
                        <div style={{ fontSize: '0.85rem' }}>
                          📥 <span style={{ color: 'var(--color-success)' }}>In:</span> {new Date(v.checkInTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No check-in recorded</div>
                      )}
                      {v.checkOutTime && (
                        <div style={{ fontSize: '0.85rem' }}>
                          📤 <span style={{ color: 'var(--color-primary)' }}>Out:</span> {new Date(v.checkOutTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${v.status}`}>
                        {v.status.replace('_', ' ')}
                      </span>
                      {v.remarks && (
                        <div className="remarks-display" style={{ marginTop: '8px' }}>
                          💬 {v.remarks}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorHistory;
