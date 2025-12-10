import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      alert("Sai username hoặc mật khẩu!");
      return;
    }

    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      const payload = parseJwt(data.access_token);
      localStorage.setItem("username", payload?.username || username);
      navigate("/products");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#f5efe6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, sans-serif"
      }}
    >
      <div
        style={{
          width: 420,
          padding: 32,
          background: "white",
          borderRadius: 14,
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 60, marginBottom: 10, color: "#6b4f3a" }}>☕</div>

        <h2 style={{ color: "#4a3728", margin: 0 }}>Coffee Shop Admin</h2>
        <p style={{ color: "#7a6a54", marginTop: 4, marginBottom: 24 }}>
          Đăng nhập để tiếp tục
        </p>

        {/* Username */}
        <div style={{ textAlign: "left", marginBottom: 18 }}>
          <label style={{ color: "#4a3728", fontSize: 14, fontWeight: 500 }}>
            Username
          </label>
          <input
            type="text"
            placeholder="Nhập username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #c7b39a",
              outline: "none",
              background: "#fffaf3",
              fontSize: 15
            }}
          />
        </div>

        {/* Password */}
        <div style={{ textAlign: "left", marginBottom: 18 }}>
          <label style={{ color: "#4a3728", fontSize: 14, fontWeight: 500 }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #c7b39a",
              outline: "none",
              background: "#fffaf3",
              fontSize: 15
            }}
          />
        </div>

        <button
          onClick={submit}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "#8d6f53",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            cursor: "pointer",
            transition: "0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#6b4f3a")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#8d6f53")}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
