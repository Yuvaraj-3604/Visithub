import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: String,
    required: true,
    trim: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  host_employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  schedule_date: {
    type: String, // Keep format 'YYYY-MM-DD'
    required: true
  },
  expected_arrival_time: {
    type: String, // Keep format 'HH:MM'
    required: true
  },
  check_in_time: {
    type: Date,
    default: null
  },
  check_out_time: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'checked_in', 'checked_out', 'cancelled'],
    default: 'pending'
  },
  remarks: {
    type: String,
    default: ''
  },
  pass_code: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
