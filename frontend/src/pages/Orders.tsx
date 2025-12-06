import React, { useEffect, useState } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { fetchOrders(); }, []);
  async function fetchOrders() {
    try {
      const res = await fetch('http://localhost:3000/orders');
      if (!res.ok) {
        console.error('Failed to load orders', res.statusText);
        return;
      }
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Orders</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            Order #{o.id} - Table: {o.table?.name} - Total: {o.total} - Status: {o.status}
            <ul>
              {(o.items || []).map((it: any) => <li key={it.id}>{it.product?.name || 'unknown'} x {it.quantity}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
