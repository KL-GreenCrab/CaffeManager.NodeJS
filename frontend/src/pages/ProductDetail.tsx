import React, { useEffect, useState } from "react";
import { getJson, authFetch, isAdmin } from "../api";
import { useParams, useNavigate } from "react-router-dom";

const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  maxWidth: 600,
  margin: "0 auto",
};

const label = { fontSize: 14, fontWeight: 600, color: "#6b4f3a" };
const input = {
  padding: 10,
  width: "100%",
  borderRadius: 6,
  border: "1px solid #c7b39a",
  background: "#fffaf3",
};

const btn = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};
const btnPrimary = { ...btn, background: "#8d6f53", color: "white" };
const btnGhost = { ...btn, background: "#eee4d8", color: "#5a4636" };

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      const data = await getJson(`/products/${id}`);
      setProduct(data);
      setForm({
        name: data.name,
        price: data.price,
        description: data.description || "",
        image: data.image || "",
        isAvailable: data.isAvailable,
        type: data.type || "coffee",
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (!product)
    return (
      <div style={{ padding: 20, color: "#7a6a54" }}>
        Product not found or loading...
      </div>
    );

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "#f5efe6",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#4a3728", marginBottom: 20 }}>
        Product Detail
      </h2>

      <div style={cardStyle}>
        {/* ----- VIEW MODE ----- */}
        {!editing && (
          <>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#6b4f3a" }}>
              {product.name}
            </div>

            <div style={{ marginTop: 6, color: "#826b55" }}>
              Price: ${product.price} • Type: {product.type}
            </div>

            {product.image && (
              <img
                src={product.image}
                alt="product"
                style={{
                  width: "100%",
                  borderRadius: 10,
                  marginTop: 12,
                  objectFit: "cover",
                }}
              />
            )}

            <div style={{ marginTop: 12, color: "#5f4a3c" }}>
              <b>Description:</b> {product.description || "-"}
            </div>

            <div style={{ marginTop: 6, color: "#7a6a54" }}>
              Created At: {product.createdAt || "n/a"}
            </div>

            {isAdmin() && (
              <button
                style={{ ...btnPrimary, marginTop: 20 }}
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </>
        )}

        {/* ----- EDIT MODE ----- */}
        {editing && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const body = {
                  name: form.name,
                  price: Number(form.price),
                  description: form.description,
                  image: form.image,
                  isAvailable: !!form.isAvailable,
                  type: form.type,
                };

                const res = await authFetch(`/products/${id}`, {
                  method: "PUT",
                  body: JSON.stringify(body),
                });

                if (!res.ok) throw new Error(await res.text());
                setEditing(false);
                fetchProduct();
                alert("Product updated");
              } catch {
                alert("Failed to update");
              }
            }}
          >
            {/* NAME */}
            <div style={{ marginBottom: 12 }}>
              <div style={label}>Name</div>
              <input
                style={input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* PRICE */}
            <div style={{ marginBottom: 12 }}>
              <div style={label}>Price</div>
              <input
                style={input}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            {/* TYPE */}
            <div style={{ marginBottom: 12 }}>
              <div style={label}>Type</div>
              <select
                style={{ ...input, padding: 10 }}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="coffee">Coffee</option>
                <option value="tea">Tea</option>
                <option value="smoothie">Smoothie</option>
                <option value="soda">Soda</option>
                <option value="juice">Juice</option>
              </select>
            </div>

            {/* IMAGE */}
            <div style={{ marginBottom: 12 }}>
              <div style={label}>Image URL</div>
              <input
                style={input}
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>

            {/* AVAILABLE */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 12,
                color: "#6b4f3a",
              }}
            >
              <input
                type="checkbox"
                checked={!!form.isAvailable}
                onChange={(e) =>
                  setForm({ ...form, isAvailable: e.target.checked })
                }
              />
              Available
            </label>

            {/* DESCRIPTION */}
            <div style={{ marginBottom: 12 }}>
              <div style={label}>Description</div>
              <textarea
                style={{ ...input, height: 90 }}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <button style={btnPrimary} type="submit">
                Save
              </button>

              <button
                style={{ ...btnGhost, marginLeft: 10 }}
                type="button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
