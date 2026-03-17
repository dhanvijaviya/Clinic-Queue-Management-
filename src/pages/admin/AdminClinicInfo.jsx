import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminClinicInfo = () => {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const res = await api.get("/admin/clinic");
        setClinic(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load clinic info");
      } finally {
        setLoading(false);
      }
    };
    fetchClinic();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading clinic info...</p></div>;
  if (error) return <div className="alert alert-error"> {error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Clinic Information</h1>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          
          <div className="stat-value">{clinic?.userCount ?? 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          
          <div className="stat-value">{clinic?.appointmentCount ?? 0}</div>
          <div className="stat-label">Appointments</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Clinic Details</h3>
          <span className="badge badge-primary">{clinic?.code}</span>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Clinic Name</span>
            <span className="detail-value">{clinic?.name || "—"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Clinic Code</span>
            <span className="detail-value">{clinic?.code || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClinicInfo;
