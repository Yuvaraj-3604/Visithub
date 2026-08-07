import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api.js';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'employee',
    password: '',
    verifyPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.verifyPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
      });

      setSuccess(response.data.message || 'Account created successfully!');
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'employee',
        password: '',
        verifyPassword: '',
      });

      setTimeout(() => {
        navigate(`/login/${formData.role}`);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ padding: '40px 20px' }}>
      <div className="login-card" style={{ maxWidth: '550px', borderTop: '4px solid var(--color-primary)', padding: '40px 32px' }}>
        
        {/* Centered logo icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img 
            src="/logo.png" 
            alt="VisitHub Logo" 
            style={{ 
              width: '64px', 
              height: '64px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 16px rgba(0, 188, 212, 0.3))' 
            }}
          />
        </div>

        <div className="login-header" style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '750', color: '#ffffff' }}>Create Account</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Register a login to access the system</p>
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
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Request System Role with options Admin, Employee, and Receptionist */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Request System Role</label>
            <select
              name="role"
              className="form-control"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff', cursor: 'pointer' }}
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="admin" style={{ background: '#0b1329', color: '#ffffff' }}>Admin</option>
              <option value="employee" style={{ background: '#0b1329', color: '#ffffff' }}>Employee</option>
              <option value="receptionist" style={{ background: '#0b1329', color: '#ffffff' }}>Receptionist</option>
            </select>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Create New Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
                placeholder="••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Verify New Password</label>
              <input
                type="password"
                name="verifyPassword"
                className="form-control"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
                placeholder="••••••"
                value={formData.verifyPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontWeight: '600', fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
