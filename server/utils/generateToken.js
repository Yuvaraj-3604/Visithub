import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_visitor_pass_management_key_2026', {
    expiresIn: '30d',
  });
};

export default generateToken;
