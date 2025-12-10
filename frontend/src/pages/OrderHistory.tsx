import React, { useEffect, useState } from 'react';
import { getJson } from '../api';

export default function OrderHistory(){
  const [list, setList] = useState<any[]>([]);

  useEffect(() => { fetch(); }, []);
  async function fetch(){
    try{
      const data = await getJson('/orders/history');
      setList(Array.isArray(data) ? data : []);
    }catch(err){ console.error(err); }
  }

  return (
    <div className="container">
      <h2 className="page-title">Order History</h2>
      <ul className="list">
        {list.map((h:any) => (
          <li key={h.id} className="list-item">
            <div>
              <div style={{ fontWeight: 700 }}>Order #{h.orderId} • Total: {h.total}</div>
              <div className="meta">Paid At: {h.paidAt}</div>
              <div style={{ marginTop: 8 }}>
                <details>
                  <summary>Items</summary>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{h.itemsJson}</pre>
                </details>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
