const BASE = 'http://localhost:3000';

export function getToken() {
  return localStorage.getItem('token');
}

export function parseToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (err) {
    return null;
  }
}

export function isAdmin() {
  const p = parseToken();
  return p?.role === 'admin';
}

export function getRole() {
  const p = parseToken();
  return p?.role || null;
}

export function isRole(role: string) {
  const r = getRole();
  return r === role;
}

export function getUserId() {
  const p = parseToken();
  return p?.sub;
}

export async function authFetch(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...(opts.headers as any || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(BASE + path, { ...opts, headers });
  return res;
}

export async function getJson(path: string) {
  const res = await authFetch(path);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default {
  authFetch, getJson, getToken, parseToken, isAdmin, getUserId
}
