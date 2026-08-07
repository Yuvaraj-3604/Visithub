import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_visitor_pass_management_key_2026'
      );

      // Get user from MongoDB
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Convert mongoose model to object and map properties to match the expectations of existing codebase
      const userObj = user.toObject();
      req.user = {
        id: userObj._id.toString(),
        username: userObj.username,
        role: userObj.role,
        employeeId: userObj.employee_id ? userObj.employee_id.toString() : null,
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    const isAuthorized = req.user && (
      roles.includes(req.user.role) || 
      req.user.role === 'super_admin'
    );

    if (!isAuthorized) {
      return res.status(403).json({
        message: `Role (${req.user?.role}) is not authorized to access this resource`,
      });
    }
    next();
  };
};
