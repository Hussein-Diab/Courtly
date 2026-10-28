import { request } from './http.js';

export const signup = (payload) => request('/auth/signup', { method: 'POST', body: payload });
export const login = (payload) => request('/auth/login', { method: 'POST', body: payload });
export const getMe = () => request('/auth/me');
