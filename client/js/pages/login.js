import { login } from '../api/auth.api.js';
import { saveSession } from '../utils/storage.js';

const form = document.getElementById('login-form');
const errorEl = document.getElementById('error');
const submitBtn = form.querySelector('button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  const data = Object.fromEntries(new FormData(form));

  submitBtn.disabled = true;
  try {
    saveSession(await login(data));
    window.location.href = '/index.html'; 
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    submitBtn.disabled = false;
  }
});
