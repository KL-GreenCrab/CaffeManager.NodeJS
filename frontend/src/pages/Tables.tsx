import React, { useEffect, useState } from "react";
import { getJson, authFetch, getToken, isAdmin, getRole } from "../api";
import { useNavigate } from "react-router-dom";

export default function Tables() {
  const navigate = useNavigate();
  const [tables, setTables] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchTables();
  }, []);

  async function fetchTables() {
    try {
      const data = await getJson("/tables");
      setTables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchTableTotal(id: number) {
    try {
      const data = await getJson(`/tables/${id}/total`);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function createTable(e: any) {
    e.preventDefault();
    if (!getToken() || !isAdmin())
      return setMsg("Only admin can create tables");

    try {
      const res = await authFetch("/tables", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error(await res.text());
      setName("");
      setMsg("Table created successfully");
      fetchTables();
    } catch (err: any) {
      setMsg("Error: " + (err.message || err));
    }
  }

  async function setStatus(id: number, status: string) {
    if (!getToken() || !isAdmin())
      return setMsg("Only admin can change status");

    try {
      const res = await authFetch(`/tables/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error(await res.text());
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  }

  // ==== STYLE ====
  const page: React.CSSProperties = {
    padding: "30px 20px",
    background: "#f5efe6",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  };

  const card: React.CSSProperties = {
    background: "#fffaf3",
    border: "1px solid #e2d5c3",
    padding: 18,
    borderRadius: 12,
    boxShadow: "0 3px 8px rgba(0,0,0,0.10)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    marginBottom: 12,
  };

  const btn: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "#e6d5bf",
    color: "#4a3728",
    marginLeft: 6,
  };

  const statusBadge = (status: string): React.CSSProperties => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    background:
      status === "EMPTY"
        ? "#d6ffd6"
        : status === "OCCUPIED"
        ? "#ffe2e2"
        : "#fff4b3",
    color:
      status === "EMPTY"
        ? "#007700"
        : status === "OCCUPIED"
        ? "#aa0000"
        : "#8a6d00",
    marginTop: 8,
  });

  const header: React.CSSProperties = { color: "#4a3728", marginBottom: 14 };

  return (
    <div style={page}>
      <h2 style={header}>Tables</h2>

      {isAdmin() && (
        <form
          onSubmit={createTable}
          style={{ display: "flex", gap: 10, marginBottom: 12 }}
        >
          <input
            placeholder="Table name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ccbba7",
            }}
          />
          <button
            style={{
              padding: "8px 14px",
              background: "#6b4f3a",
              color: "white",
              borderRadius: 8,
              border: "none",
            }}
          >
            Create
          </button>
        </form>
      )}

      {msg && (
        <div style={{ color: "#6b4f3a", marginBottom: 12, fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {/* TABLE LIST */}
      <div>
        {tables.map((t) => (
          <div
            key={t.id}
            style={card}
            onClick={() => navigate(`/tables/${t.id}`)}
          >
            {/* LEFT SIDE */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{t.name}</div>
              <div style={statusBadge(t.status)}>{t.status}</div>

              <button
                style={{ ...btn, marginTop: 10 }}
                onClick={async (e) => {
                  e.stopPropagation();
                  const d = await fetchTableTotal(t.id);
                  if (d) alert(`Table ${t.name} total: $${d.total}`);
                }}
              >
                Show Total
              </button>
            </div>

            {/* RIGHT SIDE — STATUS BUTTONS */}
            {/* {(isAdmin() || getRole() === "waiter") && (
              <div>
                <button
                  style={btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus(t.id, "EMPTY");
                  }}
                >
                  EMPTY
                </button>
                <button
                  style={btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus(t.id, "OCCUPIED");
                  }}
                >
                  OCCUPIED
                </button>
                <button
                  style={btn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus(t.id, "RESERVED");
                  }}
                >
                  RESERVED
                </button>
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}
