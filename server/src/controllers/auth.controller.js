const authService = require('../services/auth.service');

const signup = async (req, res, next) => {
  try {
    res.status(201).json(await authService.signup(req.body));
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    res.json(await authService.login(req.body));
  } catch (err) { next(err); }
};

const me = async (req, res, next) => {
  try {
    res.json({ user: await authService.getProfile(req.user.id) });
  } catch (err) { next(err); }
};

module.exports = { signup, login, me };
