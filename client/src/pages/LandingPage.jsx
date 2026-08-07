import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';

const LandingPage = () => {
  const navigate = useNavigate();
  const [dbStats, setDbStats] = useState({
    todayVisitors: 0,
    currentlyInside: 0,
    pendingRequests: 0,
    totalEmployees: 0,
    totalVisitors: 0
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await API.get('/reports/public-stats');
        if (res.data) {
          setDbStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching live stats from DB:', err);
      }
    };
    fetchPublicStats();
  }, []);


  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <path d="M12 12C13.1 12 14.0417 11.6083 14.825 10.825C15.6083 10.0417 16 9.1 16 8C16 6.9 15.6083 5.95833 14.825 5.175C14.0417 4.39167 13.1 4 12 4C10.9 4 9.95833 4.39167 9.175 5.175C8.39167 5.95833 8 6.9 8 8C8 9.1 8.39167 10.0417 9.175 10.825C9.95833 11.6083 10.9 12 12 12ZM4 20V17.2C4 16.6333 4.14583 16.1125 4.4375 15.6375C4.72917 15.1625 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.6458 8.75 13.3875C9.81667 13.1292 10.9 13 12 13C13.1 13 14.1833 13.1292 15.25 13.3875C16.3167 13.6458 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2708 15.1625 19.5625 15.6375C19.8542 16.1125 20 16.6333 20 17.2V20H4Z" fill="#0d9488"/>
        </svg>
      ),
      title: 'Seamless Check-In',
      desc: 'Smooth, touchless visitor check-in experience with instant digital pass generation and host notifications.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="#0d9488"/>
        </svg>
      ),
      title: 'Enhanced Security',
      desc: 'Real-time visitor tracking, host approval workflows, and complete audit trail for total workplace security.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" fill="#0d9488"/>
        </svg>
      ),
      title: 'Easy Registration',
      desc: 'Register visitors with a few clicks. Auto-generate unique pass codes and schedule visits in advance.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="#0d9488"/>
        </svg>
      ),
      title: 'Smart Reports',
      desc: 'Comprehensive analytics dashboards with date-range summaries, host frequency analysis, and exportable reports.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#0d9488"/>
        </svg>
      ),
      title: 'Role-Based Access',
      desc: 'Dedicated portals for Admins, Receptionists, and Employees — each with the right tools for their role.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <path d="M17 12H12V17H17V12ZM16 1V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H18V1H16ZM19 19H5V8H19V19Z" fill="#0d9488"/>
        </svg>
      ),
      title: 'Visit Scheduling',
      desc: 'Pre-schedule visits with expected arrival times. Automated validation rules prevent conflicts and duplicates.',
    },
  ];

  const stats = [
    { value: '10+', label: 'Business Rules' },
    { value: '5', label: 'Portal Roles' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Audit Trail' },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', 'Inter', sans-serif", background: '#ffffff', minHeight: '100vh', color: '#062132', width: '100%', overflowX: 'hidden' }}>
      
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ─── Navbar ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e5e7eb', padding: '0 20px', height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: '100%',
      }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', zIndex: 101 }} onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <img src="/logo.png" alt="VisitHub" style={{ height: '34px', width: '34px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#062132', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Visit<span style={{ color: '#0d9488' }}>Hub</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#features" style={{ color: '#475569', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#0d9488'}
              onMouseLeave={e => e.target.style.color = '#475569'}
            >Features</a>
            <a href="#how-it-works" style={{ color: '#475569', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#0d9488'}
              onMouseLeave={e => e.target.style.color = '#475569'}
            >How it Works</a>
            <button
              onClick={() => navigate('/login')}
              style={{
                color: '#0d9488', fontWeight: '600', fontSize: '1rem',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >Login</button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: '#0d9488', color: '#fff', border: 'none',
                padding: '10px 24px', borderRadius: '8px', fontWeight: '600',
                fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(13,148,136,0.3)'
              }}
              onMouseEnter={e => { e.target.style.background = '#0f766e'; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.background = '#0d9488'; e.target.style.transform = 'translateY(0)'; }}
            >Get Started</button>
          </div>
        )}

        {/* Mobile Hamburger Menu Toggle Button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#062132',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 101,
            }}
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        )}
      </nav>

      {/* ─── Mobile Navigation Drawer Overlay ─── */}
      {isMobile && isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(6, 33, 50, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 98,
            }}
          />
          
          {/* Slide-down Menu Panel */}
          <div style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '20px 24px 28px',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: '#062132',
                textDecoration: 'none',
                fontSize: '1.05rem',
                fontWeight: '600',
                padding: '12px 0',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: '#062132',
                textDecoration: 'none',
                fontSize: '1.05rem',
                fontWeight: '600',
                padding: '12px 0',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              How it Works
            </a>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                style={{
                  width: '100%',
                  background: '#f0fdfa',
                  color: '#0d9488',
                  border: '1.5px solid #0d9488',
                  padding: '12px 0',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Login
              </button>

              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }}
                style={{
                  width: '100%',
                  background: '#0d9488',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 0',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(13,148,136,0.3)',
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Hero Section ─── */}
      <section style={{
        paddingTop: isMobile ? '110px' : '140px',
        paddingBottom: isMobile ? '48px' : '80px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 60%)',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.08), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.06), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(13,148,136,0.08)',
            color: '#0d9488', padding: '6px 16px', borderRadius: '100px',
            fontSize: '0.85rem', fontWeight: '600', marginBottom: '20px',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            ✦ Visitor Pass Management System
          </div>

          <h1 style={{
            fontSize: isMobile ? '2.1rem' : 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            lineHeight: '1.2', color: '#062132', marginBottom: '20px',
            letterSpacing: '-0.03em',
          }}>
            Simple Yet Effective<br />
            <span style={{ color: '#0d9488' }}>Visitor Management</span> System
          </h1>

          <p style={{
            fontSize: isMobile ? '1rem' : 'clamp(1rem, 2vw, 1.2rem)', color: '#64748b',
            maxWidth: '650px', margin: '0 auto 32px', lineHeight: '1.6',
          }}>
            Keep your workplace safe and manage visitors at any scale with our simple yet effective 
            enterprise-grade visitor management software. Register, approve, check-in and check-out — all in one place.
          </p>

          <div style={{
            display: 'flex',
            justify: 'center',
            gap: '12px',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            maxWidth: isMobile ? '320px' : 'none',
            margin: '0 auto',
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: isMobile ? '100%' : 'auto',
                background: '#0d9488', color: '#fff', border: 'none',
                padding: '14px 32px', borderRadius: '10px', fontWeight: '700',
                fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: '0 4px 16px rgba(13,148,136,0.35)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { e.target.style.background = '#0f766e'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.target.style.background = '#0d9488'; e.target.style.transform = 'translateY(0)'; }}
            >
              Access Portal →
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                width: isMobile ? '100%' : 'auto',
                background: 'transparent', color: '#0d9488', 
                border: '2px solid #0d9488',
                padding: '14px 32px', borderRadius: '10px', fontWeight: '700',
                fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.target.style.background = '#f0fdfa'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.transform = 'translateY(0)'; }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Hero illustration area */}
        <div style={{
          maxWidth: '1000px', margin: isMobile ? '40px auto 0' : '60px auto 0', padding: '0 16px', position: 'relative', zIndex: 1,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '20px', padding: isMobile ? '24px 16px' : '40px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Simulated dashboard mockup */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
            }}>
              {[
                { label: "Today's Visitors", value: dbStats.todayVisitors, color: '#38bdf8' },
                { label: 'Currently Inside', value: dbStats.currentlyInside, color: '#4ade80' },
                { label: 'Pending Approval', value: dbStats.pendingRequests, color: '#fbbf24' },
                { label: 'Total Employees', value: dbStats.totalEmployees, color: '#c084fc' },
              ].map((card, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: '14px',
                  padding: isMobile ? '16px 12px' : '20px 16px', borderLeft: `4px solid ${card.color}`,
                  textAlign: 'left', backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}>
                  <div style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: '800', color: card.color, lineHeight: '1', marginBottom: '6px' }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: isMobile ? '0.78rem' : '0.85rem', color: 'rgba(255,255,255,0.8)', fontWeight: '600', letterSpacing: '0.01em' }}>
                    {card.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section style={{
        background: '#0f172a', padding: isMobile ? '32px 16px' : '40px 24px',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '24px',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: '800', color: '#0d9488' }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" style={{
        padding: isMobile ? '56px 16px' : '80px 24px', maxWidth: '1100px', margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '56px' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(13,148,136,0.08)',
            color: '#0d9488', padding: '6px 16px', borderRadius: '100px',
            fontSize: '0.8rem', fontWeight: '600', marginBottom: '16px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Features
          </div>
          <h2 style={{ fontSize: isMobile ? '1.75rem' : 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', color: '#062132', letterSpacing: '-0.02em' }}>
            Everything You Need to Manage Visitors
          </h2>
          <p style={{ color: '#64748b', fontSize: isMobile ? '1rem' : '1.1rem', maxWidth: '600px', margin: '12px auto 0' }}>
            A complete visitor management solution built for modern workplaces.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: isMobile ? '20px' : '28px',
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: '#f8fafc', borderRadius: '16px', padding: isMobile ? '24px 20px' : '32px',
              border: '1px solid #e2e8f0', transition: 'all 0.3s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#0d9488'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(13,148,136,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#062132', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section id="how-it-works" style={{
        padding: isMobile ? '56px 16px' : '80px 24px', background: '#f0fdfa',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(13,148,136,0.12)',
            color: '#0d9488', padding: '6px 16px', borderRadius: '100px',
            fontSize: '0.8rem', fontWeight: '600', marginBottom: '16px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            How it Works
          </div>
          <h2 style={{ fontSize: isMobile ? '1.75rem' : 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', color: '#062132', marginBottom: isMobile ? '32px' : '48px', letterSpacing: '-0.02em' }}>
            From Registration to Checkout in 4 Steps
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: isMobile ? '16px' : '24px' }}>
            {[
              { step: '01', title: 'Register', desc: 'Receptionist registers the visitor with host details.' },
              { step: '02', title: 'Approve', desc: 'Host employee reviews and approves or rejects the request.' },
              { step: '03', title: 'Check In', desc: 'Visitor arrives and receptionist checks them in.' },
              { step: '04', title: 'Check Out', desc: 'Visit complete. Full audit log is recorded automatically.' },
            ].map((s, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: '16px', padding: isMobile ? '24px 20px' : '32px 24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0',
                position: 'relative', textAlign: 'left',
              }}>
                <div style={{
                  fontSize: '2.5rem', fontWeight: '900', color: 'rgba(13,148,136,0.12)',
                  position: 'absolute', top: '12px', right: '16px',
                }}>{s.step}</div>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', background: '#0d9488',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: '1rem', marginBottom: '16px',
                }}>{i + 1}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#062132', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section style={{
        padding: isMobile ? '56px 16px' : '80px 24px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '1.75rem' : 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', color: '#ffffff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Ready to Secure Your Workplace?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: isMobile ? '1rem' : '1.1rem', marginBottom: '32px', lineHeight: '1.6' }}>
            Start managing visitors efficiently today. Access your portal or create a new account to get started.
          </p>
          <div style={{
            display: 'flex',
            justify: 'center',
            gap: '12px',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            maxWidth: isMobile ? '320px' : 'none',
            margin: '0 auto',
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: isMobile ? '100%' : 'auto',
                background: '#0d9488', color: '#fff', border: 'none',
                padding: '14px 36px', borderRadius: '10px', fontWeight: '700',
                fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: '0 4px 16px rgba(13,148,136,0.4)',
              }}
              onMouseEnter={e => { e.target.style.background = '#14b8a6'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.target.style.background = '#0d9488'; e.target.style.transform = 'translateY(0)'; }}
            >
              Access Portal →
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                width: isMobile ? '100%' : 'auto',
                background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.3)',
                padding: '14px 36px', borderRadius: '10px', fontWeight: '700',
                fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#0d9488'; e.target.style.color = '#0d9488'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.3)'; e.target.style.color = '#fff'; e.target.style.transform = 'translateY(0)'; }}
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        padding: '32px 20px', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <img src="/logo.png" alt="VisitHub" style={{ height: '28px', width: '28px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#e2e8f0' }}>
            Visit<span style={{ color: '#0d9488' }}>Hub</span>
          </span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} VisitHub — Visitor Pass Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
