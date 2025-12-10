import React, { useState, useEffect } from "react";
import { getJson, authFetch, getToken, isAdmin } from "../api";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("cashier");
  const [message, setMessage] = useState("");

  async function createUser(e: any) {
    e.preventDefault();
    try {
      const res = await authFetch("/users", {
        method: "POST",
        body: JSON.stringify({ username, password, fullName, role }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMessage("User created: " + data.username);
      setUsername("");
      setPassword("");
      setFullName("");
    } catch (err: any) {
      setMessage("Error: " + (err.message || err));
    }
  }

  async function loadProfile() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("Login as admin to create users");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.sub;
      const data = await getJson("/users/" + id);
      setMessage(
        "Logged as: " +
          data.username +
          (data.role?.name ? " (" + data.role.name + ")" : "")
      );
    } catch (err: any) {
      setMessage("Could not load profile: " + (err.message || err));
    }
  }

  useEffect(() => {
    if (!getToken()) return navigate("/login");
    if (!isAdmin()) setMessage("Only admin can create users");
  }, []);

  // ==== INLINE STYLE ====

  const page: React.CSSProperties = {
    padding: "30px 20px",
    background: "#f5efe6",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  };

  const card: React.CSSProperties = {
    background: "white",
    padding: 20,
    borderRadius: 12,
    maxWidth: 600,
    margin: "0 auto",
    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  };

  const inputBox: React.CSSProperties = {
    padding: "10px 12px",
    width: "100%",
    borderRadius: 8,
    border: "1px solid #ccbba7",
    marginBottom: 12,
  };

  const label: React.CSSProperties = {
    color: "#4a3728",
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
  };

  const select: React.CSSProperties = {
    padding: "10px 12px",
    width: "100%",
    borderRadius: 8,
    border: "1px solid #ccbba7",
    marginBottom: 12,
  };

  const btnPrimary: React.CSSProperties = {
    background: "#6b4f3a",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    width: "100%",
    fontWeight: 600,
  };

  const btnGhost: React.CSSProperties = {
    background: "#e6d5bf",
    color: "#4a3728",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    marginBottom: 12,
  };

  const msgStyle: React.CSSProperties = {
    marginTop: 16,
    color: "#4a3728",
    fontWeight: 600,
    textAlign: "center",
  };

  return (
    <div style={page}>
      <h2 style={{ color: "#4a3728", textAlign: "center", marginBottom: 20 }}>
        Users (Admin Only)
      </h2>

      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <button style={btnGhost} onClick={loadProfile}>
          Load My Profile
        </button>
      </div>

      <div style={card}>
        <form onSubmit={createUser}>
          <label style={label}>Username</label>
          <input
            style={inputBox}
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label style={label}>Password</label>
          <input
            style={inputBox}
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label style={label}>Full Name</label>
          <input
            style={inputBox}
            placeholder="full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label style={label}>Role</label>
          <select
            style={select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">admin</option>
            <option value="cashier">cashier</option>
            <option value="waiter">waiter</option>
          </select>

          <button style={btnPrimary} type="submit">
            Create User
          </button>
        </form>
      </div>

      <div style={msgStyle}>{message}</div>
    </div>
  );
}
