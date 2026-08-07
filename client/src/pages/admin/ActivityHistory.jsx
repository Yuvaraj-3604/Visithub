import React, { useState, useEffect } from 'react';
import visitorService from '../../services/visitorService.js';

const ActivityHistory = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchActivities = async () => {
    try {
      const data = await visitorService.getActivities();
      setActivities(data);
    } catch (err) {
      setError('Failed to fetch system logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Filter local logs based on inputs
  const filteredActivities = activities.filter((act) => {
    const matchesAction = actionFilter ? act.action === actionFilter : true;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? act.visitorId?.name?.toLowerCase().includes(searchLower) ||
        act.visitorId?.passCode?.toLowerCase().includes(searchLower) ||
        act.performedBy?.username?.toLowerCase().includes(searchLower)
      : true;
    return matchesAction && matchesSearch;
  });

  return (
    <div>
      <div className="topbar">
        <h1>Activity History & System Logs</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card filter-bar" style={{ marginBottom: '24px' }}>
        <div className="filter-group">
          <label>Search Logs</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search visitor, code or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Filter by Action</label>
          <select
            className="form-control"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">-- All Actions --</option>
            <option value="created">Created</option>
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
        ) : filteredActivities.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No matching log entries found.
          </p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Visitor details</th>
                  <th>Action</th>
                  <th>Performed By</th>
                  <th>Description / Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((act) => (
                  <tr key={act._id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(act.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{act.visitorId?.name || <em style={{ color: 'var(--text-muted)' }}>Deleted Visitor</em>}</div>
                      {act.visitorId?.passCode && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-info)' }}>{act.visitorId.passCode}</div>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${act.action}`}>
                        {act.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div>{act.performedBy?.username}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        {act.performedBy?.role}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>{act.remarks || 'No remarks provided'}</div>
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

export default ActivityHistory;
