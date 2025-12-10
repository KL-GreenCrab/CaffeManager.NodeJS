import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (err) {
    return null;
  }
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    const res = await fetch('http://localhost:3000/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    if (!res.ok) {
      const err = await res.text();
      alert('Login failed: ' + err);
      return;
    }
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      const payload = parseJwt(data.access_token);
      const uname = payload?.username || username;
      const role = payload?.role || null;
      localStorage.setItem('username', uname);
      if (role) localStorage.setItem('role', role);
      alert('Logged in as ' + uname + (role ? ' (' + role + ')' : ''));
      navigate('/products');
    } else {
      alert('Login failed');
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2 className="page-title">Login</h2>
        <div className="form-row"><input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} /></div>
        <div className="form-row"><input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <div className="top-actions"><button className="btn btn-primary" onClick={submit}>Login</button></div>
      </div>
    </div>
  );
}
