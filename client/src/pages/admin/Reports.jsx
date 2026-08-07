import React, { useState, useEffect } from 'react';
import visitorService from '../../services/visitorService.js';

const Reports = () => {
  const [range, setRange] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { range };
      if (range === 'custom') {
        if (!startDate || !endDate) {
          setError('Please select both start and end dates');
          setLoading(false);
          return;
        }
        params.startDate = startDate;
        params.endDate = endDate;
      }
      const data = await visitorService.getSummaryReport(params);
      setReportData(data);
    } catch (err) {
      setError('Failed to generate report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [range]);

  const handleCustomRangeSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  return (
    <div>
      <div className="topbar">
        <h1>Visitor Reports & Analytics</h1>
      </div>

      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
            <label>Report Interval</label>
            <select
              className="form-control"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {range === 'custom' && (
            <form onSubmit={handleCustomRangeSubmit} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Generate
              </button>
            </form>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <div className="spinner"></div>
        </div>
      ) : reportData ? (
        <div>
          {/* Summary metrics widgets */}
          <div className="stats-grid" style={{ marginBottom: '32px' }}>
            <div className="card stat-card">
              <div>
                <div className="stat-label">Total Visits</div>
                <div className="stat-value">{reportData.summary.totalCount}</div>
              </div>
              <div className="stat-icon info">🎫</div>
            </div>

            <div className="card stat-card">
              <div>
                <div className="stat-label">Checked Out</div>
                <div className="stat-value">{reportData.summary.checkedOutCount}</div>
              </div>
              <div className="stat-icon success">🚪</div>
            </div>

            <div className="card stat-card">
              <div>
                <div className="stat-label">Avg. Duration</div>
                <div className="stat-value" style={{ fontSize: '1.75rem' }}>
                  {reportData.summary.averageDurationMinutes} min
                </div>
              </div>
              <div className="stat-icon primary">⏱️</div>
            </div>

            <div className="card stat-card">
              <div>
                <div className="stat-label">Rejected / Cancelled</div>
                <div className="stat-value">
                  {reportData.summary.rejectedCount + reportData.summary.cancelledCount}
                </div>
              </div>
              <div className="stat-icon danger">🛑</div>
            </div>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: '32px' }}>
            {/* Visitors details */}
            <div className="card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: '600' }}>Visits Matching Filters</h2>
              {reportData.visitors.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No visitors registered during this time range.</p>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Visitor</th>
                        <th>Host</th>
                        <th>Scheduled Date</th>
                        <th>Arrival Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.visitors.map((v) => (
                        <tr key={v._id}>
                          <td style={{ fontWeight: '500' }}>
                            <div>{v.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.organization}</div>
                          </td>
                          <td>{v.hostEmployee?.name}</td>
                          <td>{new Date(v.scheduleDate).toLocaleDateString()}</td>
                          <td>{v.expectedArrivalTime}</td>
                          <td>
                            <span className={`badge badge-${v.status}`}>
                              {v.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Top Employees Block */}
            <div className="card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: '600' }}>Top Visited Hosts</h2>
              {reportData.topHosts.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No host analytics available.</p>
              ) : (
                <div className="bar-chart-container">
                  {reportData.topHosts.map((host, idx) => {
                    // Calculate percentage width of the bar
                    const maxVal = reportData.topHosts[0].count;
                    const percent = maxVal > 0 ? (host.count / maxVal) * 100 : 0;
                    return (
                      <div className="bar-row" key={idx}>
                        <div className="bar-label">
                          <div>{host.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{host.department}</div>
                        </div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                        </div>
                        <div className="bar-value">{host.count}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Reports;
