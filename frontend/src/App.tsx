import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Products from './pages/Products';
import Orders from './pages/Orders';

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div style={{ padding: 10, borderBottom: '1px solid #ddd', marginBottom: 10 }}>
      <Link to="/">Products</Link> {' | '} <Link to="/orders">Orders</Link> {' | '} <Link to="/login">Login</Link>
      <span style={{ float: 'right' }}>{username ? `${username}${role ? ' (' + role + ')' : ''}` : 'Not logged in'} {username && <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>}</span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/" element={<Products/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
