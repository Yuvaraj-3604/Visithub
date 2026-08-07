import Visitor from '../models/Visitor.js';
import Employee from '../models/Employee.js';
import { logActivity } from '../utils/activityLogger.js';
import {
  sendVisitorCreatedEmail,
  sendVisitorApprovedEmail,
  sendVisitorRejectedEmail,
  sendVisitorCheckedInEmail,
  sendVisitorCheckedOutEmail,
  sendVisitorCancelledEmail,
} from '../utils/emailService.js';

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

// @desc    Register a new visitor request
// @route   POST /api/visitors
// @access  Private/Receptionist
export const registerVisitor = async (req, res) => {
  const { name, email, phone, organization, purpose, hostEmployee, scheduleDate, expectedArrivalTime } = req.body;

  try {
    // Verify host employee exists and is active
    const employee = await Employee.findById(hostEmployee);
    if (!employee) {
      return res.status(404).json({ message: 'Host Employee not found' });
    }
    if (employee.status !== 'active') {
      return res.status(400).json({ message: 'Host Employee is currently inactive' });
    }

    const inputDate = new Date(scheduleDate);
    const today = new Date();
    
    // Normalize dates for comparison (Rule 3)
    const normalizedInputDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (normalizedInputDate < normalizedToday) {
      return res.status(400).json({ message: 'Rule 3: Visit date cannot be earlier than the current date' });
    }

    // Rule 4: Today's expected arrival time comparison
    if (normalizedInputDate.getTime() === normalizedToday.getTime()) {
      const currentHH = today.getHours();
      const currentMM = today.getMinutes();
      const [arrivalHH, arrivalMM] = expectedArrivalTime.split(':').map(Number);

      if (arrivalHH < currentHH || (arrivalHH === currentHH && arrivalMM < currentMM)) {
        return res.status(400).json({ message: 'Rule 4: Expected arrival time cannot be earlier than current time for today' });
      }
    }

    // Rule 1: A visitor cannot have more than one active visit at the same time
    // Active visit: status in ['pending', 'approved', 'checked_in']
    const activeVisit = await Visitor.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phone: phone }
      ],
      status: { $in: ['pending', 'approved', 'checked_in'] }
    });

    if (activeVisit) {
      return res.status(400).json({ 
        message: `Rule 1: Visitor already has an active visit in state '${activeVisit.status}' (Pass Code: ${activeVisit.pass_code})` 
      });
    }

    // Rule 2: Duplicate registrations for same visitor on same date not allowed
    const duplicateRegistration = await Visitor.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phone: phone }
      ],
      schedule_date: scheduleDate,
      status: { $ne: 'cancelled' }
    });

    if (duplicateRegistration) {
      return res.status(400).json({ 
        message: `Rule 2: Visitor is already registered on this date (Pass Code: ${duplicateRegistration.pass_code})` 
      });
    }

    // Rule 5: Host employee cannot have more than three pending visitor requests
    const pendingRequestsCount = await Visitor.countDocuments({
      host_employee_id: hostEmployee,
      status: 'pending'
    });

    if (pendingRequestsCount >= 3) {
      return res.status(400).json({ 
        message: `Rule 5: Host employee ${employee.name} has too many pending requests (limit: 3)` 
      });
    }

    // Generate unique passcode
    let passCode;
    let codeExists = true;
    while (codeExists) {
      const candidateCode = `VP-${Math.floor(100000 + Math.random() * 900000)}`;
      const existing = await Visitor.findOne({ pass_code: candidateCode });
      if (!existing) {
        passCode = candidateCode;
        codeExists = false;
      }
    }

    const createdVisitor = await Visitor.create({
      name,
      email: email.toLowerCase(),
      phone,
      organization,
      purpose,
      host_employee_id: hostEmployee,
      schedule_date: scheduleDate,
      expected_arrival_time: expectedArrivalTime,
      status: 'pending',
      pass_code: passCode,
    });

    // Populate employee details for response
    const populated = await Visitor.findById(createdVisitor._id).populate('host_employee_id');

    // Log activity
    await logActivity(createdVisitor._id, 'created', req.user.id, 'Visitor request created by receptionist');

    // Trigger Email Notification for Visitor Creation
    sendVisitorCreatedEmail(populated, populated.host_employee_id);

    res.status(201).json(normalizeVisitor(populated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get visitors lists with filters
// @route   GET /api/visitors
// @access  Private
export const getVisitors = async (req, res) => {
  const { name, employeeName, visitDate, status, active } = req.query;
  
  try {
    const filter = {};

    // Role based scoping (Disabled to allow Employee account to view all visitors)
    /*
    if (req.user.role === 'employee') {
      if (!req.user.employeeId) {
        return res.status(400).json({ message: 'Employee user account is not associated with an Employee profile' });
      }
      filter.host_employee_id = req.user.employeeId;
    }
    */

    // Active query filters (excludes checked out, cancelled, rejected)
    // Rule 10: Cancelled visits should not appear in active visitor lists
    if (active === 'true') {
      filter.status = { $in: ['pending', 'approved', 'checked_in'] };
    } else if (status) {
      filter.status = status;
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (visitDate) {
      filter.schedule_date = visitDate;
    }

    let visitors = await Visitor.find(filter)
      .populate('host_employee_id')
      .sort({ created_at: -1 });

    let results = visitors.map(v => normalizeVisitor(v));

    if (employeeName) {
      const searchStr = employeeName.toLowerCase();
      results = results.filter(
        (v) => v.hostEmployee && v.hostEmployee.name.toLowerCase().includes(searchStr)
      );
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single visitor by id
// @route   GET /api/visitors/:id
// @access  Private
export const getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('host_employee_id');

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor pass not found' });
    }

    // Role verification (Disabled to allow Employee account access to all visitors)
    /*
    if (req.user.role === 'employee' && visitor.host_employee_id._id.toString() !== req.user.employeeId) {
      return res.status(403).json({ message: 'Unauthorized access to this visitor request' });
    }
    */

    res.json(normalizeVisitor(visitor));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or Reject visitor request (Employee only)
// @route   PUT /api/visitors/:id/approve-reject
// @access  Private
export const approveOrRejectRequest = async (req, res) => {
  const { action, remarks } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action. Must be approve or reject' });
  }

  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor request not found' });
    }

    // Authorization (Disabled to allow Employee account access to approve/reject all visitors)
    /*
    if (req.user.role === 'employee' && visitor.host_employee_id.toString() !== req.user.employeeId) {
      return res.status(403).json({ message: 'Only the host employee can approve/reject this request' });
    }
    */

    if (visitor.status !== 'pending') {
      return res.status(400).json({ message: `Cannot update request status, already set to '${visitor.status}'` });
    }

    visitor.status = action === 'approve' ? 'approved' : 'rejected';
    visitor.remarks = remarks || '';
    
    await visitor.save();

    const populated = await Visitor.findById(visitor._id).populate('host_employee_id');

    // Log activity
    await logActivity(
      populated._id,
      populated.status,
      req.user.id,
      remarks || `Request ${populated.status} by host employee`
    );

    // Trigger Email Notification for Approved / Rejected status
    if (action === 'approve') {
      sendVisitorApprovedEmail(populated, populated.host_employee_id);
    } else {
      sendVisitorRejectedEmail(populated, populated.host_employee_id);
    }

    res.json(normalizeVisitor(populated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check In Visitor
// @route   PUT /api/visitors/:id/check-in
// @access  Private/Receptionist
export const checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor record not found' });
    }

    // Rule 9: Rejected visitor requests cannot be checked in
    if (visitor.status === 'rejected') {
      return res.status(400).json({ message: 'Rule 9: Rejected visitor requests cannot be checked in' });
    }

    // Rule 6: Visitors can only be checked in after approval
    if (visitor.status === 'pending') {
      return res.status(400).json({ message: 'Rule 6: Visitors can only be checked in after approval' });
    }

    // Rule 7: A visitor who is already checked in cannot be checked in again
    if (visitor.status === 'checked_in') {
      return res.status(400).json({ message: 'Rule 7: Visitor is already checked in' });
    }

    if (visitor.status !== 'approved') {
      return res.status(400).json({ message: `Cannot check-in visitor with status '${visitor.status}'` });
    }

    visitor.status = 'checked_in';
    visitor.check_in_time = new Date();
    await visitor.save();

    const populated = await Visitor.findById(visitor._id).populate('host_employee_id');

    // Log activity
    await logActivity(populated._id, 'checked_in', req.user.id, 'Visitor checked in');

    // Trigger Email Notification for Checked In status
    sendVisitorCheckedInEmail(populated, populated.host_employee_id);

    res.json(normalizeVisitor(populated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check Out Visitor
// @route   PUT /api/visitors/:id/check-out
// @access  Private/Receptionist
export const checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor record not found' });
    }

    if (visitor.status !== 'checked_in') {
      return res.status(400).json({ message: 'Visitor is not checked in' });
    }

    const checkOutTime = new Date();

    // Rule 8: Check-out time must always be later than check-in time
    if (checkOutTime <= new Date(visitor.check_in_time)) {
      return res.status(400).json({ message: 'Rule 8: Check-out time must be later than check-in time' });
    }

    visitor.status = 'checked_out';
    visitor.check_out_time = checkOutTime;
    await visitor.save();

    const populated = await Visitor.findById(visitor._id).populate('host_employee_id');

    // Log activity
    await logActivity(populated._id, 'checked_out', req.user.id, 'Visitor checked out');

    // Trigger Email Notification for Checked Out status
    sendVisitorCheckedOutEmail(populated, populated.host_employee_id);

    res.json(normalizeVisitor(populated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel Visitor Pass
// @route   PUT /api/visitors/:id/cancel
// @access  Private/Receptionist
export const cancelVisitorRequest = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor pass not found' });
    }

    if (['checked_in', 'checked_out'].includes(visitor.status)) {
      return res.status(400).json({ message: `Cannot cancel a visit that is already ${visitor.status.replace('_', ' ')}` });
    }

    visitor.status = 'cancelled';
    await visitor.save();

    const populated = await Visitor.findById(visitor._id).populate('host_employee_id');

    // Log activity
    await logActivity(populated._id, 'cancelled', req.user.id, 'Visit cancelled');

    // Trigger Email Notification for Cancelled status
    sendVisitorCancelledEmail(populated, populated.host_employee_id);

    res.json(normalizeVisitor(populated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
