import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch, getJson } from "../api";

interface UserApiResponse {
  username: string;
  fullName: string;
  role: { id: number; name: string };
}

interface User {
  username: string;
  fullName: string;
  roleId: number;
}

interface Role {
  id: number;
  name: string;
}

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    username: "",
    fullName: "",
    roleId: 0,
  });

  const [roles] = useState<Role[]>([
    { id: 1, name: "admin" },
    { id: 2, name: "waiter" },
    { id: 3, name: "cashier" },
  ]);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  async function fetchUser() {
    try {
      const data: UserApiResponse = await getJson(`/users/${id}`);

      setUser({
        username: data.username,
        fullName: data.fullName,
        roleId: data.role?.id ?? 0,
      });

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      alert("User not found");
      navigate("/users");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: name === "roleId" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: any = {
      username: user.username,
      fullName: user.fullName,
      roleId: user.roleId,
    };

    if (password.trim() !== "") {
      payload.password = password.trim();
    }

    try {
      const res = await authFetch(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      alert("User updated successfully!");
      navigate(`/users/list`);
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user.");
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading user...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h2>Edit User: {user.username}</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Password (leave blank to keep current)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Role</label>
          <select
            name="roleId"
            value={user.roleId}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
            required
          >
            <option value="" disabled>
              Select role...
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" style={{ padding: "10px 15px" }} >
          Save Changes
        </button>
      </form>
    </div>
  );
}
