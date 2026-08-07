import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  visitor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor',
    required: true
  },
  action: {
    type: String,
    enum: ['created', 'approved', 'rejected', 'checked_in', 'checked_out', 'cancelled'],
    required: true
  },
  performed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  remarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
