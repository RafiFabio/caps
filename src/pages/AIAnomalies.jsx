import { useState, useEffect } from "react";
import { BrainCircuit, Search, Activity, AlertTriangle, ShieldCheck, Clock, ArrowUpRight, Zap, X, Pencil, Trash2 } from "lucide-react";

const initialAnomalies = [
  {
    id: "ANM-2048",
    title: "Unusual Response Time",
    target: "api.moneta.local",
    description: "Response time increased significantly above the normal baseline.",
    severity: "High",
    confidence: 98.4,
    time: "2 minutes ago",
    value: "485 ms",
    category: "Latency",
  },
  {
    id: "ANM-2047",
    title: "Abnormal Traffic Pattern",
    target: "192.168.1.20",
    description: "Unusual traffic volume detected during a low-activity period.",
    severity: "Medium",
    confidence: 94.2,
    time: "12 minutes ago",
    value: "+68%",
    category: "Traffic",
  },
  {
    id: "ANM-2046",
    title: "Packet Loss Detected",
    target: "192.168.1.50",
    description: "Packet loss exceeded the configured network threshold.",
    severity: "High",
    confidence: 97.1,
    time: "25 minutes ago",
    value: "18.5%",
    category: "Connectivity",
  },
  {
    id: "ANM-2045",
    title: "Minor Latency Variation",
    target: "dns.moneta.local",
    description: "Small latency variation detected compared to historical behavior.",
    severity: "Low",
    confidence: 88.7,
    time: "43 minutes ago",
    value: "+12 ms",
    category: "Latency",
  },
  {
    id: "ANM-2044",
    title: "Connection Instability",
    target: "auth.moneta.local",
    description: "Intermittent connection failures detected across recent probes.",
    severity: "Medium",
    confidence: 92.6,
    time: "1 hour ago",
    value: "7 failures",
    category: "Connectivity",
  },
];

function AIAnomalies() {
  const [anomalies, setAnomalies] = useState(initialAnomalies);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const filteredAnomalies = anomalies.filter((anomaly) => {
    const searchText = search.toLowerCase();

    const matchesSearch = anomaly.title.toLowerCase().includes(searchText) || anomaly.target.toLowerCase().includes(searchText) || anomaly.id.toLowerCase().includes(searchText);

    const matchesSeverity = severityFilter === "All" || anomaly.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const highCount = anomalies.filter((item) => item.severity === "High").length;

  const mediumCount = anomalies.filter((item) => item.severity === "Medium").length;

  const averageConfidence = anomalies.length > 0 ? (anomalies.reduce((total, item) => total + item.confidence, 0) / anomalies.length).toFixed(1) : "0.0";

  const openDetail = (anomaly) => {
    setSelectedAnomaly(anomaly);
    setIsEditing(false);
  };

  const closeDetail = () => {
    setSelectedAnomaly(null);
    setIsEditing(false);
    setEditForm({});
  };

  const startEdit = () => {
    setEditForm({
      title: selectedAnomaly.title,
      target: selectedAnomaly.target,
      description: selectedAnomaly.description,
      severity: selectedAnomaly.severity,
      confidence: selectedAnomaly.confidence,
      value: selectedAnomaly.value,
      category: selectedAnomaly.category,
    });

    setIsEditing(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveEdit = (event) => {
    event.preventDefault();

    if (!editForm.title.trim() || !editForm.target.trim()) {
      window.alert("Title dan target tidak boleh kosong.");
      return;
    }

    const updatedAnomaly = {
      ...selectedAnomaly,
      ...editForm,
      title: editForm.title.trim(),
      target: editForm.target.trim(),
      description: editForm.description.trim(),
      confidence: Number(editForm.confidence),
    };

    if (Number.isNaN(updatedAnomaly.confidence) || updatedAnomaly.confidence < 0 || updatedAnomaly.confidence > 100) {
      window.alert("Confidence harus berupa angka antara 0 sampai 100.");
      return;
    }

    setAnomalies((previous) => previous.map((item) => (item.id === updatedAnomaly.id ? updatedAnomaly : item)));

    setSelectedAnomaly(updatedAnomaly);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus anomali "${selectedAnomaly.title}"?`);

    if (!confirmed) return;

    setAnomalies((previous) => previous.filter((item) => item.id !== selectedAnomaly.id));

    closeDetail();
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeDetail();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <div className="eyebrow">INTELLIGENCE / DETECTION</div>
          <h1>AI Anomalies</h1>
          <p>AI-powered detection of unusual network behavior.</p>
        </div>

        <span className="ai-engine-status">
          <span></span>
          AI ENGINE ACTIVE
        </span>
      </div>

      <div className="target-summary-grid">
        <div className="target-summary-card">
          <div className="target-summary-icon purple">
            <BrainCircuit size={19} />
          </div>
          <div>
            <p>Total Detections</p>
            <h2>{anomalies.length}</h2>
          </div>
        </div>

        <div className="target-summary-card">
          <div className="target-summary-icon red">
            <AlertTriangle size={19} />
          </div>
          <div>
            <p>High Severity</p>
            <h2>{highCount}</h2>
          </div>
        </div>

        <div className="target-summary-card">
          <div className="target-summary-icon orange">
            <Activity size={19} />
          </div>
          <div>
            <p>Medium Severity</p>
            <h2>{mediumCount}</h2>
          </div>
        </div>

        <div className="target-summary-card">
          <div className="target-summary-icon green">
            <ShieldCheck size={19} />
          </div>
          <div>
            <p>AI Confidence</p>
            <h2>{averageConfidence}%</h2>
          </div>
        </div>
      </div>

      <section className="dashboard-panel anomaly-page-panel">
        <div className="panel-header">
          <div>
            <h2>Detection Stream</h2>
            <p>Recently detected network anomalies.</p>
          </div>
          <span className="panel-tag">AI MONITORING</span>
        </div>

        <div className="target-toolbar">
          <div className="target-search">
            <Search size={16} />
            <input type="text" placeholder="Search anomaly, target, or ID..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>

          <div className="target-filters">
            {["All", "High", "Medium", "Low"].map((item) => (
              <button key={item} className={severityFilter === item ? "active" : ""} onClick={() => setSeverityFilter(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="anomaly-page-list">
          {filteredAnomalies.map((anomaly) => (
            <article className="anomaly-page-item" key={anomaly.id}>
              <div className={`anomaly-page-icon ${anomaly.severity.toLowerCase()}`}>
                <BrainCircuit size={20} />
              </div>

              <div className="anomaly-page-content">
                <div className="anomaly-page-top">
                  <div>
                    <span className="anomaly-id">{anomaly.id}</span>
                    <h3>{anomaly.title}</h3>
                  </div>

                  <span className={`severity-badge ${anomaly.severity.toLowerCase()}`}>{anomaly.severity}</span>
                </div>

                <p>{anomaly.description}</p>

                <div className="anomaly-page-meta">
                  <span>
                    <Activity size={13} />
                    {anomaly.target}
                  </span>

                  <span>
                    <Clock size={13} />
                    {anomaly.time}
                  </span>

                  <span className="anomaly-category">{anomaly.category}</span>
                </div>
              </div>

              <div className="anomaly-confidence">
                <span>CONFIDENCE</span>
                <strong>{anomaly.confidence}%</strong>
                <div className="confidence-track">
                  <div style={{ width: `${anomaly.confidence}%` }}></div>
                </div>
                <small>{anomaly.value}</small>
              </div>

              <button className="table-action" title="View anomaly details" onClick={() => openDetail(anomaly)}>
                <ArrowUpRight size={17} />
              </button>
            </article>
          ))}

          {filteredAnomalies.length === 0 && <div className="empty-table">No anomalies found.</div>}
        </div>

        <div className="ai-insight">
          <Zap size={17} />
          <div>
            <strong>AI Detection Insight</strong>
            <p>Detection results shown here are sample data. Connect the detection service to display live AI analysis.</p>
          </div>
        </div>
      </section>

      {selectedAnomaly && (
        <div className="detail-overlay" onClick={closeDetail}>
          <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
            <div className="detail-modal-header">
              <div>
                <span className="detail-eyebrow">{isEditing ? "EDIT ANOMALY" : "AI ANOMALY DETAILS"}</span>
                <h2>{isEditing ? "Edit Anomaly" : selectedAnomaly.title}</h2>
                <p>{isEditing ? "Update anomaly information." : "Detailed information about this AI detection."}</p>
              </div>

              <button className="detail-close-button" onClick={closeDetail} title="Close">
                <X size={19} />
              </button>
            </div>

            {isEditing ? (
              <form className="detail-form" onSubmit={saveEdit}>
                <div className="form-group">
                  <label>Anomaly Title</label>
                  <input type="text" name="title" value={editForm.title} onChange={handleEditChange} required />
                </div>

                <div className="form-group">
                  <label>Target</label>
                  <input type="text" name="target" value={editForm.target} onChange={handleEditChange} required />
                </div>

                <div className="detail-form-grid">
                  <div className="form-group">
                    <label>Severity</label>
                    <select name="severity" value={editForm.severity} onChange={handleEditChange}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={editForm.category} onChange={handleEditChange}>
                      <option value="Latency">Latency</option>
                      <option value="Traffic">Traffic</option>
                      <option value="Connectivity">Connectivity</option>
                    </select>
                  </div>
                </div>

                <div className="detail-form-grid">
                  <div className="form-group">
                    <label>Confidence (%)</label>
                    <input type="number" name="confidence" min="0" max="100" step="0.1" value={editForm.confidence} onChange={handleEditChange} />
                  </div>

                  <div className="form-group">
                    <label>Detected Value</label>
                    <input type="text" name="value" value={editForm.value} onChange={handleEditChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} rows="3" />
                </div>

                <div className="detail-modal-actions">
                  <button type="button" className="detail-cancel-button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>

                  <button type="submit" className="detail-edit-button">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="detail-main-info">
                  <div className="detail-large-icon">
                    <BrainCircuit size={25} />
                  </div>

                  <div>
                    <h3>{selectedAnomaly.id}</h3>
                    <p>{selectedAnomaly.target}</p>
                  </div>

                  <span className={`severity-badge ${selectedAnomaly.severity.toLowerCase()}`}>{selectedAnomaly.severity}</span>
                </div>

                <div className="detail-grid">
                  <div className="detail-grid-item">
                    <span>Anomaly ID</span>
                    <strong>{selectedAnomaly.id}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>Target</span>
                    <strong>{selectedAnomaly.target}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>Severity</span>
                    <strong>{selectedAnomaly.severity}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>Category</span>
                    <strong>{selectedAnomaly.category}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>Confidence</span>
                    <strong>{selectedAnomaly.confidence}%</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>Detected Value</span>
                    <strong>{selectedAnomaly.value}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>Time</span>
                    <strong>{selectedAnomaly.time}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>Description</span>
                    <strong>{selectedAnomaly.description}</strong>
                  </div>
                </div>

                <div className="detail-modal-actions">
                  <button className="detail-delete-button" onClick={handleDelete}>
                    <Trash2 size={15} />
                    Delete
                  </button>

                  <button className="detail-edit-button" onClick={startEdit}>
                    <Pencil size={15} />
                    Edit Anomaly
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAnomalies;
