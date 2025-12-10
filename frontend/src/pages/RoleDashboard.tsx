import React from "react";
import { Link } from "react-router-dom";
import { getRole, isAdmin, parseToken } from "../api";

export default function RoleDashboard() {
  const role = getRole();

  const page: React.CSSProperties = {
    padding: "30px 20px",
    background: "#f5efe6",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  };

  const mainCard: React.CSSProperties = {
    background: "white",
    padding: 20,
    borderRadius: 12,
    maxWidth: 900,
    margin: "0 auto",
    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  };

  const sectionTitle: React.CSSProperties = {
    margin: "20px 0 10px",
    color: "#4a3728",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 14,
    marginTop: 12,
  };

  const menuCard: React.CSSProperties = {
    background: "#fffaf3",
    border: "1px solid #e2d5c3",
    padding: "18px 14px",
    borderRadius: 10,
    textAlign: "center",
    fontWeight: 600,
    color: "#6b4f3a",
    textDecoration: "none",
    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
    transition: "0.2s",
  };

  const menuHover: React.CSSProperties = {
    transform: "scale(1.04)",
  };

  return (
    <div style={page}>
      <div style={mainCard}>
        <h2 style={{ textAlign: "center", color: "#4a3728" }}>Dashboard</h2>

        <p style={{ marginTop: 10 }}>
          Signed in as: <b>{localStorage.getItem("username") || "Guest"}</b>{" "}
          {role ? `(${role})` : ""}
        </p>

        {/* LOGIN INFO */}
        <div style={{ marginTop: 18 }}>
          <h4 style={sectionTitle}>Login Info</h4>
          <pre
            style={{
              maxHeight: 180,
              overflow: "auto",
              padding: 12,
              background: "#faf4ea",
              borderRadius: 8,
              border: "1px solid #e2d5c3",
            }}
          >
            {JSON.stringify(parseToken() || {}, null, 2)}
          </pre>
        </div>

        {/* ADMIN MENU */}
        {isAdmin() && (
          <div>
            <h3 style={sectionTitle}>Admin Actions</h3>

            <div style={grid}>
              {[
                ["Manage Users", "/users"],
                ["Manage Products", "/products"],
                ["Manage Tables", "/tables"],
                ["View Orders", "/orders"],
                ["Order History", "/history/orders"],
                ["Table History", "/history/tables"],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  style={menuCard}
                  onMouseEnter={(e) =>
                    Object.assign(e.currentTarget.style, menuHover)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.currentTarget.style, {
                      transform: "scale(1)",
                    })
                  }
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* WAITER MENU */}
        {role === "waiter" && (
          <div>
            <h3 style={sectionTitle}>Waiter Actions</h3>
            <div style={grid}>
              <Link
                to="/tables"
                style={menuCard}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, menuHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, {
                    transform: "scale(1)",
                  })
                }
              >
                View Tables
              </Link>

              <Link
                to="/orders"
                style={menuCard}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, menuHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, {
                    transform: "scale(1)",
                  })
                }
              >
                Create Orders
              </Link>
            </div>
          </div>
        )}

        {/* CASHIER MENU */}
        {role === "cashier" && (
          <div>
            <h3 style={sectionTitle}>Cashier Actions</h3>
            <div style={grid}>
              <Link
                to="/orders"
                style={menuCard}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, menuHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, {
                    transform: "scale(1)",
                  })
                }
              >
                View / Close Orders
              </Link>
            </div>
          </div>
        )}

        {/* GUEST */}
        {!role && (
          <div>
            <h3 style={sectionTitle}>Guest</h3>
            <p>
              Please <Link to="/login">login</Link> to access system features.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
