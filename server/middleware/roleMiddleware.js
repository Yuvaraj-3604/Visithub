export const authorize = (...roles) => {
  return (req, res, next) => {
    // Super admin has permission for all admin routes automatically
    const isAuthorized = req.user && (
      roles.includes(req.user.role) || 
      req.user.role === 'super_admin'
    );

    if (isAuthorized) {
      next();
    } else {
      res.status(403).json({
        message: `Forbidden: Access is denied for user role '${req.user ? req.user.role : 'anonymous'}'`,
      });
    }
  };
};
