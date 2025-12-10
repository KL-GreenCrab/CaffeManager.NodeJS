import React, { useEffect, useState } from 'react';
import { getJson } from '../api';

const ItemsDisplay = ({ jsonString }: { jsonString: string }) => {
  try {
    const items = JSON.parse(jsonString);
    if (!Array.isArray(items) || items.length === 0) {
      return <p>No items in this order.</p>;
    }

    return (
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {items.map((item: any, index: number) => (
          <li key={index}>
            {item.product?.name || 'Unknown Product'} – SL: {item.quantity} – Price: ${item.price}
          </li>
        ))}
      </ul>
    );
  } catch {
    return <pre style={{ whiteSpace: "pre-wrap" }}>{jsonString}</pre>;
  }
};


export default function OrderHistory() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const data = await getJson('/orders/history');
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "#f5efe6",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif"
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: 30,
          color: "#4a3728"
        }}
      >
        Order History
      </h2>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {list.map((h: any) => (
          <div
            key={h.id}
            style={{
              background: "white",
              marginBottom: 18,
              padding: 20,
              borderRadius: 12,
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#6b4f3a", fontSize: 18 }}>
              Order #{h.orderId} • Total: ${h.total}
            </div>

            <div style={{ marginTop: 4, color: "#7a6a54", fontSize: 14 }}>
              Paid At: {new Date(h.paidAt).toLocaleString()}
            </div>

            <details style={{ marginTop: 12 }}>
              <summary
                style={{
                  cursor: "pointer",
                  background: "#8d6f53",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: 6,
                  width: "fit-content",
                  fontSize: 14,
                  userSelect: "none",
                }}
              >
                View Items ({JSON.parse(h.itemsJson || "[]").length})
              </summary>

              <div style={{ marginTop: 10 }}>
                <ItemsDisplay jsonString={h.itemsJson} />
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
