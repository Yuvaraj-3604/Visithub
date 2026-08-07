import mongoose from 'mongoose';
import Visitor from '../models/Visitor.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';

// Helper to normalize visitor details for React client frontend
const normalizeVisitor = (v) => {
  if (!v) return null;
  const vObj = v.toObject ? v.toObject() : v;
  return {
    ...vObj,
    _id: vObj._id.toString(),
    scheduleDate: vObj.schedule_date,
    expectedArrivalTime: vObj.expected_arrival_time,
    checkInTime: vObj.check_in_time,
    checkOutTime: vObj.check_out_time,
    passCode: vObj.pass_code,
    hostEmployee: vObj.host_employee_id ? {
      ...vObj.host_employee_id,
      _id: vObj.host_employee_id._id ? vObj.host_employee_id._id.toString() : vObj.host_employee_id
    } : null,
  };
};

// @desc    Get dashboard metrics based on role
// @route   GET /api/reports/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      const [totalEmployees, totalUsers, todayVisitors, currentlyInside, pendingRequests] = await Promise.all([
        Employee.countDocuments(),
        User.countDocuments(),
        Visitor.countDocuments({ schedule_date: todayStr }),
        Visitor.countDocuments({ status: 'checked_in' }),
        Visitor.countDocuments({ status: 'pending' })
      ]);

      res.json({
        totalEmployees,
        totalUsers,
        todayVisitors,
        currentlyInside,
        pendingRequests,
      });

    } else if (req.user.role === 'receptionist') {
      const [todayVisitors, currentlyInside, pendingRequests, totalScheduledToday] = await Promise.all([
        Visitor.countDocuments({ schedule_date: todayStr }),
        Visitor.countDocuments({ status: 'checked_in' }),
        Visitor.countDocuments({ status: 'pending' }),
        Visitor.countDocuments({ schedule_date: todayStr, status: 'approved' })
      ]);

      res.json({
        todayVisitors,
        currentlyInside,
        pendingRequests,
        totalScheduledToday,
      });

    } else if (req.user.role === 'employee') {
      if (!req.user.employeeId) {
        return res.status(400).json({ message: 'User not associated with an employee profile' });
      }

      const [pendingRequests, todayVisitors, currentlyInside, totalApproved] = await Promise.all([
        Visitor.countDocuments({ status: 'pending' }),
        Visitor.countDocuments({ schedule_date: todayStr }),
        Visitor.countDocuments({ status: 'checked_in' }),
        Visitor.countDocuments({ status: 'approved' })
      ]);

      res.json({
        pendingRequests,
        todayVisitors,
        currentlyInside,
        totalApproved,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get custom reports
// @route   GET /api/reports/summary
// @access  Private/Admin
export const getSummaryReport = async (req, res) => {
  const { range, startDate, endDate } = req.query;
  let start = new Date();
  let end = new Date();

  if (range === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (range === 'week') {
    const today = new Date();
    const dayOfWeek = today.getDay();
    start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek);
    start.setHours(0, 0, 0, 0);
    end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - dayOfWeek));
    end.setHours(23, 59, 59, 999);
  } else if (range === 'custom' && startDate && endDate) {
    start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  } else {
    const today = new Date();
    start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  // Format to standard Postgres DATE format (YYYY-MM-DD)
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];

  try {
    const visitors = await Visitor.find({
      schedule_date: { $gte: startStr, $lte: endStr }
    }).populate('host_employee_id');

    const totalCount = visitors.length;
    const pendingCount = visitors.filter(v => v.status === 'pending').length;
    const approvedCount = visitors.filter(v => v.status === 'approved').length;
    const checkedInCount = visitors.filter(v => v.status === 'checked_in').length;
    const checkedOutCount = visitors.filter(v => v.status === 'checked_out').length;
    const rejectedCount = visitors.filter(v => v.status === 'rejected').length;
    const cancelledCount = visitors.filter(v => v.status === 'cancelled').length;

    let totalDurationMinutes = 0;
    let checkedOutDurationCount = 0;
    
    visitors.forEach(v => {
      if (v.status === 'checked_out' && v.check_in_time && v.check_out_time) {
        const diffMs = new Date(v.check_out_time) - new Date(v.check_in_time);
        totalDurationMinutes += Math.round(diffMs / 60000);
        checkedOutDurationCount++;
      }
    });

    const averageDurationMinutes = checkedOutDurationCount > 0 
      ? Math.round(totalDurationMinutes / checkedOutDurationCount)
      : 0;

    const hostFrequency = {};
    visitors.forEach(v => {
      if (v.host_employee_id) {
        const hostId = v.host_employee_id._id.toString();
        const hostName = v.host_employee_id.name;
        const dept = v.host_employee_id.department;
        if (!hostFrequency[hostId]) {
          hostFrequency[hostId] = { name: hostName, department: dept, count: 0 };
        }
        hostFrequency[hostId].count++;
      }
    });

    const topHosts = Object.values(hostFrequency)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const normalizedVisitors = visitors.map(v => normalizeVisitor(v));

    res.json({
      summary: {
        totalCount,
        pendingCount,
        approvedCount,
        checkedInCount,
        checkedOutCount,
        rejectedCount,
        cancelledCount,
        averageDurationMinutes,
      },
      topHosts,
      visitors: normalizedVisitors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public metrics for home/landing page
// @route   GET /api/reports/public-stats
// @access  Public
export const getPublicStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        todayVisitors: 0,
        currentlyInside: 0,
        pendingRequests: 0,
        totalEmployees: 0,
        totalVisitors: 0
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const [totalEmployees, todayVisitors, currentlyInside, pendingRequests, totalVisitors] = await Promise.all([
      Employee.countDocuments(),
      Visitor.countDocuments({ schedule_date: todayStr }),
      Visitor.countDocuments({ status: 'checked_in' }),
      Visitor.countDocuments({ status: 'pending' }),
      Visitor.countDocuments()
    ]);

    res.json({
      todayVisitors,
      currentlyInside,
      pendingRequests,
      totalEmployees,
      totalVisitors
    });
  } catch (error) {
    console.error('Error fetching public stats:', error.message);
    res.json({
      todayVisitors: 0,
      currentlyInside: 0,
      pendingRequests: 0,
      totalEmployees: 0,
      totalVisitors: 0
    });
  }
};

