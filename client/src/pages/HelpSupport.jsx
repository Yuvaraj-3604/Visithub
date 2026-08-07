import React, { useState, useEffect } from 'react';
import API from '../services/api.js';

const HelpSupport = () => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
  });

  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  const fetchMyTickets = async () => {
    setLoading(true);
    try {
      const response = await API.get('/support/tickets/my');
      setMyTickets(response.data || []);
    } catch (err) {
      console.error('Error fetching support history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMsg({ type: '', text: '' });

    if (!formData.category) {
      setAlertMsg({ type: 'danger', text: 'Please select a category for your help request.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/support/tickets', formData);
      setAlertMsg({ type: 'success', text: res.data.message || 'Support query submitted to Super Admin successfully!' });
      setFormData({ category: '', subject: '', description: '' });
      fetchMyTickets();
    } catch (err) {
      setAlertMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to submit support query.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#062132', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          Help & Support
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Get assistance with your VisitHub account, pass codes, and workplace features.
        </p>
      </div>

      {alertMsg.text && (
        <div className={`alert alert-${alertMsg.type}`} style={{ marginBottom: '24px' }}>
          {alertMsg.type === 'success' ? '✅' : '⚠️'} {alertMsg.text}
        </div>
      )}

      {/* Top Grid: Support Contact Cards + Send Message Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '28px', marginBottom: '40px' }}>
        
        {/* Left Side: Support Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Email Support Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(0, 188, 212, 0.1)',
              color: '#00bcd4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              marginBottom: '16px',
            }}>
              ✉️
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '750', color: '#062132', marginBottom: '6px' }}>
              Email Support
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5', marginBottom: '14px' }}>
              Drop us an email. Super Admin reviews and clears queries within 24 hours.
            </p>
            <a
              href="mailto:admin.visithub@gmail.com"
              style={{ fontSize: '0.9rem', fontWeight: '700', color: '#00bcd4', textDecoration: 'none' }}
            >
              admin.visithub@gmail.com
            </a>
          </div>

          {/* Documentation Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(168, 85, 247, 0.1)',
              color: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              marginBottom: '16px',
            }}>
              📄
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '750', color: '#062132', marginBottom: '6px' }}>
              Documentation
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5', marginBottom: '14px' }}>
              Browse our detailed guides, system rules, and visitor management documentation.
            </p>
            <span
              onClick={() => alert('VisitHub Documentation:\n\n1. Visitor Pass Rules: Passes require host approval unless pre-scheduled.\n2. Pass Validation: Valid for single check-in on the expected arrival date.\n3. Support Queries: Reviewed and cleared by Super Admin.')}
              style={{ fontSize: '0.9rem', fontWeight: '700', color: '#a855f7', cursor: 'pointer' }}
            >
              View Documentation ➔
            </span>
          </div>

        </div>

        {/* Right Side: Send us a message form (QuestBridge Style) */}
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.25rem' }}>💬</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '750', color: '#062132', margin: 0 }}>
              Send us a message
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label>What do you need help with?</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Account & Login Issue">Account & Login Issue</option>
                  <option value="Visitor Check-In / Check-Out">Visitor Check-In / Check-Out</option>
                  <option value="Pass Code & Badge Printing">Pass Code & Badge Printing</option>
                  <option value="Host Approval Workflow">Host Approval Workflow</option>
                  <option value="Other General Query">Other General Query</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Brief summary of your issue"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Detailed Description</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Please provide as much detail as possible to help us assist you faster..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '12px 28px', background: '#00bcd4', border: 'none' }}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : '✈️ Send Request'}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* ─── Bottom Section: My Support History (QuestBridge Style) ─── */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <span style={{ fontSize: '1.25rem' }}>📄</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '750', color: '#062132', margin: 0 }}>
            My Support History
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading support history...</div>
        ) : myTickets.length === 0 ? (
          <div style={{
            border: '2px dashed #e2e8f0',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            background: '#fafafa',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.5 }}>❓</div>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
              You haven't submitted any support requests yet.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Super Admin Resolution</th>
                </tr>
              </thead>
              <tbody>
                {myTickets.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <span className="badge" style={{ background: '#f1f5f9', color: '#062132', border: '1px solid #cbd5e1' }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {t.subject}
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '400', marginTop: '2px' }}>
                        {t.description}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {new Date(t.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      {t.status === 'resolved' ? (
                        <span className="badge" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                          ✅ Reviewed & Cleared
                        </span>
                      ) : (
                        <span className="badge" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>
                          ⏳ Pending Super Admin Review
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {t.status === 'resolved' ? (
                        <div>
                          <div style={{ color: '#15803d', fontWeight: '600' }}>Cleared</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.resolution_note}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Super Admin reviewing query...</span>
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

export default HelpSupport;
