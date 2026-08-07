import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Login = () => {
  const { roleType } = useParams(); // 'super-admin', 'admin', 'receptionist', 'employee'
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
  }, [roleType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let dbRole = '';
    if (roleType === 'super-admin') dbRole = 'super_admin';
    else if (roleType === 'admin') dbRole = 'admin';
    else if (roleType === 'receptionist') dbRole = 'receptionist';
    else if (roleType === 'employee') dbRole = 'employee';

    try {
      await login(username, password, dbRole);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or role authorization mismatch.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Render Portal Selector index inside a SINGLE glassy card (exactly like the 2nd image Questbridge mock)
  if (!roleType) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ padding: '40px 32px 0 32px', maxWidth: '440px' }}>
          
          {/* Logo image */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <img 
              src="/logo.png" 
              alt="VisitHub Logo" 
              style={{ 
                width: '72px', 
                height: '72px', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 20px rgba(0, 188, 212, 0.3))' 
              }}
            />
          </div>

          <div className="login-header" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
              VisitHub
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Select your portal to authenticate
            </p>
          </div>

          {/* Stacked Portal Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
            
            <button 
              className="btn" 
              onClick={() => navigate('/login/admin')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '14px 20px', 
                border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '12px', 
                justifyContent: 'flex-start', 
                background: 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📊</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.95rem' }}>Admin Portal</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Manage directories and view reports</div>
              </div>
            </button>

            <button 
              className="btn" 
              onClick={() => navigate('/login/receptionist')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '14px 20px', 
                border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '12px', 
                justifyContent: 'flex-start', 
                background: 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🎟️</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.95rem' }}>Receptionist</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Check guests in/out & print passes</div>
              </div>
            </button>

            <button 
              className="btn" 
              onClick={() => navigate('/login/employee')}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '14px 20px', 
                border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '12px', 
                justifyContent: 'flex-start', 
                background: 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>✉️</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.95rem' }}>Employees</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Review and approve visit requests</div>
              </div>
            </button>

          </div>

          {/* Separator line and sign-up option */}
          <div 
            style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
              marginTop: '32px', 
              paddingTop: '24px', 
              paddingBottom: '32px',
              textAlign: 'center', 
              fontSize: '0.9rem' 
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
            <Link 
              to="/register" 
              style={{ color: '#00bcd4', textDecoration: 'none', fontWeight: '700' }}
            >
              Sign up
            </Link>
          </div>

          <div style={{ paddingBottom: '24px', display: 'flex', justifyContent: 'center', fontSize: '0.85rem' }}>
            <Link to="/forgot-password" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Role portal configurations
  let portalTitle = 'Portal';
  let portalColor = '#00bcd4';
  let portalIconText = 'VH';

  if (roleType === 'super-admin') {
    portalTitle = 'Super Admin';
    portalColor = '#f59e0b';
    portalIconText = '👑';
  } else if (roleType === 'admin') {
    portalTitle = 'Admin Portal';
    portalColor = '#3b82f6';
    portalIconText = '📊';
  } else if (roleType === 'receptionist') {
    portalTitle = 'Receptionist';
    portalColor = '#00bcd4';
    portalIconText = 'Q';
  } else if (roleType === 'employee') {
    portalTitle = 'Employees';
    portalColor = '#8b5cf6';
    portalIconText = 'E';
  }
  // Unique background gradients for each role portal
  let containerBg = 'radial-gradient(circle at center, #111b2c 0%, #05070a 100%)';
  if (roleType === 'super-admin') {
    containerBg = 'radial-gradient(circle at center, #251806 0%, #050301 100%)';
  } else if (roleType === 'admin') {
    containerBg = 'radial-gradient(circle at center, #0c1c36 0%, #020509 100%)';
  } else if (roleType === 'receptionist') {
    containerBg = 'radial-gradient(circle at center, #05212c 0%, #010609 100%)';
  } else if (roleType === 'employee') {
    containerBg = 'radial-gradient(circle at center, #180c29 0%, #04020a 100%)';
  }

  return (
    <div className="login-container" style={{ background: containerBg }}>
      <div className="login-card" style={{ padding: '40px 32px 0 32px', maxWidth: '440px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <img 
            src="/logo.png" 
            alt="VisitHub Logo" 
            style={{ 
              width: '72px', 
              height: '72px', 
              objectFit: 'contain',
              filter: `drop-shadow(0 0 20px ${portalColor}44)` 
            }}
          />
        </div>

        <div className="login-header" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
            Welcome back to {portalTitle}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '24px' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="username" style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem', marginBottom: '8px' }}>
              Email or Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.07)', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '0.95rem'
              }}
              placeholder="Enter your email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label htmlFor="password" style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem', margin: 0 }}>
                Password
              </label>
              <Link 
                to="/forgot-password" 
                style={{ color: portalColor, textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}
              >
                Forgot password?
              </Link>
            </div>
            
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-control"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.07)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  paddingRight: '44px',
                  width: '100%'
                }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              padding: '12px',
              backgroundColor: portalColor, 
              border: 'none',
              boxShadow: `0 4px 15px ${portalColor}33`,
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div 
          style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
            marginTop: '32px', 
            paddingTop: '24px', 
            paddingBottom: '32px',
            textAlign: 'center', 
            fontSize: '0.9rem' 
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <Link 
            to="/register" 
            style={{ color: portalColor, textDecoration: 'none', fontWeight: '700' }}
          >
            Sign up
          </Link>
        </div>

        <div style={{ paddingBottom: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            ⬅️ Portal Selector
          </Link>
          {roleType === 'super-admin' ? null : (
            <Link to="/login/super-admin" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Secret Admin
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
