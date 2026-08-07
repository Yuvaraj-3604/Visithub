import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Listen to screen resize for responsive mode switching
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setShowProfileDropdown(false);
    setShowNotifications(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format role display name
  const getRoleTitle = () => {
    switch (user?.role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'receptionist': return 'Receptionist';
      case 'employee': return 'Employee';
      default: return 'User';
    }
  };

  // Badge background color per role
  const getRoleBadgeStyle = () => {
    switch (user?.role) {
      case 'super_admin':
        return { background: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'admin':
        return { background: 'rgba(59, 130, 246, 0.18)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'receptionist':
        return { background: 'rgba(6, 182, 212, 0.18)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.3)' };
      case 'employee':
        return { background: 'rgba(168, 85, 247, 0.18)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' };
      default:
        return { background: 'rgba(13, 148, 136, 0.18)', color: '#14b8a6', border: '1px solid rgba(13, 148, 136, 0.3)' };
    }
  };

  // Navigation Items per role
  const renderNavItems = () => {
    const isCollapsed = !isMobile && isSidebarCollapsed;

    const navs = [];
    if (user?.role === 'super_admin' || user?.role === 'admin') {
      navs.push(
        { to: '/', label: 'Dashboard', icon: '📊', end: true },
        { to: '/employees', label: 'Manage Employees', icon: '👥' },
        { to: '/users', label: 'Manage Accounts', icon: '🔑' },
        { to: '/reports', label: 'Visitor Reports', icon: '📝' },
        { to: '/activities', label: 'Activity History', icon: '🕒' },
        { to: '/support-tickets', label: 'Support Tickets', icon: '💬' },
        { to: '/settings', label: 'Settings', icon: '⚙️' }
      );
    } else if (user?.role === 'receptionist') {
      navs.push(
        { to: '/', label: 'Dashboard', icon: '📊', end: true },
        { to: '/register-visitor', label: 'Register Visitor', icon: '📝' },
        { to: '/visitors', label: 'Action Center', icon: '🎟️' },
        { to: '/visitor-history', label: 'Visitor History', icon: '🕒' },
        { to: '/settings', label: 'Settings', icon: '⚙️' }
      );
    } else if (user?.role === 'employee') {
      navs.push(
        { to: '/', label: 'Dashboard', icon: '📊', end: true },
        { to: '/requests', label: 'Visitor Requests', icon: '✉️' },
        { to: '/settings', label: 'Settings', icon: '⚙️' }
      );
    }

    return navs.map((item) => (
      <li key={item.to} className="sidebar-nav-item">
        <NavLink
          to={item.to}
          end={item.end}
          className={({ isActive }) => (isActive ? 'active-nav-link' : 'nav-link')}
          onClick={() => setIsMobileOpen(false)}
        >
          <span className="nav-icon">{item.icon}</span>
          {!isCollapsed && <span>{item.label}</span>}
        </NavLink>
      </li>
    ));
  };

  const userInitials = user?.username ? user.username.substring(0, 2).toLowerCase() : 'vh';
  const userEmailDisplay = user?.username?.includes('@') 
    ? user.username 
    : `${user?.username || 'user'}@visithub.com`;

  // Sidebar width logic
  const sidebarWidth = isMobile ? '260px' : (isSidebarCollapsed ? '80px' : '260px');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      
      {/* ─── Mobile Drawer Backdrop Overlay ─── */}
      {isMobile && isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 150,
            transition: 'opacity 0.25s',
          }}
        />
      )}

      {/* ─── Dark Left Sidebar (Desktop & Mobile Modes) ─── */}
      <aside style={{
        width: sidebarWidth,
        background: '#0b1329',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: isMobile ? (isMobileOpen ? '0' : '-280px') : '0',
        zIndex: 200,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: isMobile && isMobileOpen ? '10px 0 30px rgba(0,0,0,0.5)' : 'none',
      }}>
        
        {/* Sidebar Header */}
        <div style={{
          padding: '20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          height: '70px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo.png" alt="VisitHub Logo" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
            {(isMobile || !isSidebarCollapsed) && (
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Visit<span style={{ color: '#00bcd4' }}>Hub</span>
              </span>
            )}
          </div>

          {/* Close button on mobile / Collapse chevron on desktop */}
          {isMobile ? (
            <button
              onClick={() => setIsMobileOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer', padding: '4px' }}
            >
              ✕
            </button>
          ) : (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '4px 8px',
                borderRadius: '6px',
              }}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? '❯' : '❮'}
            </button>
          )}
        </div>

        {/* Active Role Account Badge Pill */}
        {(isMobile || !isSidebarCollapsed) && (
          <div style={{ padding: '16px 20px 8px 20px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '8px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              ...getRoleBadgeStyle()
            }}>
              {getRoleTitle()} Account
            </div>
          </div>
        )}

        {/* Sidebar Menu Items */}
        <ul style={{ flex: 1, padding: '16px 12px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, overflowY: 'auto' }}>
          {renderNavItems()}
        </ul>

        {/* Sidebar Footer */}
        <div style={{
          padding: '16px 16px 24px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {(isMobile || !isSidebarCollapsed) && (
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '500' }}>Signed in as</div>
              <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userEmailDisplay}
              </div>
              <div style={{ display: 'inline-block', marginTop: '6px', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', ...getRoleBadgeStyle() }}>
                {getRoleTitle()}
              </div>
            </div>
          )}

          <button
            onClick={() => { setIsMobileOpen(false); navigate('/support'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1rem' }}>❓</span>
            {(isMobile || !isSidebarCollapsed) && <span>Help & Support</span>}
          </button>
        </div>
      </aside>

      {/* ─── Main Workspace & Topbar Header ─── */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? '0px' : (isSidebarCollapsed ? '80px' : '260px'),
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        minWidth: 0,
      }}>
        
        {/* Topbar Navigation Header */}
        <header style={{
          height: '70px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: isMobile ? '0 16px' : '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          gap: '16px',
        }}>

          {/* Left Controls: Mobile Hamburger + Logo + Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            {/* Hamburger Button for Mobile */}
            {isMobile && (
              <button
                onClick={() => setIsMobileOpen(true)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#062132',
                }}
                title="Open Navigation Menu"
              >
                ☰
              </button>
            )}

            {/* Search Box */}
            <div style={{ position: 'relative', width: isMobile ? '100%' : '340px', maxWidth: '340px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}>🔍</span>
              <input
                type="text"
                placeholder={isMobile ? 'Search...' : 'Search visitors, employees...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  fontSize: '0.85rem',
                  color: '#062132',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Right Profile & Notification Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px', flexShrink: 0 }}>
            
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Notifications"
              >
                🔔
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#00bcd4',
                }} />
              </button>

              {/* Notification Popover Box */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  right: isMobile ? '-60px' : 0,
                  top: '45px',
                  width: isMobile ? '280px' : '320px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  border: '1px solid #e2e8f0',
                  padding: '16px',
                  zIndex: 200,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontWeight: '700', color: '#062132', fontSize: '0.9rem' }}>Notifications</span>
                    <span style={{ fontSize: '0.75rem', color: '#00bcd4', cursor: 'pointer', fontWeight: '600' }} onClick={() => setShowNotifications(false)}>Mark all as read</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #00bcd4' }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#062132' }}>🎟️ New Visitor Check-In</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Robert Johnson checked in at Reception Desk A.</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>Just now</div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#062132' }}>⏳ Pending Visit Request</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Approval requested for Alice Walker (Tech Corp).</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>15 mins ago</div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#062132' }}>✅ Visit Approved</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Sarah Smith approved visit pass #VP-8921.</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>1 hour ago</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Trigger Button */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '8px',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  textTransform: 'lowercase',
                  border: '2px solid #e2e8f0',
                }}>
                  {userInitials}
                </div>

                {!isMobile && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#062132', lineHeight: '1.2' }}>
                      {userInitials}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {userEmailDisplay}
                    </div>
                  </div>
                )}

                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>▼</span>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '48px',
                  width: '200px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  padding: '8px 0',
                  zIndex: 200,
                }}>
                  <div style={{ padding: '8px 16px', fontSize: '0.78rem', fontWeight: '700', color: '#062132', borderBottom: '1px solid #f1f5f9' }}>
                    My Account
                  </div>

                  <button
                    onClick={() => { setShowProfileDropdown(false); navigate('/settings'); }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      color: '#334155',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => { setShowProfileDropdown(false); navigate('/settings'); }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      color: '#334155',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Settings
                  </button>

                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      color: '#ef4444',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ─── Main Content Canvas Area ─── */}
        <main style={{ flex: 1, padding: isMobile ? '16px' : '32px 40px', background: '#f8fafc' }}>
          <Outlet context={{ searchQuery, isMobile }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
