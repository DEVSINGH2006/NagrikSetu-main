import jwt from 'jsonwebtoken';
import { findUserById, findUserByEmail } from '../../database/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nagriksetu_super_secret_jwt_key_2026';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  // Support demo tokens used in frontend
  if (token === 'demo-admin-jwt-token') {
    const admin = await findUserByEmail('admin@nagriksetu.in');
    if (admin) {
      req.user = admin;
      return next();
    }
  }

  if (token === 'demo-citizen-jwt-token') {
    const citizen = await findUserByEmail('citizen@nagriksetu.in');
    if (citizen) {
      req.user = citizen;
      return next();
    }
  }

  if (token.startsWith('fallback-token-')) {
    req.user = {
      _id: 'citizen_demo_01',
      id: 'citizen_demo_01',
      name: 'Citizen User',
      email: 'citizen@nagriksetu.in',
      role: 'citizen'
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access forbidden: Admin privilege required' });
  }
};
