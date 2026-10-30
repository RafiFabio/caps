import { useState } from "react";
import { ArrowLeft, AlertTriangle, Save } from "lucide-react";

function AddIncident({ onCancel, onSubmit, targets = [] }) {
  const [form, setForm] = useState({
    title: "",
    target: "",
    severity: "Medium",
    category: "Network Performance",
    description: "",
    status: "Open",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      alert("Judul dan deskripsi insiden wajib diisi.");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="form-page">
      <button className="back-button" onClick={onCancel}>
        <ArrowLeft size={17} /> Back
      </button>

      <div className="form-page-heading">
        <div className="form-icon incident-form-icon">
          <AlertTriangle size={23} />
        </div>
        <div>
          <span className="page-eyebrow">INCIDENT MANAGEMENT</span>
          <h1>Create New Incident</h1>
          <p>Record and track a network security or performance incident.</p>
        </div>
      </div>

      <form className="data-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Incident Information</h3>
          <p>Provide details about the detected incident.</p>

          <div className="form-grid">
            <label className="form-field full-width">
              Incident Title *
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Unusual traffic spike detected" required />
            </label>

            <label className="form-field">
              Affected Target
              <select name="target" value={form.target} onChange={handleChange}>
                <option value="">Select a target</option>
                {targets.map((target, index) => (
                  <option key={target.id || index} value={target.name}>
                    {target.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              Severity
              <select name="severity" value={form.severity} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>

            <label className="form-field">
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                <option>Network Performance</option>
                <option>Security Threat</option>
                <option>Connectivity</option>
                <option>Hardware Failure</option>
                <option>Other</option>
              </select>
            </label>

            <label className="form-field">
              Initial Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Open</option>
                <option>Investigating</option>
                <option>Resolved</option>
              </select>
            </label>

            <label className="form-field full-width">
              Incident Description *
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe what happened, when it occurred, and its potential impact..." rows="5" required />
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            <Save size={17} /> Create Incident
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddIncident;
