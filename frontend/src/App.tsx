import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Tables from './pages/Tables';
import RoleDashboard from './pages/RoleDashboard';
import ProductDetail from './pages/ProductDetail';
import TableDetail from './pages/TableDetail';
import OrderHistory from './pages/OrderHistory';
import TableHistory from './pages/TableHistory';
import { isAdmin, getToken, getRole } from './api';

function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const logged = !!getToken();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="header container">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="brand">CafeManager</div>
        <nav className="nav-links">
          <Link to="/">Products</Link>
          <Link to="/orders">Orders</Link>
          {(getRole() === 'waiter' || getRole() === 'cashier' || isAdmin()) && <Link to="/tables">Tables</Link>}
          {isAdmin() && <Link to="/users">Users</Link>}
          <Link to="/dashboard">Dashboard</Link>
          {!logged && <Link to="/login">Login</Link>}
        </nav>
      </div>

      <div className="user-area">
        <div className="muted small">{username ? `${username}${role ? ' (' + role + ')' : ''}` : 'Not logged in'}</div>
        {username && <button className="btn btn-ghost" onClick={logout}>Logout</button>}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="container">
        <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/products/:id" element={<ProductDetail/>} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/history/orders" element={<OrderHistory/>} />
        <Route path="/users" element={<Users/>} />
        <Route path="/tables" element={<Tables/>} />
        <Route path="/tables/:id" element={<TableDetail/>} />
        <Route path="/history/tables" element={<TableHistory/>} />
        <Route path="/dashboard" element={<RoleDashboard/>} />
        <Route path="/" element={<Products/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;