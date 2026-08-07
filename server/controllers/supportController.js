import SupportTicket from '../models/SupportTicket.js';

// @desc    Submit a new support query
// @route   POST /api/support/tickets
// @access  Private (Admin, Receptionist, Employee)
export const createSupportTicket = async (req, res) => {
  try {
    const { category, subject, description } = req.body;

    if (!category || !subject || !description) {
      return res.status(400).json({ message: 'Category, subject, and detailed description are required.' });
    }

    const ticket = await SupportTicket.create({
      user_id: req.user.id || req.user._id,
      username: req.user.username,
      role: req.user.role,
      category,
      subject,
      description,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Support query submitted successfully to Super Admin!',
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's support ticket history
// @route   GET /api/support/tickets/my
// @access  Private
export const getMySupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user_id: req.user.id || req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all support tickets (For Super Admin / Admin review)
// @route   GET /api/support/tickets
// @access  Private (Super Admin, Admin)
export const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve / Clear support query ticket
// @route   PUT /api/support/tickets/:id/resolve
// @access  Private (Super Admin, Admin)
export const resolveSupportTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Support query ticket not found' });
    }

    ticket.status = 'resolved';
    ticket.resolved_at = new Date();
    ticket.resolution_note = req.body.resolution_note || 'Reviewed and cleared by Super Admin';

    await ticket.save();

    res.json({
      message: 'Support query has been reviewed and cleared successfully!',
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
