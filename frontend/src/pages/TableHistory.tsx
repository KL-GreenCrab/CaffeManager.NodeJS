import React, { useEffect, useState } from "react";
import { getJson } from "../api";

export default function TableHistory() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await getJson("/tables/history");
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  //===== INLINE STYLES =====
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
    maxWidth: 900,
    margin: "0 auto",
    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  };

  const historyItem: React.CSSProperties = {
    background: "#fffaf3",
    border: "1px solid #e2d5c3",
    padding: "16px 14px",
    borderRadius: 10,
    marginBottom: 12,
  };

  const title: React.CSSProperties = {
    fontWeight: 700,
    color: "#4a3728",
  };

  const meta: React.CSSProperties = {
    color: "#6b4f3a",
    fontSize: 13,
    marginTop: 4,
  };

  const summaryStyle: React.CSSProperties = {
    cursor: "pointer",
    color: "#4a3728",
    fontWeight: 600,
  };

  const jsonBox: React.CSSProperties = {
    whiteSpace: "pre-wrap",
    background: "#faf4ea",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #e2d5c3",
    marginTop: 8,
    fontSize: 13,
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={{ color: "#4a3728", marginBottom: 14 }}>Table History</h2>

        {list.map((h: any) => (
          <div key={h.id} style={historyItem}>
            <div style={title}>
              Table #{h.tableId} • Total: ${h.total?.toFixed(2)}
            </div>

            <div style={meta}>Closed At: {h.closedAt}</div>

            <div style={{ marginTop: 10 }}>
              <details>
                <summary style={summaryStyle}>Orders Snapshot</summary>
                <pre style={jsonBox}>{h.ordersJson}</pre>
              </details>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p style={{ ...meta, marginTop: 20 }}>No history available.</p>
        )}
      </div>
    </div>
  );
}
