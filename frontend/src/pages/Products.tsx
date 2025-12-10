import React, { useEffect, useState } from "react";
import { getJson, authFetch, getToken, isAdmin } from "../api";
import { useNavigate } from "react-router-dom";

const pageWrap = {
  padding: "30px 20px",
  background: "#f5efe6",
  minHeight: "100vh",
  fontFamily: "Segoe UI, sans-serif",
};

const card = {
  background: "white",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  transition: "0.2s",
};

const cardHover = {
  transform: "scale(1.02)",
};

const btn = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};

const btnPrimary = { ...btn, background: "#8d6f53", color: "white" };
const btnDanger = { ...btn, background: "#c6554c", color: "white" };

const inputStyle = {
  padding: 8,
  borderRadius: 6,
  border: "1px solid #c7b39a",
  background: "#fffaf3",
};

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("coffee");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const data = await getJson("/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  }

  async function createProduct(e: any) {
    e.preventDefault();
    if (!getToken() || !isAdmin())
      return alert("Only admin can create products");

    try {
      const res = await authFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          price: Number(price),
          type,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      setName("");
      setPrice("");
      setType("coffee");
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }

  async function removeProduct(id: number) {
    if (!getToken() || !isAdmin())
      return alert("Only admin can delete products");

    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await authFetch(`/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={pageWrap}>
      <h2 style={{ textAlign: "center", color: "#4a3728", marginBottom: 20 }}>
        Products
      </h2>

      {/* CREATE PRODUCT FORM */}
      {isAdmin() && (
        <div
          style={{
            ...card,
            maxWidth: 700,
            margin: "0 auto 20px auto",
          }}
        >
          <form
            onSubmit={createProduct}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />

            <input
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ ...inputStyle, width: 100 }}
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ ...inputStyle, width: 120 }}
            >
              <option value="coffee">Coffee</option>
              <option value="tea">Tea</option>
              <option value="smoothie">Smoothie</option>
              <option value="soda">Soda</option>
              <option value="juice">Juice</option>
            </select>

            <button style={btnPrimary} type="submit">
              Create
            </button>
          </form>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={card}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, cardHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, { transform: "scale(1)" })
            }
          >
            <div style={{ cursor: "pointer" }}>
              <div
                style={{ fontWeight: 700, color: "#6b4f3a" }}
                onClick={() => navigate(`/products/${p.id}`)}
              >
                {p.name}
              </div>
              <div style={{ color: "#7a6a54", marginTop: 4 }}>
                ${p.price} • {p.type}
              </div>
            </div>

            {isAdmin() && (
              <button
                style={{ ...btnDanger, marginTop: 10 }}
                onClick={() => removeProduct(p.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
