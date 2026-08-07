import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('employee_id')
      .sort({ created_at: -1 });

    // Normalize user structure for frontend (mongoose _id format and employeeId field name)
    const normalizedUsers = users.map(u => {
      const uObj = u.toObject();
      return {
        ...uObj,
        _id: uObj._id.toString(),
        employeeId: uObj.employee_id ? {
          ...uObj.employee_id,
          _id: uObj.employee_id._id.toString()
        } : null,
        createdAt: uObj.created_at,
      };
    });

    res.json(normalizedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a user account
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  const { username, password, role, employeeId } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ username: username.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this username' });
    }

    if (role === 'employee' && !employeeId) {
      return res.status(400).json({ message: 'Employee profile association is required for Employee accounts' });
    }

    if (employeeId) {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Associated Employee not found' });
      }

      // Check if employee already has an account
      const existingEmployeeAccount = await User.findOne({ employee_id: employeeId });
      if (existingEmployeeAccount) {
        return res.status(400).json({ message: 'An account is already linked to this employee' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      role,
      employee_id: employeeId || null,
    });

    const populatedUser = await User.findById(newUser._id).populate('employee_id');
    const uObj = populatedUser.toObject();

    res.status(201).json({
      ...uObj,
      _id: uObj._id.toString(),
      employeeId: uObj.employee_id ? {
        ...uObj.employee_id,
        _id: uObj.employee_id._id.toString()
      } : null,
      createdAt: uObj.created_at,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user account
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  const { username, password, role, employeeId } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent modifying own role
    if (user._id.toString() === req.user.id && role && role !== user.role) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    if (username) {
      const usernameExists = await User.findOne({
        username: username.toLowerCase().trim(),
        _id: { $ne: req.params.id }
      });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = username.toLowerCase().trim();
    }

    if (role) {
      user.role = role;
    }

    if (role === 'employee' && !employeeId && !user.employee_id) {
      return res.status(400).json({ message: 'Employee profile association is required for Employee accounts' });
    }

    if (employeeId) {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee profile not found' });
      }

      const existingEmployeeAccount = await User.findOne({
        employee_id: employeeId,
        _id: { $ne: req.params.id }
      });
      if (existingEmployeeAccount) {
        return res.status(400).json({ message: 'An account is already linked to this employee' });
      }
      user.employee_id = employeeId;
    } else if (role && role !== 'employee') {
      user.employee_id = null;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const populatedUser = await User.findById(user._id).populate('employee_id');
    const uObj = populatedUser.toObject();

    res.json({
      ...uObj,
      _id: uObj._id.toString(),
      employeeId: uObj.employee_id ? {
        ...uObj.employee_id,
        _id: uObj.employee_id._id.toString()
      } : null,
      createdAt: uObj.created_at,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
