import React, { useEffect, useState } from 'react';
import { getJson, authFetch, getToken, isAdmin } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('coffee');

  const navigate = useNavigate();
  useEffect(() => { fetchProducts(); }, []);
  async function fetchProducts() {
    try {
      const data = await getJson('/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  }

  async function createProduct(e: any) {
    e.preventDefault();
    if (!getToken() || !isAdmin()) return alert('Only admin can create products (login as admin)');
    try {
      const res = await authFetch('/products', { method: 'POST', body: JSON.stringify({ name, price: Number(price), type }) });
      if (!res.ok) throw new Error(await res.text());
      setName(''); setPrice(''); setType('coffee');
      fetchProducts();
    } catch (err) {
      console.error('Create product error', err);
    }
  }

  async function removeProduct(id: number) {
    if (!getToken() || !isAdmin()) return alert('Only admin can delete products');
    try {
      const res = await authFetch(`/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      fetchProducts();
    } catch (err) {
      console.error('Delete product error', err);
    }
  }

  return (
    <div className="container">
      <h2 className="page-title">Products</h2>
      <div className="top-actions">
        {isAdmin() && (
          <form onSubmit={createProduct} style={{ display: 'flex', gap: 8 }}>
            <input placeholder="name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="price" value={price} onChange={e => setPrice(e.target.value)} style={{ width: 120 }} />
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="coffee">Coffee</option>
              <option value="tea">Tea</option>
              <option value="smoothie">Smoothie</option>
              <option value="soda">Soda</option>
              <option value="juice">Juice</option>
            </select>
            <button className="btn btn-primary" type="submit">Create</button>
          </form>
        )}
      </div>

      <div className="grid">
        {products.map(p => (
          <div key={p.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate(`/products/${p.id}`)}>{p.name}</div>
                <div className="meta">${p.price} • {p.type ? (p.type.charAt(0).toUpperCase()+p.type.slice(1)) : ''}</div>
              </div>
              <div>
                {isAdmin() && <button className="btn btn-danger" onClick={() => removeProduct(p.id)}>Delete</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
