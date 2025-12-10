import React, { useEffect, useState } from 'react';
import { getJson } from '../api';

export default function TableHistory(){
  const [list, setList] = useState<any[]>([]);

  useEffect(() => { fetch(); }, []);
  async function fetch(){
    try{
      const data = await getJson('/tables/history');
      setList(Array.isArray(data) ? data : []);
    }catch(err){ console.error(err); }
  }

  return (
    <div className="container">
      <h2 className="page-title">Table History</h2>
      <ul className="list">
        {list.map((h:any) => (
          <li key={h.id} className="list-item">
            <div>
              <div style={{ fontWeight: 700 }}>Table #{h.tableId} • Total: {h.total}</div>
              <div className="meta">Closed At: {h.closedAt}</div>
              <div style={{ marginTop: 8 }}>
                <details>
                  <summary>Orders Snapshot</summary>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{h.ordersJson}</pre>
                </details>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
