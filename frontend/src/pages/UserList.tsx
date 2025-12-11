import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../api";

interface User {
  id: number;
  username: string;
  fullName: string;
  role: {
    id: number;
    name: string;
  };
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await authFetch("/users");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Failed to fetch users.");
    }
  }

  async function deleteUser(id: number) {
    if (!confirm(`Are you sure you want to delete user with ID ${id}?`)) return;
    try {
      const res = await authFetch(`/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      alert("User deleted successfully.");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user.");
    }
  }

  const tableContainer: React.CSSProperties = {
    padding: 20,
    maxWidth: 900,
    margin: "0 auto",
    fontFamily: "Segoe UI, sans-serif",
  };

  const headerTitle: React.CSSProperties = {
    fontSize: 26,
    fontWeight: 700,
    color: "#4a3728",
    marginBottom: 20,
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fffaf3",
    border: "1px solid #e2d5c3",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  const thStyle: React.CSSProperties = {
    padding: "12px 10px",
    background: "#f1e4d1",
    color: "#4a3728",
    textAlign: "left",
    fontWeight: 700,
    borderBottom: "2px solid #d5c3af",
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px 10px",
    borderBottom: "1px solid #e8dcc9",
    color: "#4a3728",
  };

  const actionBtn: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const editBtn: React.CSSProperties = {
    ...actionBtn,
    background: "#d7c3a3",
    color: "#4a3728",
  };

  const deleteBtn: React.CSSProperties = {
    ...actionBtn,
    background: "#e57373",
    color: "white",
    marginLeft: 10,
  };

  return (
    <div style={tableContainer}>
      <h2 style={headerTitle}>Manage Users</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={tdStyle}>{user.id}</td>
              <td style={tdStyle}>{user.username}</td>
              <td style={tdStyle}>{user.fullName}</td>
              <td style={tdStyle}>{user.role.name}</td>
              <td style={tdStyle}>
                <Link to={`/users/${user.id}`} style={editBtn}>
                  Edit
                </Link>
                <button
                  onClick={() => deleteUser(user.id)}
                  style={deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td style={{ ...tdStyle, padding: 20 }} colSpan={5}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
