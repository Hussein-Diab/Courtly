import { getToken, clearSession } from './storage.js';

// Call at the top of any page that needs a logged-in user
export const requireAuth = () => {
  if (!getToken()) window.location.href = '/pages/login.html';
};

export const logout = () => {
  clearSession();
  window.location.href = '/pages/login.html';
};
