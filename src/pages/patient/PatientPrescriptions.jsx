import { useState, useEffect } from "react";
import api from "../../services/api";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/prescriptions/my");
        console.log("Prescriptions response:", res.data);
        setPrescriptions(Array.isArray(res.data) ? res.data : res.data.prescriptions || res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading prescriptions...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Prescriptions</h1>
        </div>
      </div>

      {error && <div className="alert alert-error"> {error}</div>}

      {prescriptions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h3>No prescriptions yet</h3>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {prescriptions.map((rx, i) => (
            <div className="card" key={rx.id || rx._id || i}>
              <div className="card-header">
                <h3>Prescription #{rx.appointmentId || rx.id || i + 1}</h3>
                <span className="badge badge-primary">
                  {rx.createdAt ? new Date(rx.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>

              {rx.medicines && rx.medicines.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Dosage</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rx.medicines.map((med, j) => (
                          <tr key={j}>
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

              {rx.notes && (
                <div>
                  <span className="detail-label">Notes</span>
                  <p style={{ marginTop: 4 }}>{rx.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
