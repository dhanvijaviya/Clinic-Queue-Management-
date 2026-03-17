import { useState, useEffect } from "react";
import api from "../../services/api";


const ReceptionistQueue = () => {
  const [queue, setQueue] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchQueue = async (d) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/queue?date=${d}`);
      console.log("Queue API response:", res.data);
      const data = res.data;
      
      const list = Array.isArray(data) ? data : (data.queue || data.data || []);
      setQueue(list);
    } catch (err) {
      console.error("Queue fetch error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to load queue");
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(date); }, [date]);

  const updateStatus = async (queueId, newStatus) => {
    setUpdating(queueId);
    try {
      await api.patch(`/queue/${queueId}`, { status: newStatus });
      await fetchQueue(date);
    } catch (err) {
      console.error("Status update error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const statusConfig = {
    waiting: { label: "Waiting", badge: "badge-warning" },
    in_progress: { label: "In Progress", badge: "badge-info" },
    "in-progress": { label: "In Progress", badge: "badge-info" },
    done: { label: "Done", badge: "badge-success" },
    skipped: { label: "Skipped", badge: "badge-gray"},
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

  const getTimeSlot = (entry) => {
    return entry.timeSlot
      || entry.appointment?.timeSlot
      || "—";
  };

  const getActions = (entry) => {
    const s = entry.status?.toLowerCase();
    const id = entry.id || entry._id;
    const isLoading = updating === id;

    if (s === "waiting") {
      return (
        <div className="queue-actions">
          <button
            className="btn btn-sm btn-primary"
            disabled={isLoading}
            onClick={() => updateStatus(id, "in-progress")}
          >
            {isLoading ? "..." : "Start"}
          </button>
          <button
            className="btn btn-sm btn-secondary"
            disabled={isLoading}
            onClick={() => updateStatus(id, "skipped")}
          >
            Skip
          </button>
        </div>
      );
    }
    if (s === "in_progress" || s === "in-progress") {
      return (
        <div className="queue-actions">
          <button
            className="btn btn-sm btn-success"
            disabled={isLoading}
            onClick={() => updateStatus(id, "done")}
          >
            {isLoading ? "..." : "Mark Done"}
          </button>
        </div>
      );
    }
    return <span style={{ color: "var(--gray-400)", fontSize: "0.82rem" }}>Completed</span>;
  };

  const counts = {
    total: queue.length,
    waiting: queue.filter((e) => e.status?.toLowerCase() === "waiting").length,
    inProgress: queue.filter((e) => ["in_progress", "in-progress"].includes(e.status?.toLowerCase())).length,
    done: queue.filter((e) => e.status?.toLowerCase() === "done").length,
    skipped: queue.filter((e) => e.status?.toLowerCase() === "skipped").length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Daily Queue</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: 180 }}
          />
          <button className="btn btn-secondary btn-sm" onClick={() => fetchQueue(date)} title="Refresh">
            Refresh
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          
          <div className="stat-value">{counts.total}</div>
          <div className="stat-label">Total Person</div>
        </div>
        <div className="stat-card">
          
          <div className="stat-value">{counts.waiting}</div>
          <div className="stat-label">Waiting</div>
        </div>
        <div className="stat-card">
          
          <div className="stat-value">{counts.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
         
          <div className="stat-value">{counts.done}</div>
          <div className="stat-label">Done</div>
        </div>
      </div>

      {error && <div className="alert alert-error"> {error}</div>}

      {loading ? (
        <div className="loading-screen" style={{ height: 300 }}><div className="spinner"></div></div>
      ) : queue.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No queue entries</h3>
            <p>No patients in the queue for {new Date(date + "T00:00:00").toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <div className="queue-list">
          {queue.map((entry, idx) => {
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
                    <span> {getTimeSlot(entry)}</span>
                    {getStatusDisplay(entry.status)}
                  </div>
                </div>
                <div className="queue-card-actions">
                  {getActions(entry)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReceptionistQueue;
