import React, { useEffect, useState } from 'react';
import { getJson, authFetch } from '../api';
import { useParams } from 'react-router-dom';

export default function TableDetail(){
  const { id } = useParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [tableName, setTableName] = useState('');

  useEffect(() => { if (id) fetchData(); }, [id]);

  async function fetchData(){
    try{
      const all = await getJson('/orders');
      const list = Array.isArray(all) ? all.filter((o:any) => o.table?.id === Number(id)) : [];
      setOrders(list);
      if (list.length) setTableName(list[0].table?.name || '');
    }catch(err){ console.error(err); }
  }

  async function closeTable(){
    if (!id) return;
    if (!confirm('Confirm close and pay this table?')) return;
    try{
      const res = await authFetch(`/tables/${id}/close`, { method: 'POST', body: JSON.stringify({}) });
      if (!res.ok) throw new Error(await res.text());
      alert('Table closed and history saved');
      fetchData();
    }catch(err){ console.error(err); alert('Failed to close table'); }
  }

  return (
    <div className="container">
      <h2 className="page-title">Table Details {tableName ? `- ${tableName}` : ''}</h2>
      <div className="muted">Orders for this table (who created them and items)</div>
      <ul className="list" style={{ marginTop: 12 }}>
        {orders.map(o => (
          <li key={o.id} className="list-item">
            <div>
              <div style={{ fontWeight: 700 }}>Order #{o.id} <span className="meta">Status: {o.status}</span></div>
              <div className="meta">Created by: {o.user?.username || 'Guest'}</div>
              <ul style={{ marginTop: 8 }}>
                {(o.items || []).map((it:any) => (
                  <li key={it.id}>{it.product?.name || 'unknown'} x {it.quantity}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12 }}>
        <button className="btn btn-primary" onClick={closeTable}>Close / Pay Table</button>
      </div>
    </div>
  );
}
