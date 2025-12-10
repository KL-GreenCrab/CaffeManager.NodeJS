import React, { useState, useEffect } from 'react';
import { getJson, authFetch, getToken, isAdmin } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('cashier');
  const [message, setMessage] = useState('');

  async function createUser(e: any) {
    e.preventDefault();
    try {
      const res = await authFetch('/users', { method: 'POST', body: JSON.stringify({ username, password, fullName, role }) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMessage('User created: ' + data.username);
      setUsername(''); setPassword(''); setFullName('');
    } catch (err: any) {
      setMessage('Error: ' + (err.message || err));
    }
  }

  async function loadProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return setMessage('Login as admin to create users');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload.sub;
      const data = await getJson('/users/' + id);
      setMessage('Logged as: ' + data.username + (data.role?.name ? ' (' + data.role.name + ')' : ''));
    } catch (err: any) {
      setMessage('Could not load profile: ' + (err.message || err));
    }
  }

  useEffect(() => {
    if (!getToken()) return navigate('/login');
    if (!isAdmin()) setMessage('Only admin can create users');
  }, []);

  return (
    <div className="container">
      <h2 className="page-title">Users (Admin only)</h2>
      <div className="top-actions">
        <button className="btn btn-ghost" onClick={loadProfile}>Load My Profile</button>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={createUser}>
          <div className="form-row"><input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} /></div>
          <div className="form-row"><input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <div className="form-row"><input placeholder="full name" value={fullName} onChange={e => setFullName(e.target.value)} /></div>
          <div className="form-row">
            <label className="small muted">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="admin">admin</option>
              <option value="cashier">cashier</option>
              <option value="waiter">waiter</option>
            </select>
          </div>
          <div className="top-actions"><button className="btn btn-primary" type="submit">Create user</button></div>
        </form>
      </div>

      <div className="muted" style={{ marginTop: 12 }}>{message}</div>
    </div>
  );
}
