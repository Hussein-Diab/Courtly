const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

// Checks the "Authorization: Bearer <token>" header and fills req.user
module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next(new AppError('Authentication required', 401));

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};
