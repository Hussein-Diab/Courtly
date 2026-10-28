const AppError = require('../utils/AppError');

// Usage: router.get('/x', auth, allowRoles('admin'), handler)
module.exports = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : next(new AppError('Forbidden', 403));
