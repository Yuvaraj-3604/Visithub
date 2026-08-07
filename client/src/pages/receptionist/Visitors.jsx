import React, { useState, useEffect } from 'react';
import visitorService from '../../services/visitorService.js';

const ActionCenter = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchActiveVisitors = async () => {
    try {
      // Fetch only active visits: pending, approved, checked_in
      const data = await visitorService.getVisitors({ active: 'true' });
      setVisitors(data);
    } catch (err) {
      setError('Failed to fetch active visitor logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveVisitors();
  }, []);

  const handleCheckIn = async (id, name) => {
    setError('');
    setSuccess('');
    try {
      await visitorService.checkInVisitor(id);
      setSuccess(`Visitor "${name}" checked in successfully!`);
      fetchActiveVisitors();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to check-in ${name}`);
    }
  };

  const handleCheckOut = async (id, name) => {
    setError('');
    setSuccess('');
    try {
      await visitorService.checkOutVisitor(id);
      setSuccess(`Visitor "${name}" checked out successfully!`);
      fetchActiveVisitors();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to check-out ${name}`);
    }
  };

  const handleCancelVisit = async (id, name) => {
    if (window.confirm(`Are you sure you want to cancel the scheduled visit for ${name}?`)) {
      setError('');
      setSuccess('');
      try {
        await visitorService.cancelVisitor(id);
        setSuccess(`Visit for "${name}" cancelled.`);
        fetchActiveVisitors();
        setTimeout(() => setSuccess(''), 4000);
      } catch (err) {
        setError(err.response?.data?.message || `Failed to cancel visit`);
      }
    }
  };

  // Local filter logic
  const filteredVisitors = visitors.filter((v) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? v.name.toLowerCase().includes(searchLower) ||
        v.passCode.toLowerCase().includes(searchLower) ||
        v.hostEmployee?.name.toLowerCase().includes(searchLower)
      : true;

    const matchesDate = dateFilter
      ? new Date(v.scheduleDate).toISOString().split('T')[0] === dateFilter
      : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div>
      <div className="topbar">
        <h1>Front Desk Action Center</h1>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card filter-bar" style={{ marginBottom: '24px' }}>
        <div className="filter-group">
          <label>Search Visitors</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search visitor, host or passcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Filter by Visit Date</label>
          <input
            type="date"
            className="form-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={() => { setSearchQuery(''); setDateFilter(''); }}
        >
          Reset Filters
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <div className="spinner"></div>
          </div>
        ) : filteredVisitors.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No active visitor passes found matching search parameters.
          </p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Pass Code</th>
                  <th>Visitor Details</th>
                  <th>Host Employee</th>
                  <th>Visit parameters</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((v) => (
                  <tr key={v._id}>
                    <td style={{ fontWeight: '700', color: 'var(--color-info)' }}>{v.passCode}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{v.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {v.organization} &middot; {v.phone}
                      </div>
                    </td>
                    <td>
                      <div>{v.hostEmployee?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {v.hostEmployee?.department}
                      </div>
                    </td>
                    <td>
                      <div>📅 {new Date(v.scheduleDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        🕒 Expected: {v.expectedArrivalTime}
                      </div>
                      {v.checkInTime && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>
                          📥 In: {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${v.status}`}>
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {v.status === 'approved' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleCheckIn(v._id, v.name)}
                          >
                            📥 Check In
                          </button>
                        )}
                        {v.status === 'checked_in' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleCheckOut(v._id, v.name)}
                          >
                            📤 Check Out
                          </button>
                        )}
                        {['pending', 'approved'].includes(v.status) && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancelVisit(v._id, v.name)}
                          >
                            Cancel
                          </button>
                        )}
                        {v.status === 'pending' && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Awaiting Host Approval
                          </span>
                        )}
                      </div>
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

export default ActionCenter;
