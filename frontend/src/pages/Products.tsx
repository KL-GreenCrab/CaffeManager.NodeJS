import React, { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => { fetchProducts(); }, []);
  async function fetchProducts() {
    try {
      const res = await fetch('http://localhost:3000/products');
      if (!res.ok) {
        console.error('Failed to load products', res.statusText);
        return;
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>
      <ul>
        {products.map(p => <li key={p.id}>{p.name} - ${p.price}</li>)}
      </ul>
    </div>
  );
}
