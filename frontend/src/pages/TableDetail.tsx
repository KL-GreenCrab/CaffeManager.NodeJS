import React, { useEffect, useState } from "react";
import { getJson, authFetch } from "../api";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function TableDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [tableName, setTableName] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  async function fetchData() {
    if (!id) return;
    try {
      const fetchedOrders = await getJson(`/orders/by-table/${id}`);
      const list = Array.isArray(fetchedOrders) ? fetchedOrders : [];
      setOrders(list);

      if (list.length > 0) {
        setTableName(list[0].table?.name || "");
      }

      const t = list.reduce((acc, o) => acc + Number(o.total), 0);
      setTotal(t);
    } catch (err) {
      console.error(err);
    }
  }

  async function closeTable() {
    if (!id) return;
    if (!confirm("Confirm close and pay this table?")) return;

    try {
      const res = await authFetch(`/tables/${id}/close`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error(await res.text());
      alert("Table closed and history saved");
      navigate("/tables");
    } catch (err) {
      console.error(err);
      alert("Failed to close table");
    }
  }

  // ===== INLINE STYLES =====
  const page: React.CSSProperties = {
    padding: "30px 20px",
    fontFamily: "Segoe UI, sans-serif",
    background: "#f5efe6",
    minHeight: "100vh",
  };

  const card: React.CSSProperties = {
    background: "white",
    padding: 20,
    borderRadius: 12,
    maxWidth: 900,
    margin: "0 auto",
    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  };

  const orderItem: React.CSSProperties = {
    padding: "16px 14px",
    background: "#fffaf3",
    borderRadius: 10,
    border: "1px solid #e2d5c3",
    marginBottom: 12,
  };

  const listTitle: React.CSSProperties = {
    fontWeight: 700,
    color: "#4a3728",
    marginBottom: 4,
  };

  const meta: React.CSSProperties = {
    color: "#6b4f3a",
    fontSize: 13,
    marginTop: 2,
  };

  const buttonPrimary: React.CSSProperties = {
    background: "#6b4f3a",
    color: "white",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    marginTop: 18,
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={{ color: "#4a3728", marginBottom: 4 }}>
          Table Details {tableName ? `- ${tableName}` : ""}
        </h2>

        <div
          style={{
            float: "right",
            marginTop: -32,
            fontWeight: 700,
            color: "#6b4f3a",
          }}
        >
          Total: ${total.toFixed(2)}
        </div>

        <p style={{ ...meta, marginTop: 10 }}>
          Orders for this table (creator + items)
        </p>

        <div style={{ marginTop: 12 }}>
          {orders.map((o) => (
            <div key={o.id} style={orderItem}>
              <div style={listTitle}>
                Order #{o.id}
                <span style={{ ...meta, marginLeft: 8 }}>
                  Status: {o.status}
                </span>

                <span style={{ float: "right" }}>
                  <Link to={`/orders/${o.id}`}>Edit</Link>
                </span>
              </div>

              <div style={meta}>
                Created by: {o.user?.username || "Guest"}
              </div>

              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                {(o.items || []).map((it: any) => (
                  <li key={it.id}>
                    {it.product?.name || "unknown"} × {it.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button style={buttonPrimary} onClick={closeTable}>
          Close / Pay Table
        </button>
      </div>
    </div>
  );
}
