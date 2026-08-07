import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Dev-helper access code capture
  const [devAccessCode, setDevAccessCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevAccessCode('');
    setLoading(true);

    try {
      const response = await API.post('/auth/forgot-password', { email });
      setSuccess(response.data.message || 'Verification code sent!');
      
      // Capture dev access code returned in API response for easy manual testing
      if (response.data.devCode) {
        setDevAccessCode(response.data.devCode);
      }
      
      // Redirect to reset password after 3 seconds prefilled with email
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit password recovery request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ borderTop: '4px solid var(--color-warning)', padding: '40px 32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img 
            src="/logo.png" 
            alt="VisitHub Logo" 
            style={{ 
              width: '64px', 
              height: '64px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.3))' 
            }}
          />
        </div>

        <div className="login-header" style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '750', color: '#ffffff' }}>Forgot Password</h2>
          <p style={{ color: 'var(--text-muted)' }}>Enter your email to receive a 6-digit access code</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            <span>📧</span> {success} Redirecting to enter verification code...
          </div>
        )}

        {devAccessCode && (
          <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid var(--color-info)', background: 'rgba(6, 182, 212, 0.05)', padding: '16px' }}>
            <h4 style={{ color: 'var(--color-info)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>🛠️ Developer Access Code</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Since you are testing locally, use this generated 6-digit code to verify your identity:
            </p>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '4px', color: '#ffffff', fontFamily: 'monospace' }}>
              {devAccessCode}
            </div>
            <div style={{ marginTop: '12px' }}>
              <Link 
                to={`/reset-password?email=${encodeURIComponent(email)}`} 
                style={{ color: '#00bcd4', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}
              >
                Go to Verification Page ➡️
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="email" style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem', marginBottom: '8px' }}>Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '0.95rem' }}
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-warning)', border: 'none', fontWeight: '600', fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send Recovery Email'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem' }}>
          <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>
            ⬅️ Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
