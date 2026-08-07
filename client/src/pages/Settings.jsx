import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'notifications' | 'security'
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: user?.username || 'Yuvaraj Perumal V',
    email: user?.username?.includes('@') ? user.username : `${user?.username || 'admin'}.visithub@gmail.com`,
    phone: '+91 98765 43210',
    role: user?.role?.replace('_', ' ') || 'Admin',
    bio: 'Workplace Security & Visitor Operations Manager',
  });

  // Notification toggles state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    visitorArrival: true,
    approvalRequests: true,
    dailySummary: true,
    browserSound: true,
  });

  // Password state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Profile information updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Notification preferences saved successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match.' });
      return;
    }
    setMessage({ type: 'success', text: 'Security credentials updated successfully!' });
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#062132', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Manage your account and notification preferences
        </p>
      </div>

      {/* Alert Banner */}
      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '24px' }}>
          {message.type === 'success' ? '✅' : '⚠️'} {message.text}
        </div>
      )}

      {/* Tabs Header */}
      <div style={{
        display: 'inline-flex',
        background: '#f1f5f9',
        padding: '4px',
        borderRadius: '12px',
        marginBottom: '28px',
        gap: '4px',
        border: '1px solid #e2e8f0',
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            background: activeTab === 'profile' ? '#ffffff' : 'transparent',
            color: activeTab === 'profile' ? '#062132' : '#64748b',
            boxShadow: activeTab === 'profile' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          👤 Profile
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          style={{
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            background: activeTab === 'notifications' ? '#ffffff' : 'transparent',
            color: activeTab === 'notifications' ? '#062132' : '#64748b',
            boxShadow: activeTab === 'notifications' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🔔 Notifications
        </button>

        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            background: activeTab === 'security' ? '#ffffff' : 'transparent',
            color: activeTab === 'security' ? '#062132' : '#64748b',
            boxShadow: activeTab === 'security' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🛡️ Security
        </button>
      </div>

      {/* ─── Tab 1: Profile Information ─── */}
      {activeTab === 'profile' && (
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '750', color: '#062132', marginBottom: '4px' }}>
              Profile Information
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Update your personal details</p>
          </div>

          <form onSubmit={handleProfileSubmit}>
            {/* Avatar section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1.5rem',
                border: '3px solid #e2e8f0',
              }}>
                👤
              </div>
              <div>
                <button type="button" className="btn btn-secondary btn-sm" style={{ marginBottom: '6px' }}>
                  Change Photo
                </button>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>JPG, PNG or GIF. Max 2MB.</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.fullName}
                  onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={profileData.email}
                  onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.phone}
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>System Role</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileData.role}
                  disabled
                  style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label>Bio / Department Note</label>
              <textarea
                className="form-control"
                rows="3"
                value={profileData.bio}
                onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* ─── Tab 2: Notifications Settings ─── */}
      {activeTab === 'notifications' && (
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '750', color: '#062132', marginBottom: '4px' }}>
              Notification Preferences
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Choose how you receive real-time alerts and visitor notifications
            </p>
          </div>

          <form onSubmit={handleNotificationSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
              
              {[
                {
                  key: 'emailAlerts',
                  title: 'Email Notifications',
                  desc: 'Receive immediate email alerts when visitors arrive or check in.',
                },
                {
                  key: 'visitorArrival',
                  title: 'Visitor Arrival Alerts',
                  desc: 'Get live popup notifications when a registered guest reaches reception.',
                },
                {
                  key: 'approvalRequests',
                  title: 'Approval Reminders',
                  desc: 'Receive reminders for pending visitor authorization requests.',
                },
                {
                  key: 'dailySummary',
                  title: 'Daily Summary Report',
                  desc: 'Receive an automated end-of-day summary email with visitor activity stats.',
                },
                {
                  key: 'browserSound',
                  title: 'Browser Notification Sound',
                  desc: 'Play a chime when new visitor passes are requested or status changes.',
                },
              ].map((item) => (
                <div key={item.key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#062132', fontSize: '0.95rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                  
                  {/* Toggle Switch */}
                  <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: notifications[item.key] ? '#00bcd4' : '#cbd5e1',
                      transition: '0.3s',
                      borderRadius: '34px',
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '""',
                        height: '20px',
                        width: '20px',
                        left: notifications[item.key] ? '24px' : '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '0.3s',
                        borderRadius: '50%',
                      }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Save Notification Preferences
            </button>
          </form>
        </div>
      )}

      {/* ─── Tab 3: Security & Password ─── */}
      {activeTab === 'security' && (
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '750', color: '#062132', marginBottom: '4px' }}>
              Security & Password
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Update your account password and security settings
            </p>
          </div>

          <form onSubmit={handleSecuritySubmit} style={{ maxWidth: '500px' }}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Current Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={security.currentPassword}
                onChange={e => setSecurity({ ...security, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={security.newPassword}
                onChange={e => setSecurity({ ...security, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={security.confirmPassword}
                onChange={e => setSecurity({ ...security, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Update Password
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Settings;
