import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import visitorService from '../../services/visitorService.js';

const RegisterVisitor = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [createdPassCode, setCreatedPassCode] = useState('');

  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    purpose: 'Meeting',
    hostEmployee: '',
    scheduleDate: new Date().toISOString().split('T')[0], // Default to today
    expectedArrivalTime: '',
  });

  useEffect(() => {
    const fetchActiveHosts = async () => {
      try {
        const hosts = await visitorService.getEmployees({ status: 'active' });
        setEmployees(hosts);
      } catch (err) {
        setError('Failed to fetch host employees. Please check database connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveHosts();
  }, []);

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
    setSuccessMsg('');
    setCreatedPassCode('');

    try {
      const response = await visitorService.registerVisitor(formData);
      setSuccessMsg(`Visitor registered successfully!`);
      setCreatedPassCode(response.passCode);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        purpose: 'Meeting',
        hostEmployee: '',
        scheduleDate: new Date().toISOString().split('T')[0],
        expectedArrivalTime: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit visitor registration');
    }
  };

  return (
    <div>
      <div className="topbar">
        <h1>Register New Visitor</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {createdPassCode && (
        <div className="card" style={{ marginBottom: '32px', borderLeft: '4px solid var(--color-success)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-success)', fontWeight: '600' }}>Visitor Pass Generated!</h2>
            <p style={{ fontSize: '0.95rem' }}>
              The visitor pass passcode is:
            </p>
            <div style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '0.05em', color: 'var(--text-main)', margin: '8px 0' }}>
              {createdPassCode}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Give this code to the visitor. They will need it for physical check-in and check-out at the gate.
            </p>
            <div>
              <button className="btn btn-secondary btn-sm" onClick={() => setCreatedPassCode('')}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Visitor Profile</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Visitor Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Organization / Company</label>
                <input
                  type="text"
                  name="organization"
                  className="form-control"
                  placeholder="e.g. Acme Corp"
                  value={formData.organization}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', margin: '20px 0 16px 0', color: 'var(--text-muted)', fontWeight: '500' }}>Visit Parameters</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Host Employee</label>
                <select
                  name="hostEmployee"
                  className="form-control"
                  value={formData.hostEmployee}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Choose Host Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.department} - {emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Purpose of Visit</label>
                <select
                  name="purpose"
                  className="form-control"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Meeting">Official Meeting</option>
                  <option value="Interview">Job Interview</option>
                  <option value="Maintenance">Maintenance / Service</option>
                  <option value="Delivery">Courier / Delivery</option>
                  <option value="Personal">Personal Visit</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Visit Date</label>
                <input
                  type="date"
                  name="scheduleDate"
                  className="form-control"
                  value={formData.scheduleDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Expected Arrival Time</label>
                <input
                  type="time"
                  name="expectedArrivalTime"
                  className="form-control"
                  placeholder="HH:MM"
                  value={formData.expectedArrivalTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
              <button type="submit" className="btn btn-primary" style={{ minWidth: '160px' }}>
                Create Visitor Request
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterVisitor;
