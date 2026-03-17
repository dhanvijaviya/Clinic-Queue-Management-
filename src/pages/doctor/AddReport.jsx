import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const AddReport = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState("");
  const [testRecommended, setTestRecommended] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!diagnosis.trim()) {
      setError("Diagnosis is required");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/reports/${appointmentId}`, {
        diagnosis: diagnosis.trim(),
        testRecommended: testRecommended.trim(),
        remarks: remarks.trim(),
      });
      setSuccess("Report added successfully!");
      setTimeout(() => navigate("/doctor/queue"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Add Report</h1>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/doctor/queue")}>
           Back
        </button>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {error && <div className="alert alert-error"> {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Diagnosis *</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Viral Fever"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Test Recommended</label>
            <input
              className="form-input"
              placeholder="e.g. Blood Test"
              value={testRecommended}
              onChange={(e) => setTestRecommended(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Remarks</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Rest for 3 days"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Saving..." : "Save Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReport;
