import Activity from '../models/Activity.js';

// @desc    Get all activities (audit logs)
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate({
        path: 'visitor_id',
        populate: {
          path: 'host_employee_id'
        }
      })
      .populate('performed_by')
      .sort({ created_at: -1 });

    let results = activities.map(act => {
      const actObj = act.toObject();
      return {
        ...actObj,
        _id: actObj._id.toString(),
        timestamp: actObj.created_at || actObj.createdAt || new Date(),
        visitorId: actObj.visitor_id ? {
          ...actObj.visitor_id,
          _id: actObj.visitor_id._id.toString(),
          passCode: actObj.visitor_id.pass_code,
          hostEmployee: actObj.visitor_id.host_employee_id ? {
            ...actObj.visitor_id.host_employee_id,
            _id: actObj.visitor_id.host_employee_id._id.toString(),
          } : null
        } : null,
        performedBy: actObj.performed_by ? {
          ...actObj.performed_by,
          _id: actObj.performed_by._id.toString(),
        } : null
      };
    });

    // If user is an employee, restrict activities to those related to their visitors (Disabled)
    /*
    if (req.user.role === 'employee') {
      results = results.filter(
        (act) => act.visitorId && act.visitorId.hostEmployee && act.visitorId.hostEmployee._id === req.user.employeeId
      );
    }
    */

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
