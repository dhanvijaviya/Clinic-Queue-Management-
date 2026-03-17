import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const DoctorQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get("/doctor/queue");
      console.log("Doctor queue response:", res.data);
      const data = res.data;
      setQueue(Array.isArray(data) ? data : (data.queue || data.data || []));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const statusConfig = {
    waiting: { label: "Waiting", badge: "badge-warning" },
    in_progress: { label: "In Progress", badge: "badge-info"},
    "in-progress": { label: "In Progress", badge: "badge-info"},
    done: { label: "Done", badge: "badge-success" },
    skipped: { label: "Skipped", badge: "badge-gray" },
  };

  const getStatusDisplay = (status) => {
    const s = status?.toLowerCase();
    const cfg = statusConfig[s] || { label: status, badge: "badge-gray", icon: null };
    return (
      <span className={`badge ${cfg.badge}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  const getPatientName = (entry) => {
    return entry.patientName
      || entry.patient?.name
      || entry.appointment?.patient?.name
      || `Patient #${entry.patientId || entry.appointment?.patientId || "—"}`;
  };

  const getAppointmentId = (entry) => {
    return entry.appointmentId || entry.appointment_id || entry.appointment?.id || entry.id;
  };

  const getTimeSlot = (entry) => {
    return entry.timeSlot || entry.appointment?.timeSlot || "";
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading queue...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Queue — Today</h1>
          <p>{queue.length} patient(s) in queue</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchQueue} title="Refresh">
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error"> {error}</div>}

      {queue.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No patients today</h3>
            <p>Your queue is empty for today.</p>
          </div>
        </div>
      ) : (
        <div className="queue-list">
          {queue.map((entry, idx) => {
            const aptId = getAppointmentId(entry);
            const s = entry.status?.toLowerCase();
            const isActive = s === "in_progress" || s === "in-progress";
            return (
              <div
                className={`queue-card ${isActive ? "queue-card-active" : ""} ${s === "done" ? "queue-card-done" : ""} ${s === "skipped" ? "queue-card-skipped" : ""}`}
                key={entry.id || entry._id || idx}
              >
                <div className="queue-card-token">
                  <span className="token-number">#{entry.tokenNumber ?? idx + 1}</span>
                </div>
                <div className="queue-card-info">
                  <div className="queue-patient-name">
                   {getPatientName(entry)}
                  </div>
                  <div className="queue-meta">
                    
                    {getStatusDisplay(entry.status)}
                  </div>
                </div>
                <div className="queue-card-actions">
                  <div className="queue-actions">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/doctor/prescriptions/${aptId}`)}
                      disabled={!aptId}
                    >
                      Medicines
                    </button>
                    <button
                      className="btn btn-sm btn-accent"
                      onClick={() => navigate(`/doctor/reports/${aptId}`)}
                      disabled={!aptId}
                    >
                       Report
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorQueue;
