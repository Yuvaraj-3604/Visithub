import React, { useState, useEffect } from 'react';
import API from '../../services/api.js';

const SupportTicketsAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'resolved'
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await API.get('/support/tickets');
      setTickets(response.data || []);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResolve = async (ticketId) => {
    try {
      const response = await API.put(`/support/tickets/${ticketId}/resolve`, {
        resolution_note: resolutionNote || 'Reviewed and cleared by Super Admin',
      });

      setMessage({ type: 'success', text: response.data.message || 'Support query cleared successfully!' });
      setResolvingId(null);
      setResolutionNote('');
      fetchTickets();
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to clear support query.' });
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'resolved') return t.status === 'resolved';
    return true;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#062132', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Support Queries & Help Tickets
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Review, answer, and clear support queries submitted by employees, receptionists, and administrators.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: filter === 'all' ? '#ffffff' : 'transparent',
              color: filter === 'all' ? '#062132' : '#64748b',
              boxShadow: filter === 'all' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: filter === 'pending' ? '#ffffff' : 'transparent',
              color: filter === 'pending' ? '#b45309' : '#64748b',
              boxShadow: filter === 'pending' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            Pending ({tickets.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: filter === 'resolved' ? '#ffffff' : 'transparent',
              color: filter === 'resolved' ? '#15803d' : '#64748b',
              boxShadow: filter === 'resolved' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            Cleared ({tickets.filter(t => t.status === 'resolved').length})
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '24px' }}>
          {message.type === 'success' ? '✅' : '⚠️'} {message.text}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading support tickets...</div>
      ) : filteredTickets.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.5 }}>🎉</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#062132' }}>No Support Queries Pending</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>All submitted user queries have been reviewed and cleared.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredTickets.map((t) => (
            <div key={t._id} className="card" style={{
              padding: '24px',
              borderLeft: t.status === 'resolved' ? '4px solid #10b981' : '4px solid #f59e0b',
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className="badge" style={{ background: '#00bcd4', color: '#ffffff' }}>
                      {t.category}
                    </span>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
                      Role: {t.role}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      by <strong>{t.username}</strong> &middot; {new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '750', color: '#062132', margin: 0 }}>
                    {t.subject}
                  </h3>
                </div>

                <div>
                  {t.status === 'resolved' ? (
                    <span className="badge" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                      ✅ Cleared by Super Admin
                    </span>
                  ) : (
                    <span className="badge" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>
                      ⏳ Pending Review
                    </span>
                  )}
                </div>
              </div>

              {/* Description Body */}
              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '0.925rem',
                color: '#334155',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}>
                {t.description}
              </div>

              {/* Action area: Clear / Resolve Query */}
              {t.status === 'pending' && (
                <div>
                  {resolvingId === t._id ? (
                    <div style={{ background: '#f0fdfa', padding: '16px', borderRadius: '10px', border: '1px solid #99f6e4' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#062132', marginBottom: '6px' }}>
                        Resolution Note for User:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Reviewed issue and reset permissions."
                        value={resolutionNote}
                        onChange={e => setResolutionNote(e.target.value)}
                        style={{ marginBottom: '12px', width: '100%' }}
                      />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setResolvingId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ background: '#10b981', border: 'none' }}
                          onClick={() => handleResolve(t._id)}
                        >
                          Confirm & Clear Query
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ background: '#0d9488', border: 'none' }}
                      onClick={() => setResolvingId(t._id)}
                    >
                      ✅ Review & Clear Query
                    </button>
                  )}
                </div>
              )}

              {t.status === 'resolved' && (
                <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  <strong>Resolution Note:</strong> {t.resolution_note || 'Cleared by Super Admin'} &middot; {new Date(t.resolved_at).toLocaleDateString()}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SupportTicketsAdmin;
