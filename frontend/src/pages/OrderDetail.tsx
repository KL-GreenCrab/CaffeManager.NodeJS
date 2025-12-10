import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJson, authFetch } from "../api";

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllProducts(), fetchOrderDetail()]).then(() =>
      setIsLoading(false)
    );
  }, [id]);

  async function fetchOrderDetail() {
    if (!id) return;
    try {
      const order = await getJson(`/orders/${id}`);
      if (order?.items) {
        const orderItems = order.items.map((item: any) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        }));
        setItems(orderItems);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  }

  async function fetchAllProducts() {
    try {
      const products = await getJson("/products");
      setAllProducts(products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }

  const handleQuantityChange = (productId: number, qty: number) => {
    setItems((list) =>
      list.map((item) =>
        item.productId === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleAddProduct = (productId: number) => {
    const product = allProducts.find((p) => p.id === productId);
    if (product && !items.some((i) => i.productId === productId)) {
      setItems([
        ...items,
        { id: -1, productId: product.id, name: product.name, quantity: 1, price: product.price },
      ]);
    }
  };

  const handleRemoveItem = (productId: number) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  async function handleSaveChanges() {
    if (!id) return;

    const payload = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    try {
      const res = await authFetch(`/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Order updated successfully");
      navigate(-1);
    } catch (error) {
      console.error("Failed to update:", error);
      alert("Failed to update order.");
    }
  }

  if (isLoading) return <div>Loading...</div>;

  // ==================== INLINE STYLE ======================
  const card: React.CSSProperties = {
    background: "#f7f1e8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
  };

  const qtyInput: React.CSSProperties = {
    width: 60,
    padding: 6,
    borderRadius: 6,
    border: "1px solid #b39b82",
    marginRight: 10,
  };

  const removeBtn: React.CSSProperties = {
    background: "#d9534f",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  };

  const saveBtn: React.CSSProperties = {
    background: "#6b4f3a",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: 8,
    marginRight: 10,
    cursor: "pointer",
  };

  const cancelBtn: React.CSSProperties = {
    background: "#c7b199",
    color: "#3b2a1e",
    padding: "10px 18px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 20, fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ marginBottom: 20 }}>Edit Order #{id}</h2>

      {/* Order Items */}
      {items.map((item) => (
        <div key={item.productId} style={card}>
          <div>
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            <div style={{ fontSize: 13, color: "#5a4634" }}>
              Price: ${item.price}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="number"
              min={0}
              value={item.quantity}
              onChange={(e) =>
                handleQuantityChange(item.productId, parseInt(e.target.value))
              }
              style={qtyInput}
            />
            <button style={removeBtn} onClick={() => handleRemoveItem(item.productId)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Add Product */}
      <div style={{ marginTop: 25 }}>
        <select
          onChange={(e) => handleAddProduct(parseInt(e.target.value))}
          value=""
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #b39b82",
            background: "#fffdf9",
          }}
        >
          <option value="" disabled>
            ➕ Add a product...
          </option>
          {allProducts
            .filter((p) => !items.some((i) => i.productId === p.id))
            .map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name} – ${prod.price}
              </option>
            ))}
        </select>
      </div>

      {/* Save / Cancel */}
      <div style={{ marginTop: 30 }}>
        <button style={saveBtn} onClick={handleSaveChanges}>
          Save Changes
        </button>
        <button style={cancelBtn} onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
