import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";


const AppointmentDetail = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/appointments/${id}`);
        console.log("Appointment detail:", res.data);
        setAppointment(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const statusBadge = (status) => {
    const map = { queued: "badge-info", waiting: "badge-warning", in_progress: "badge-primary", "in-progress": "badge-primary", done: "badge-success", skipped: "badge-gray" };
    return <span className={`badge ${map[status?.toLowerCase()] || "badge-gray"}`}>{status}</span>;
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div>;
  if (error) return <div className="alert alert-error"> {error}</div>;

  const apt = appointment;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Appointment Details</h1>
          <p>Appointment #{apt?.id || apt?._id || id}</p>
        </div>
        <Link to="/appointments" className="btn btn-secondary"> Back</Link>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3>Appointment Info</h3>
          {statusBadge(apt?.status)}
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Date</span>
            <span className="detail-value">{apt?.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "—"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Time Slot</span>
            <span className="detail-value">{apt?.timeSlot || "—"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Queue Token</span>
            <span className="detail-value">{apt?.queueEntry?.tokenNumber ?? "—"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className="detail-value" style={{ textTransform: "capitalize" }}>{apt?.status || "—"}</span>
          </div>
        </div>
      </div>

      {/* Prescription */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3> Prescription</h3>
        </div>
        {apt?.prescription ? (
          <div>
            {apt.prescription.medicines && apt.prescription.medicines.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <span className="detail-label">Medicines</span>
                <div className="table-wrap" style={{ marginTop: 8 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apt.prescription.medicines.map((med, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 500 }}>{typeof med === "string" ? med : med.name}</td>
                          <td>{typeof med === "string" ? "—" : (med.dosage || "—")}</td>
                          <td>{typeof med === "string" ? "—" : (med.duration || "—")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {apt.prescription.notes && (
              <div style={{ marginTop: 12 }}>
                <span className="detail-label">Notes</span>
                <p style={{ marginTop: 4 }}>{apt.prescription.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: 24 }}>
            <p>No prescription added yet</p>
          </div>
        )}
      </div>

    
      <div className="card">
        <div className="card-header">
          <h3> Report</h3>
        </div>
        {apt?.report ? (
          <div className="detail-grid">
            {apt.report.diagnosis && (
              <div className="detail-item">
                <span className="detail-label">Diagnosis</span>
                <span className="detail-value">{apt.report.diagnosis}</span>
              </div>
            )}
            {apt.report.testRecommended && (
              <div className="detail-item">
                <span className="detail-label">Test Recommended</span>
                <span className="detail-value">{apt.report.testRecommended}</span>
              </div>
            )}
            {apt.report.remarks && (
              <div className="detail-item">
                <span className="detail-label">Remarks</span>
                <span className="detail-value">{apt.report.remarks}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: 24 }}>
            <p>No report added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetail;
