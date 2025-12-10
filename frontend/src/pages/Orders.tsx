import React, { useEffect, useState } from 'react';
import { getJson, authFetch, getRole, isAdmin, isRole } from '../api';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [tableId, setTableId] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => { fetchOrders(); fetchTables(); fetchProducts(); }, []);

  async function fetchOrders() {
    try {
      const data = await getJson('/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  }
  async function fetchTables() {
    try { const data = await getJson('/tables'); setTables(Array.isArray(data) ? data : []); } catch (err) { }
  }
  async function fetchProducts() {
    try { const data = await getJson('/products'); setProducts(Array.isArray(data) ? data : []); } catch (err) { }
  }

  function addToCart(){
    if (!selectedProduct) return alert('Select product');
    const pid = Number(selectedProduct);
    if (!pid) return alert('Invalid product');
    const q = Number(quantity) || 1;
    const exists = cart.find(c => c.productId === pid);
    if (exists) {
      setCart(cart.map(c => c.productId === pid ? { ...c, quantity: c.quantity + q } : c));
    } else {
      setCart([...cart, { productId: pid, quantity: q }]);
    }
  }

  async function createOrder(e: any) {
    e.preventDefault();
    try {
      if (!tableId) { alert('Please select a table'); return; }
      if (!cart.length) { alert('Cart empty'); return; }
      const res = await authFetch('/orders', { method: 'POST', body: JSON.stringify({ tableId: Number(tableId), items: cart }) });
      if (!res.ok) throw new Error(await res.text());
      setCart([]); setTableId(''); fetchOrders();
    } catch (err) { console.error(err); alert('Failed to create order'); }
  }

  async function changeStatus(orderId: number, status: string) {
    try {
      const res = await authFetch(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error(await res.text());
      fetchOrders();
    } catch (err) { console.error(err); alert('Failed to change status'); }
  }

  async function addItemToOrder(orderId: number, productId: number, qty: number) {
    try {
      const res = await authFetch(`/orders/${orderId}/add-item`, { method: 'POST', body: JSON.stringify({ productId, quantity: qty }) });
      if (!res.ok) throw new Error(await res.text());
      fetchOrders();
    } catch (err) { console.error(err); alert('Failed to add item'); }
  }

  async function removeItemFromOrder(orderId: number, itemId: number) {
    try {
      const res = await authFetch(`/orders/${orderId}/remove-item/${itemId}`, { method: 'PATCH' });
      if (!res.ok) throw new Error(await res.text());
      fetchOrders();
    } catch (err) { console.error(err); alert('Failed to remove item'); }
  }

  return (
    <div className="container">
      <h2 className="page-title">Orders</h2>

      <div className="card" style={{ marginBottom: 12 }}>
        <form onSubmit={createOrder} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 160 }}>
            <label className="small muted">Table</label>
            <select value={tableId} onChange={e => setTableId(e.target.value)}>
              <option value="">--select--</option>
              {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div style={{ minWidth: 160 }}>
            <label className="small muted">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="all">All</option>
              <option value="coffee">Coffee</option>
              <option value="tea">Tea</option>
              <option value="smoothie">Smoothie</option>
              <option value="soda">Soda</option>
              <option value="juice">Juice</option>
            </select>
          </div>

          <div style={{ minWidth: 220 }}>
            <label className="small muted">Product</label>
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
              <option value="">--select product--</option>
              {products.filter(p => category === 'all' ? true : p.type === category).map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: 120 }}>
            <label className="small muted">Qty</label>
            <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: 80 }} />
          </div>

          <div>
            <button type="button" className="btn btn-ghost" onClick={addToCart}>Add</button>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-primary" type="submit">Create Order</button>
          </div>
        </form>

        <div style={{ marginTop: 8 }}>
          <div className="small muted">Cart</div>
          <ul>
            {cart.map((c, idx) => {
              const p = products.find(pp => pp.id === c.productId);
              return (<li key={idx}>{p?.name || c.productId} x {c.quantity} <button className="btn btn-ghost" onClick={() => setCart(cart.filter(x => x.productId !== c.productId))}>Remove</button></li>);
            })}
          </ul>
        </div>
      </div>

      <ul className="list">
        {orders.map(o => (
          <li key={o.id} className="list-item">
            <div>
              <div style={{ fontWeight: 700 }}>Order #{o.id} <span className="meta"> - Table: {o.table?.name}</span></div>
              <div className="meta">Total: {o.total} • Status: {o.status}</div>
              <ul style={{ marginTop: 8 }}>
                {(o.items || []).map((it: any) => (
                  <li key={it.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div>{it.product?.name || 'unknown'} x {it.quantity}</div>
                    <div>
                      {isAdmin() && <button className="btn btn-ghost" onClick={() => removeItemFromOrder(o.id, it.id)}>Remove</button>}
                      <button className="btn btn-ghost" style={{ marginLeft: 8 }} onClick={async () => {
                        const v = prompt('New quantity', String(it.quantity));
                        if (v === null) return;
                        const q = Number(v);
                        if (!Number.isFinite(q) || q < 0) return alert('Invalid quantity');
                        try {
                          const res = await authFetch(`/orders/${o.id}/item/${it.id}`, { method: 'PATCH', body: JSON.stringify({ quantity: q }) });
                          if (!res.ok) throw new Error(await res.text());
                          fetchOrders();
                        } catch (err) { console.error(err); alert('Failed to update quantity'); }
                      }}>Edit</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              {(getRole() === 'waiter' || isAdmin()) && (
                <button className="btn btn-ghost" onClick={() => {
                  const next = o.status === 'NEW' ? 'PREPARING' : o.status === 'PREPARING' ? 'SERVING' : o.status;
                  if (next === o.status) return alert('No further status');
                  changeStatus(o.id, next);
                }}>Advance</button>
              )}
              {(getRole() === 'cashier' || isAdmin()) && o.status !== 'COMPLETED' && (
                <>
                  <button className="btn btn-primary" onClick={() => changeStatus(o.id, 'COMPLETED')}>Mark Completed</button>
                  <button style={{ marginLeft: 8 }} className="btn btn-success" onClick={async () => {
                    try {
                      const res = await authFetch(`/orders/${o.id}/pay`, { method: 'POST', body: JSON.stringify({}) });
                      if (!res.ok) throw new Error(await res.text());
                      fetchOrders();
                      alert('Payment recorded');
                    } catch (err) { console.error(err); alert('Payment failed'); }
                  }}>Pay</button>
                </>
              )}
              {(getRole() === 'waiter' || isAdmin()) && (
                <div style={{ marginTop: 8 }}>
                  <AddToOrderForm orderId={o.id} products={products} onAdd={addItemToOrder} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddToOrderForm({ orderId, products, onAdd }: any) {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="coffee">Coffee</option>
        <option value="tea">Tea</option>
        <option value="smoothie">Smoothie</option>
        <option value="soda">Soda</option>
        <option value="juice">Juice</option>
      </select>
      <select value={text} onChange={e => setText(e.target.value)}>
        <option value="">--select product--</option>
        {products.filter((p:any) => filter === 'all' ? true : p.type === filter).map((p: any) => <option key={p.id} value={`${p.id}:1`}>{p.name} ({p.type})</option>)}
      </select>
      <button style={{ marginLeft: 8 }} onClick={() => {
        if (!text) return alert('Select product');
        const [pid, qty] = text.split(':').map(x => Number(x));
        onAdd(orderId, pid, qty || 1);
        setText('');
      }}>Add</button>
    </div>
  );
}
