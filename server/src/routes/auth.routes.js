const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const validator = require('../validators/auth.validator');
const auth = require('../middleware/auth.middleware');

router.post('/signup', validator.signup, controller.signup);
router.post('/login', validator.login, controller.login);
router.get('/me', auth, controller.me);

module.exports = router;
