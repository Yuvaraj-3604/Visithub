import React, { useState, useEffect } from 'react';
import visitorService from '../../services/visitorService.js';

const VisitorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Remarks state mapped by visitor ID
  const [remarksMap, setRemarksMap] = useState({});
  const [filterType, setFilterType] = useState('pending'); // 'pending' or 'history'

  const fetchRequests = async () => {
    try {
      const data = await visitorService.getVisitors();
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch visitor requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action, name) => {
    setError('');
    setSuccess('');
    const remarks = remarksMap[id] || '';

    try {
      await visitorService.approveRejectVisitor(id, action, remarks);
      setSuccess(`Request for "${name}" successfully ${action === 'approve' ? 'approved' : 'rejected'}!`);
      // Clear remark
      setRemarksMap((prev) => ({ ...prev, [id]: '' }));
      fetchRequests();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to process request for ${name}`);
    }
  };

  const handleRemarkChange = (id, value) => {
    setRemarksMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Filter requests based on status tab
  const filteredRequests = requests.filter((req) => {
    if (filterType === 'pending') {
      return req.status === 'pending';
    } else {
      return req.status !== 'pending';
    }
  });

  return (
    <div>
      <div className="topbar">
        <h1>Visitor Requests</h1>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
        <button
          className={`btn ${filterType === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterType('pending')}
        >
          ⏳ Pending Requests ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button
          className={`btn ${filterType === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterType('history')}
        >
          📜 Past Requests Log ({requests.filter(r => r.status !== 'pending').length})
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <div className="spinner"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No requests found in this category.
          </p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Visitor Details</th>
                  <th>Purpose</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>{filterType === 'pending' ? 'Decision Actions' : 'Remarks Logged'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{req.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {req.organization} &middot; {req.phone}
                      </div>
                    </td>
                    <td>{req.purpose}</td>
                    <td>
                      <div>📅 {new Date(req.scheduleDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        🕒 Expected: {req.expectedArrivalTime}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${req.status}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {filterType === 'pending' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
                          <input
                            type="text"
                            placeholder="Add rejection reason or remarks..."
                            className="form-control"
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            value={remarksMap[req._id] || ''}
                            onChange={(e) => handleRemarkChange(req._id, e.target.value)}
                          />
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleAction(req._id, 'approve', req.name)}
                            >
                              ✔️ Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleAction(req._id, 'reject', req.name)}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                          {req.remarks ? `"${req.remarks}"` : 'No remarks logged'}
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

export default VisitorRequests;
