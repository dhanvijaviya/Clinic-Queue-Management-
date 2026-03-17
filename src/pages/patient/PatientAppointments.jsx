import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/appointments/my");
        setAppointments(Array.isArray(res.data) ? res.data : res.data.appointments || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statusBadge = (status) => {
    const map = { queued: "badge-info", waiting: "badge-warning", in_progress: "badge-primary", done: "badge-success", skipped: "badge-gray" };
    return <span className={`badge ${map[status?.toLowerCase()] || "badge-gray"}`}>{status}</span>;
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading appointments...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Appointments</h1>
          <p>{appointments.length} appointment(s)</p>
        </div>
        <Link to="/appointments/book" className="btn btn-primary">
         + Book Appointment
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {appointments.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No appointments yet</h3>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Token</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id || apt._id}>
                  <td style={{ fontWeight: 500 }}>{apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "—"}</td>
                  <td>{apt.timeSlot || "—"}</td>
                  <td>{apt.queueEntry?.tokenNumber ?? "—"}</td>
                  <td>{statusBadge(apt.status)}</td>
                  <td>
                    <Link to={`/appointments/${apt.id || apt._id}`} className="btn btn-sm btn-secondary">
                       View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
