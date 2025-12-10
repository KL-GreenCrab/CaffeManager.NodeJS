import React, { useEffect, useState } from 'react';
import { getJson, authFetch, isAdmin } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetail(){
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => { if (id) fetchProduct(); }, [id]);
  async function fetchProduct(){
    try{
      const data = await getJson(`/products/${id}`);
      setProduct(data);
      setForm({ name: data.name, price: data.price, description: data.description || '', image: data.image || '', isAvailable: data.isAvailable, type: data.type || 'coffee' });
    }catch(err){ console.error(err); }
  }

  if (!product) return (<div className="container"><div className="muted">Product not found or loading...</div></div>);

  return (
    <div className="container">
      <h2 className="page-title">Product Detail</h2>
      <div className="card">
        {!editing && (
          <>
            <div style={{ fontWeight: 700 }}>{product.name}</div>
            <div className="meta">Price: ${product.price} • Type: {product.type}</div>
            <div style={{ marginTop: 8 }}>Created At: {product.createdAt || 'n/a'}</div>
            <div style={{ marginTop: 8 }}>Description: {product.description || '-'}</div>
            {isAdmin() && <div style={{ marginTop: 12 }}><button className="btn btn-primary" onClick={() => setEditing(true)}>Edit</button></div>}
          </>
        )}

        {editing && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              const body = { name: form.name, price: Number(form.price), description: form.description, image: form.image, isAvailable: !!form.isAvailable, type: form.type };
              const res = await authFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
              if (!res.ok) throw new Error(await res.text());
              setEditing(false);
              fetchProduct();
              alert('Product updated');
            } catch (err) { console.error(err); alert('Failed to update'); }
          }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={{ width: 120 }} />
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="coffee">Coffee</option>
                <option value="tea">Tea</option>
                <option value="smoothie">Smoothie</option>
                <option value="soda">Soda</option>
                <option value="juice">Juice</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={!!form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} /> Available</label>
              <div style={{ width: '100%' }}>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" type="submit">Save</button>
              <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
