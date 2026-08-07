import Activity from '../models/Activity.js';

export const logActivity = async (visitorId, action, performedByUserId, remarks = '') => {
  try {
    const activity = await Activity.create({
      visitor_id: visitorId,
      action,
      performed_by: performedByUserId,
      remarks,
    });
    
    return activity;
  } catch (error) {
    console.error(`Failed to log activity in MongoDB: ${error.message}`);
  }
};
