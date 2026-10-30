import { useState } from "react";
import { ArrowLeft, Network, Save } from "lucide-react";

function AddTarget({ onCancel, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    ipAddress: "",
    type: "Server",
    location: "",
    description: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.ipAddress.trim()) {
      alert("Nama target dan IP Address wajib diisi.");
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
        <div className="form-icon">
          <Network size={23} />
        </div>
        <div>
          <span className="page-eyebrow">NETWORK MANAGEMENT</span>
          <h1>Add Network Target</h1>
          <p>Register a new device or network endpoint for monitoring.</p>
        </div>
      </div>

      <form className="data-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Target Information</h3>
          <p>Enter the basic information of the network target.</p>

          <div className="form-grid">
            <label className="form-field">
              Target Name *
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Main Production Server" required />
            </label>

            <label className="form-field">
              IP Address *
              <input name="ipAddress" value={form.ipAddress} onChange={handleChange} placeholder="e.g. 192.168.1.10" required />
            </label>

            <label className="form-field">
              Target Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option>Server</option>
                <option>Router</option>
                <option>Switch</option>
                <option>Firewall</option>
                <option>Workstation</option>
                <option>Other</option>
              </select>
            </label>

            <label className="form-field">
              Location
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Data Center 01" />
            </label>

            <label className="form-field full-width">
              Description
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe this network target..." rows="4" />
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            <Save size={17} /> Save Target
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTarget;
