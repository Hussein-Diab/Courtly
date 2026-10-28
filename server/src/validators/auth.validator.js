const AppError = require('../utils/AppError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIGNUP_ROLES = ['player', 'owner'];

const signup = (req, res, next) => {
  const { fullName, email, password, role = 'player' } = req.body;
  if (!fullName || fullName.trim().length < 2) return next(new AppError('Full name is required'));
  if (!email || !EMAIL_RE.test(email)) return next(new AppError('A valid email is required'));
  if (!password || password.length < 8) return next(new AppError('Password must be at least 8 characters'));
  if (!SIGNUP_ROLES.includes(role)) return next(new AppError('Invalid role'));

  req.body = { fullName: fullName.trim(), email: email.trim().toLowerCase(), password, role };
  next();
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Email and password are required'));
  req.body = { email: email.trim().toLowerCase(), password };
  next();
};

module.exports = { signup, login };
