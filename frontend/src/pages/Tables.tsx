import React, { useEffect, useState } from 'react';
import { getJson, authFetch, getToken, isAdmin, getRole } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Tables() {
  const navigate = useNavigate();
  const [tables, setTables] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchTables(); }, []);
  async function fetchTables() {
    try {
      const data = await getJson('/tables');
      setTables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchTableTotal(id: number) {
    try {
      const data = await getJson(`/tables/${id}/total`);
      return data;
    } catch (err) { console.error(err); return null; }
  }

  async function createTable(e: any) {
    e.preventDefault();
    if (!getToken() || !isAdmin()) return setMsg('Only admin can create tables');
    try {
      const res = await authFetch('/tables', { method: 'POST', body: JSON.stringify({ name }) });
      if (!res.ok) throw new Error(await res.text());
      setName(''); setMsg('Table created');
      fetchTables();
    } catch (err: any) {
      setMsg('Error: ' + (err.message || err));
    }
  }

  async function setStatus(id: number, status: string) {
    if (!getToken() || !isAdmin()) return setMsg('Only admin can change table status');
    try {
      const res = await authFetch(`/tables/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error(await res.text());
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      <h2 className="page-title">Tables</h2>
      <div className="top-actions">
        {isAdmin() && (
          <form onSubmit={createTable} style={{ display: 'flex', gap: 8 }}>
            <input placeholder="table name" value={name} onChange={e => setName(e.target.value)} />
            <button className="btn btn-primary" type="submit">Create</button>
          </form>
        )}
      </div>

      <div className="muted" style={{ marginBottom: 12 }}>{msg}</div>

      <ul className="list">
        {tables.map(t => (
          <li className="list-item" key={t.id} onClick={() => navigate(`/tables/${t.id}`)} style={{ cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{t.name}</div>
                <div className="meta">{t.status}</div>
                <div className="meta" style={{ marginTop: 6 }}>
                  <button className="btn btn-ghost" onClick={async (e) => { e.stopPropagation(); const d = await fetchTableTotal(t.id); if (d) alert(`Table ${t.name} total: ${d.total}`); }}>Show Total</button>
                </div>
            </div>
            <div>
              {(isAdmin() || getRole() === 'waiter') && (
                <>
                  <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); setStatus(t.id, 'EMPTY'); }} style={{ marginLeft: 8 }}>EMPTY</button>
                  <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); setStatus(t.id, 'OCCUPIED'); }} style={{ marginLeft: 8 }}>OCCUPIED</button>
                  <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); setStatus(t.id, 'RESERVED'); }} style={{ marginLeft: 8 }}>RESERVED</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
