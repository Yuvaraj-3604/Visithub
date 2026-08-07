import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api.js';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse pre-filled email from URL search query
  const searchParams = new URLSearchParams(location.search);
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [accessCode, setAccessCode] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== verifyPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!email) {
      setError('Please provide the account email address');
      return;
    }

    if (!accessCode) {
      setError('Please enter the 6-digit verification access code');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/reset-password', {
        email,
        token: accessCode, // Pass accessCode as token to endpoint
        password,
      });

      setSuccess(response.data.message || 'Password updated successfully!');
      setAccessCode('');
      setPassword('');
      setVerifyPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Verification code is incorrect or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ borderTop: '4px solid var(--color-success)', padding: '40px 32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img 
            src="/logo.png" 
            alt="VisitHub Logo" 
            style={{ 
              width: '64px', 
              height: '64px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 16px rgba(16, 185, 129, 0.3))' 
            }}
          />
        </div>

        <div className="login-header" style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '750', color: '#ffffff' }}>Verify Code & Reset</h2>
          <p style={{ color: 'var(--text-muted)' }}>Enter the 6-digit code to update your password</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            <span>✅</span> {success} Redirecting to login portal...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              className="form-control"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Prompt user to input the 6-digit access verification code */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem', marginBottom: '6px' }}>Verification Access Code</label>
            <input
              type="text"
              maxLength="6"
              className="form-control"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.07)', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                letterSpacing: '4px',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '1.25rem'
              }}
              placeholder="123456"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem', marginBottom: '6px' }}>New Password</label>
            <input
              type="password"
              className="form-control"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem', marginBottom: '6px' }}>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
              placeholder="••••••"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-success)', border: 'none', fontWeight: '600', fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem' }}>
          <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>
            ⬅️ Cancel and Return
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
