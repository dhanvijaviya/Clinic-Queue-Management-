import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const BookAppointment = () => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!date || !timeSlot) {
      setError("Please select both date and time slot");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/appointments", { appointmentDate: date, timeSlot });
      setSuccess("Appointment booked successfully!");
      setTimeout(() => navigate("/appointments"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Book Appointment</h1>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        {error && <div className="alert alert-error"> {error}</div>}
        {success && <div className="alert alert-success"> {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Time Slot</label>
            <select className="form-select" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
              <option value="">Select a time slot</option>
              <option value="09:00-09:15">09:00 – 09:15</option>
              <option value="09:15-09:30">09:15 – 09:30</option>
              <option value="09:30-09:45">09:30 – 09:45</option>
              <option value="09:45-10:00">09:45 – 10:00</option>
              <option value="10:00-10:15">10:00 – 10:15</option>
              <option value="10:15-10:30">10:15 – 10:30</option>
              <option value="10:30-10:45">10:30 – 10:45</option>
              <option value="10:45-11:00">10:45 – 11:00</option>
              <option value="11:00-11:15">11:00 – 11:15</option>
              <option value="11:15-11:30">11:15 – 11:30</option>
              <option value="11:30-11:45">11:30 – 11:45</option>
              <option value="11:45-12:00">11:45 – 12:00</option>
              <option value="12:00-12:15">12:00 – 12:15</option>
              <option value="12:15-12:30">12:15 – 12:30</option>
              <option value="14:00-14:15">14:00 – 14:15</option>
              <option value="14:15-14:30">14:15 – 14:30</option>
              <option value="14:30-14:45">14:30 – 14:45</option>
              <option value="14:45-15:00">14:45 – 15:00</option>
              <option value="15:00-15:15">15:00 – 15:15</option>
              <option value="15:15-15:30">15:15 – 15:30</option>
              <option value="15:30-15:45">15:30 – 15:45</option>
              <option value="15:45-16:00">15:45 – 16:00</option>
              <option value="16:00-16:15">16:00 – 16:15</option>
              <option value="16:15-16:30">16:15 – 16:30</option>
              <option value="16:30-16:45">16:30 – 16:45</option>
              <option value="16:45-17:00">16:45 – 17:00</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
