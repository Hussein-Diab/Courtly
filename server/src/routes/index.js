const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
// later: router.use('/fields', ...), router.use('/bookings', ...), etc.

module.exports = router;
