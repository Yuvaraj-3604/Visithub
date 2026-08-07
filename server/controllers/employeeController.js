import Employee from '../models/Employee.js';
import User from '../models/User.js';

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
export const getEmployees = async (req, res) => {
  const { status } = req.query;
  
  try {
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const employees = await Employee.find(filter).sort({ name: 1 });
    
    // Map `_id` to matching output format
    const normalizedEmployees = employees.map(emp => {
      const empObj = emp.toObject();
      return {
        ...empObj,
        _id: empObj._id.toString(),
      };
    });

    res.json(normalizedEmployees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const empObj = employee.toObject();
    res.json({
      ...empObj,
      _id: empObj._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an employee
// @route   POST /api/employees
// @access  Private/Admin
export const createEmployee = async (req, res) => {
  const { name, email, department, designation, phone, status } = req.body;

  try {
    const emailExists = await Employee.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Employee already exists with this email address' });
    }

    const createdEmployee = await Employee.create({
      name,
      email,
      department,
      designation,
      phone,
      status: status || 'active',
    });

    const empObj = createdEmployee.toObject();
    res.status(201).json({
      ...empObj,
      _id: empObj._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employee details
// @route   PUT /api/employees/:id
// @access  Private/Admin
export const updateEmployee = async (req, res) => {
  const { name, email, department, designation, phone, status } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (email) {
      const emailExists = await Employee.findOne({
        email,
        _id: { $ne: req.params.id }
      });
      if (emailExists) {
        return res.status(400).json({ message: 'Email address is already in use' });
      }
      employee.email = email;
    }

    if (name) employee.name = name;
    if (department) employee.department = department;
    if (designation) employee.designation = designation;
    if (phone) employee.phone = phone;
    if (status) employee.status = status;

    await employee.save();

    const empObj = employee.toObject();
    res.json({
      ...empObj,
      _id: empObj._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete employee & unlink User account
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Unlink corresponding user profiles
    await User.updateMany(
      { employee_id: req.params.id },
      { employee_id: null, role: 'receptionist' }
    );

    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: 'Employee deleted successfully, related user profiles unlinked.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
