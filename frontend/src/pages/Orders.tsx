import React, { useEffect, useState } from "react";
import { getJson, authFetch, getRole, isAdmin } from "../api";

const coffeeCard = {
  background: "white",
  padding: 18,
  borderRadius: 12,
  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  marginBottom: 14,
};
const btn = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};
const btnPrimary = { ...btn, background: "#8d6f53", color: "white" };
const btnGhost = {
  ...btn,
  background: "#eee4d8",
  color: "#5a4636",
};
const label = { fontSize: 13, color: "#6b4f3a", marginBottom: 4 };

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [tableId, setTableId] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
    fetchTables();
    fetchProducts();
  }, []);

  async function fetchOrders() {
    const data = await getJson("/orders");
    setOrders(Array.isArray(data) ? data : []);
  }

  async function fetchTables() {
    const data = await getJson("/tables");
    setTables(Array.isArray(data) ? data : []);
  }

  async function fetchProducts() {
    const data = await getJson("/products");
    setProducts(Array.isArray(data) ? data : []);
  }

  function addToCart() {
    if (!selectedProduct) return alert("Select product");
    const pid = Number(selectedProduct);
    const q = Number(quantity) || 1;

    const exists = cart.find((c) => c.productId === pid);
    if (exists) {
      setCart(
        cart.map((c) =>
          c.productId === pid ? { ...c, quantity: c.quantity + q } : c
        )
      );
    } else {
      setCart([...cart, { productId: pid, quantity: q }]);
    }
  }

  async function createOrder(e: any) {
    e.preventDefault();
    if (!tableId) return alert("Select table");
    if (!cart.length) return alert("Cart empty");

    const res = await authFetch("/orders", {
      method: "POST",
      body: JSON.stringify({ tableId: Number(tableId), items: cart }),
    });

    if (!res.ok) return alert("Failed to create order");
    setCart([]);
    setTableId("");
    fetchOrders();
  }

  async function changeStatus(orderId: number, next: string) {
    const res = await authFetch(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });

    if (!res.ok) return alert("Failed to change status");
    fetchOrders();
  }

  return (
    <div
      style={{
        padding: "30px 20px",
        background: "#f5efe6",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#4a3728", marginBottom: 20 }}>
        Orders
      </h2>

      {/* --- CREATE ORDER FORM --- */}
      <div style={coffeeCard}>
        <form
          onSubmit={createOrder}
          style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
        >
          <div>
            <div style={label}>Table</div>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              style={{ padding: 6 }}
            >
              <option value="">--table--</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div style={label}>Category</div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: 6 }}
            >
              <option value="all">All</option>
              <option value="coffee">Coffee</option>
              <option value="tea">Tea</option>
              <option value="smoothie">Smoothie</option>
              <option value="soda">Soda</option>
              <option value="juice">Juice</option>
            </select>
          </div>

          <div>
            <div style={label}>Product</div>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={{ padding: 6 }}
            >
              <option value="">--product--</option>
              {products
                .filter((p) =>
                  category === "all" ? true : p.type === category
                )
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <div style={label}>Qty</div>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ padding: 6, width: 60 }}
            />
          </div>

          <button
            type="button"
            onClick={addToCart}
            style={btnGhost}
          >
            Add
          </button>

          <button type="submit" style={btnPrimary}>
            Create Order
          </button>
        </form>

        {/* --- CART --- */}
        <div style={{ marginTop: 14 }}>
          <div style={label}>Cart:</div>
          <ul>
            {cart.map((c, i) => {
              const p = products.find((pp) => pp.id === c.productId);
              return (
                <li key={i}>
                  {p?.name} x {c.quantity}
                  <button
                    style={{ ...btnGhost, marginLeft: 8 }}
                    onClick={() =>
                      setCart(cart.filter((x) => x.productId !== c.productId))
                    }
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* --- ORDER LIST --- */}
      {orders.map((o) => (
        <div key={o.id} style={coffeeCard}>
          <div style={{ fontWeight: "bold", color: "#6b4f3a" }}>
            Order #{o.id} • Table: {o.table?.name}
          </div>
          <div style={{ color: "#846b57", marginBottom: 8 }}>
            Total: {o.total} • Status: {o.status}
          </div>

          <ul style={{ marginTop: 4 }}>
            {o.items?.map((it: any) => (
              <li key={it.id}>
                {it.product?.name} x {it.quantity}
              </li>
            ))}
          </ul>

          {/* STATUS BUTTONS */}
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            {(getRole() === "waiter" || isAdmin()) && o.status !== "COMPLETED" && (
              <button
                style={btnGhost}
                onClick={() => {
                  const next =
                    o.status === "NEW"
                      ? "PREPARING"
                      : o.status === "PREPARING"
                      ? "SERVING"
                      : o.status;
                  if (next === o.status) return alert("No further status");
                  changeStatus(o.id, next);
                }}
              >
                Advance
              </button>
            )}

            {(getRole() === "cashier" || isAdmin()) &&
              o.status !== "COMPLETED" && (
                <button
                  style={btnPrimary}
                  onClick={() => changeStatus(o.id, "COMPLETED")}
                >
                  Mark Completed
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
