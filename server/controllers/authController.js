import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail } from '../utils/emailService.js';
import { connectDB } from '../config/db.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { username, password, portalRole } = req.body;

  try {
    // Attempt DB connection if not ready
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() }).populate('employee_id');

    if (user && (await bcrypt.compare(password, user.password))) {
      // Enforce role-specific portal access (Separate Login Pages)
      if (portalRole) {
        const isSuperAdminPortal = portalRole === 'super_admin' || portalRole === 'super-admin';
        const isAdminPortal = portalRole === 'admin';
        const isReceptionistPortal = portalRole === 'receptionist';
        const isEmployeePortal = portalRole === 'employee';

        if (isSuperAdminPortal && user.role !== 'super_admin') {
          return res.status(403).json({ message: 'Access Denied: Not authorized for Super Admin Portal.' });
        }
        if (isAdminPortal && !['admin', 'super_admin'].includes(user.role)) {
          return res.status(403).json({ message: 'Access Denied: Not authorized for Administrator Portal.' });
        }
        if (isReceptionistPortal && user.role !== 'receptionist') {
          return res.status(403).json({ message: 'Access Denied: Not authorized for Receptionist Portal.' });
        }
        if (isEmployeePortal && user.role !== 'employee') {
          return res.status(403).json({ message: 'Access Denied: Not authorized for Employee Portal.' });
        }
      }

      const userObj = user.toObject();
      res.json({
        _id: userObj._id.toString(),
        username: userObj.username,
        role: userObj.role,
        employeeDetails: userObj.employee_id ? {
          ...userObj.employee_id,
          _id: userObj.employee_id._id.toString()
        } : null,
        token: generateToken(userObj._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('employee_id');

    if (user) {
      const userObj = user.toObject();
      res.json({
        _id: userObj._id.toString(),
        username: userObj.username,
        role: userObj.role,
        employeeDetails: userObj.employee_id ? {
          ...userObj.employee_id,
          _id: userObj.employee_id._id.toString()
        } : null,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user account (Sign Up)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  try {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // Check if user login already exists
    const userExists = await User.findOne({ username: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    // Verify employee email uniqueness
    const employeeExists = await Employee.findOne({ email: cleanEmail });
    if (employeeExists) {
      return res.status(400).json({ message: 'An employee profile with this email is already registered' });
    }

    // 1. Create Employee Profile
    const fullName = `${firstName} ${lastName}`;
    const targetRole = role || 'employee';

    const createdEmployee = await Employee.create({
      name: fullName,
      email: cleanEmail,
      phone: cleanPhone,
      department: 'General',
      designation: targetRole === 'employee' ? 'Associate Host' : targetRole === 'receptionist' ? 'Front Desk Agent' : 'Administrator',
      status: 'active',
    });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User account linked to employee
    let createdUser;
    try {
      createdUser = await User.create({
        username: cleanEmail,
        password: hashedPassword,
        role: targetRole,
        employee_id: createdEmployee._id,
      });
    } catch (userInsertErr) {
      // Rollback employee creation on user failure
      await Employee.findByIdAndDelete(createdEmployee._id);
      throw userInsertErr;
    }

    // 4. Send Welcome Email via Nodemailer with subject "Successfully Created Account"
    const welcomeEmailOptions = {
      to: cleanEmail,
      subject: 'Successfully Created Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #10b981; margin-top: 0;">Account Created Successfully!</h2>
          <p>Dear ${fullName},</p>
          <p>Welcome to VisitHub. Your account has been successfully created.</p>
          <div style="background-color: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Username / Email:</strong> ${cleanEmail}</p>
            <p style="margin: 0;"><strong>System Role:</strong> ${targetRole.toUpperCase()}</p>
          </div>
          <p>You can now navigate to your portal login page and authenticate to manage visitor passes.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 0.75rem; color: #999;">VisitHub &middot; Local Office Gatekeeper</p>
        </div>
      `,
    };

    try {
      await sendEmail(welcomeEmailOptions);
    } catch (mailError) {
      console.error('Failed to deliver welcome email:', mailError.message);
    }

    const employeeObj = createdEmployee.toObject();
    res.status(201).json({
      message: 'Registration successful! A welcome confirmation has been sent to your email.',
      user: {
        _id: createdUser._id.toString(),
        username: createdUser.username,
        role: createdUser.role,
        employeeDetails: {
          ...employeeObj,
          _id: employeeObj._id.toString()
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate password reset access code & dispatch email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const cleanEmail = email.toLowerCase().trim();
    let targetUser = null;

    // Fetch user by username (email)
    const userByUsername = await User.findOne({ username: cleanEmail });

    if (userByUsername) {
      targetUser = userByUsername;
    } else {
      // Find employee by email and load linked user
      const emp = await Employee.findOne({ email: cleanEmail });

      if (emp) {
        const userByEmp = await User.findOne({ employee_id: emp._id });
        if (userByEmp) {
          targetUser = userByEmp;
        }
      }
    }

    if (!targetUser) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Generate random 6-digit numeric access code
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Set expiry to 1 hour
    const expiresAt = new Date(Date.now() + 3600000);

    targetUser.reset_password_token = accessCode;
    targetUser.reset_password_expires = expiresAt;
    await targetUser.save();

    // Send access code email via Nodemailer
    const emailOptions = {
      to: cleanEmail,
      subject: 'VisitHub - Password Reset Access Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #f59e0b; margin-top: 0;">Password Reset Access Code</h2>
          <p>You are receiving this email because you requested a password reset for your account.</p>
          <p>Please use the following 6-digit access code to verify your identity and reset your password:</p>
          <div style="margin: 28px 0; text-align: center;">
            <span style="font-size: 2.25rem; font-weight: 850; letter-spacing: 6px; padding: 12px 28px; background-color: #e5e7eb; border-radius: 8px; border: 1px solid #cbd5e1; display: inline-block; color: #1f2937; font-family: monospace;">${accessCode}</span>
          </div>
          <p>This code will expire in 1 hour.</p>
          <p style="color: #666; font-size: 0.85rem;">If you did not request this password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 0.75rem; color: #999;">VisitHub &middot; Local Office Gatekeeper</p>
        </div>
      `,
    };

    const emailResult = await sendEmail(emailOptions);

    res.json({
      message: 'A 6-digit access verification code has been sent to your email.',
      devCode: accessCode,
      previewUrl: emailResult.previewUrl || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate access code and reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = token.trim();
    let targetUser = null;

    const userByUsername = await User.findOne({
      username: cleanEmail,
      reset_password_token: cleanCode
    });

    if (userByUsername) {
      targetUser = userByUsername;
    } else {
      const emp = await Employee.findOne({ email: cleanEmail });

      if (emp) {
        const userByEmp = await User.findOne({
          employee_id: emp._id,
          reset_password_token: cleanCode
        });

        if (userByEmp) {
          targetUser = userByEmp;
        }
      }
    }

    if (!targetUser) {
      return res.status(400).json({ message: 'The access verification code is incorrect or invalid' });
    }

    // Verify code expiry
    if (new Date(targetUser.reset_password_expires) < new Date()) {
      return res.status(400).json({ message: 'The verification code has expired. Please request a new one.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    targetUser.password = hashedPassword;
    targetUser.reset_password_token = null;
    targetUser.reset_password_expires = null;
    await targetUser.save();

    res.json({ message: 'Password reset successful! You can now log into your portal.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
