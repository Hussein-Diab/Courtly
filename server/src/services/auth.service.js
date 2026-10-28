const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const toPublicUser = (u) => ({ id: u.id, fullName: u.full_name, email: u.email, role: u.role });

const signup = async ({ fullName, email, password, role }) => {
  if (await userRepository.findByEmail(email)) {
    throw new AppError('This email is already registered', 409);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const id = await userRepository.create({ fullName, email, passwordHash, role });
  const user = await userRepository.findById(id);
  return { user: toPublicUser(user), token: signToken(user) };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  const valid = user && user.is_active && (await bcrypt.compare(password, user.password_hash));
  if (!valid) throw new AppError('Invalid email or password', 401);
  return { user: toPublicUser(user), token: signToken(user) };
};

const getProfile = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return toPublicUser(user);
};

module.exports = { signup, login, getProfile };
