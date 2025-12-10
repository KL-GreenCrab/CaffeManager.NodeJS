import React from 'react';
import { Link } from 'react-router-dom';
import { getRole, isAdmin, parseToken } from '../api';

export default function RoleDashboard(){
  const role = getRole();

  return (
    <div className="container">
      <div className="card">
        <h2 className="page-title">Dashboard</h2>
        <p>Signed in as: <b>{localStorage.getItem('username') || 'Guest'}</b> {role ? `(${role})` : ''}</p>

        <div style={{ marginTop: 12 }}>
          <h4>Login Info</h4>
          <pre style={{ maxHeight: 180, overflow: 'auto' }}>{JSON.stringify(parseToken() || {}, null, 2)}</pre>
        </div>

        {isAdmin() && (
          <div>
            <h3>Admin Actions</h3>
            <div className="grid">
              <Link to="/users" className="card">Manage Users</Link>
              <Link to="/products" className="card">Manage Products</Link>
              <Link to="/tables" className="card">Manage Tables</Link>
              <Link to="/orders" className="card">View Orders</Link>
              <Link to="/history/orders" className="card">Order History</Link>
              <Link to="/history/tables" className="card">Table History</Link>
            </div>
          </div>
        )}

        {role === 'waiter' && (
          <div>
            <h3>Waiter Actions</h3>
            <div className="grid">
              <Link to="/tables" className="card">View Tables</Link>
              <Link to="/orders" className="card">Create Orders</Link>
            </div>
          </div>
        )}

        {role === 'cashier' && (
          <div>
            <h3>Cashier Actions</h3>
            <div className="grid">
              <Link to="/orders" className="card">View / Close Orders</Link>
            </div>
          </div>
        )}

        {!role && (
          <div>
            <h3>Guest</h3>
            <p>Please <Link to="/login">login</Link> to access features.</p>
          </div>
        )}
      </div>
    </div>
  );
}
