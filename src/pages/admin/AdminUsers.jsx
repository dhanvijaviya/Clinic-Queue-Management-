import { useState, useEffect } from "react";
import api from "../../services/api";


const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "patient" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name || !formData.email || !formData.password) {
      setFormError("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/admin/users", formData);
      setShowModal(false);
      setFormData({ name: "", email: "", password: "", role: "patient" });
      await fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const roleBadge = (role) => {
    const map = { admin: "badge-primary", doctor: "badge-info", receptionist: "badge-warning", patient: "badge-success" };
    return <span className={`badge ${map[role?.toLowerCase()] || "badge-gray"}`}>{role}</span>;
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading users...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>User Management</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create User
        </button>
      </div>

      {error && <div className="alert alert-error"> {error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: "center", padding: 32 }}>No users found</td></tr>
            ) : users.map((u) => (
              <tr key={u.id || u._id}>
                <td style={{ fontWeight: 500, color: "var(--text-heading)" }}>{u.name}</td>
                <td>{u.email}</td>
                <td>{roleBadge(u.role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New User</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>Close</button>
            </div>

            {formError && <div className="alert alert-error"> {formError}</div>}

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" placeholder="Full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="user@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
