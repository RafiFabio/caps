import { useState, useEffect } from "react";
import { Search, AlertTriangle, Clock, CheckCircle2, ShieldAlert, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";

function Incidents({ incidents = [], onAddIncident, onUpdateIncident, onDeleteIncident }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const allIncidents = incidents.map((incident) => ({
    ...incident,
    priority: incident.priority || (incident.severity === "Critical" ? "Critical" : incident.severity === "High" ? "High" : "Medium"),
    created: incident.created || incident.createdAt || "Just now",
    assignee: incident.assignee || "Unassigned",
    status: incident.status || "Open",
  }));

  const filteredIncidents = allIncidents.filter((incident) => {
    const searchText = search.toLowerCase();

    const matchesSearch = (incident.title || "").toLowerCase().includes(searchText) || (incident.id || "").toLowerCase().includes(searchText) || (incident.target || "").toLowerCase().includes(searchText);

    const matchesStatus = statusFilter === "All" || incident.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openCount = allIncidents.filter((item) => item.status === "Open").length;

  const investigatingCount = allIncidents.filter((item) => item.status === "Investigating").length;

  const resolvedCount = allIncidents.filter((item) => item.status === "Resolved").length;

  // Open detail modal
  const openDetail = (incident) => {
    setSelectedIncident(incident);
    setIsEditing(false);
    setEditForm({});
  };

  // Close modal
  const closeDetail = () => {
    setSelectedIncident(null);
    setIsEditing(false);
    setEditForm({});
  };

  // Close modal with Escape
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

  // Start editing
  const startEdit = () => {
    setEditForm({
      title: selectedIncident.title || "",
      description: selectedIncident.description || "",
      target: selectedIncident.target || "",
      priority: selectedIncident.priority || "Medium",
      status: selectedIncident.status || "Open",
      assignee: selectedIncident.assignee || "Unassigned",
    });

    setIsEditing(true);
  };

  // Handle form changes
  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save changes
  const saveEdit = (event) => {
    event.preventDefault();

    if (!editForm.title.trim()) {
      window.alert("Incident title tidak boleh kosong.");
      return;
    }

    const updatedIncident = {
      ...selectedIncident,
      ...editForm,
      title: editForm.title.trim(),
      description: editForm.description.trim(),
    };

    if (onUpdateIncident) {
      onUpdateIncident(updatedIncident);
    }

    setSelectedIncident(updatedIncident);
    setIsEditing(false);
  };

  // Delete incident
  const handleDelete = () => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus insiden "${selectedIncident.id}"?`);

    if (!confirmed) return;

    if (onDeleteIncident) {
      onDeleteIncident(selectedIncident.id);
    }

    closeDetail();
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <div className="eyebrow">OPERATIONS / INCIDENT MANAGEMENT</div>
          <h1>Incidents</h1>
          <p>Track, investigate, and manage network incidents.</p>
        </div>

        <button className="primary-button" onClick={onAddIncident}>
          <ShieldAlert size={15} />
          Create Incident
        </button>
      </div>

      <div className="target-summary-grid">
        <div className="target-summary-card">
          <div className="target-summary-icon red">
            <AlertTriangle size={19} />
          </div>
          <div>
            <p>Total Incidents</p>
            <h2>{allIncidents.length}</h2>
          </div>
        </div>

        <div className="target-summary-card">
          <div className="target-summary-icon orange">
            <Clock size={19} />
          </div>
          <div>
            <p>Open</p>
            <h2>{openCount}</h2>
          </div>
        </div>

        <div className="target-summary-card">
          <div className="target-summary-icon purple">
            <ShieldAlert size={19} />
          </div>
          <div>
            <p>Investigating</p>
            <h2>{investigatingCount}</h2>
          </div>
        </div>

        <div className="target-summary-card">
          <div className="target-summary-icon green">
            <CheckCircle2 size={19} />
          </div>
          <div>
            <p>Resolved</p>
            <h2>{resolvedCount}</h2>
          </div>
        </div>
      </div>

      <section className="dashboard-panel incident-page-panel">
        <div className="panel-header">
          <div>
            <h2>Incident Management</h2>
            <p>Review and manage detected network incidents.</p>
          </div>
          <span className="panel-tag">OPERATIONS CENTER</span>
        </div>

        <div className="target-toolbar">
          <div className="target-search">
            <Search size={16} />
            <input type="text" placeholder="Search incident, ID, or target..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>

          <div className="target-filters">
            {["All", "Open", "Investigating", "Acknowledged", "Resolved"].map((item) => (
              <button key={item} className={statusFilter === item ? "active" : ""} onClick={() => setStatusFilter(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="incident-page-list">
          {filteredIncidents.map((incident) => (
            <article className="incident-page-item" key={incident.id}>
              <div className={`incident-priority-icon ${incident.priority.toLowerCase()}`}>
                <AlertTriangle size={19} />
              </div>

              <div className="incident-page-content">
                <div className="incident-page-title">
                  <div>
                    <span className="incident-id-label">{incident.id}</span>
                    <h3>{incident.title}</h3>
                  </div>

                  <span className={`priority-badge ${incident.priority.toLowerCase()}`}>{incident.priority}</span>
                </div>

                <p>{incident.description}</p>

                <div className="incident-page-meta">
                  <span>{incident.target || "No target selected"}</span>
                  <span>{incident.created}</span>
                  <span>Assigned: {incident.assignee}</span>
                </div>
              </div>

              <div className="incident-page-actions">
                <span className={`incident-status-badge ${incident.status.toLowerCase()}`}>{incident.status}</span>

                <button className="table-action" title="View incident details" onClick={() => openDetail(incident)}>
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </article>
          ))}

          {filteredIncidents.length === 0 && <div className="empty-table">No incidents found.</div>}
        </div>

        <div className="table-footer">
          Showing {filteredIncidents.length} of {allIncidents.length} incidents
        </div>
      </section>

      {/* Detail Modal */}
      {selectedIncident && (
        <div className="detail-overlay" onClick={closeDetail}>
          <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
            <div className="detail-modal-header">
              <div>
                <span className="detail-eyebrow">INCIDENT MANAGEMENT</span>
                <h2>{isEditing ? "Edit Incident" : "Incident Details"}</h2>
                <p>{selectedIncident.id}</p>
              </div>

              <button className="detail-close-button" onClick={closeDetail} title="Close">
                <X size={19} />
              </button>
            </div>

            {isEditing ? (
              <form className="detail-form" onSubmit={saveEdit}>
                <label>
                  Incident Title
                  <input name="title" value={editForm.title} onChange={handleEditChange} required />
                </label>

                <label>
                  Description
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} rows={4} />
                </label>

                <label>
                  Target
                  <input name="target" value={editForm.target} onChange={handleEditChange} />
                </label>

                <div className="detail-form-grid">
                  <label>
                    Priority
                    <select name="priority" value={editForm.priority} onChange={handleEditChange}>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>

                  <label>
                    Status
                    <select name="status" value={editForm.status} onChange={handleEditChange}>
                      <option value="Open">Open</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Acknowledged">Acknowledged</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </label>
                </div>

                <label>
                  Assignee
                  <input name="assignee" value={editForm.assignee} onChange={handleEditChange} />
                </label>

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
                    <AlertTriangle size={28} />
                  </div>

                  <div>
                    <span className={`priority-badge ${selectedIncident.priority.toLowerCase()}`}>{selectedIncident.priority} Priority</span>
                    <h3>{selectedIncident.title}</h3>
                    <p>{selectedIncident.description || "No description provided."}</p>
                  </div>
                </div>

                <div className="detail-grid">
                  <div>
                    <span>Incident ID</span>
                    <strong>{selectedIncident.id}</strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>{selectedIncident.status}</strong>
                  </div>

                  <div>
                    <span>Target</span>
                    <strong>{selectedIncident.target || "—"}</strong>
                  </div>

                  <div>
                    <span>Assignee</span>
                    <strong>{selectedIncident.assignee}</strong>
                  </div>

                  <div>
                    <span>Created</span>
                    <strong>{selectedIncident.created}</strong>
                  </div>

                  <div>
                    <span>Priority</span>
                    <strong>{selectedIncident.priority}</strong>
                  </div>
                </div>

                <div className="detail-modal-actions">
                  <button className="detail-delete-button" onClick={handleDelete}>
                    <Trash2 size={15} />
                    Delete
                  </button>

                  <button className="detail-edit-button" onClick={startEdit}>
                    <Pencil size={15} />
                    Edit Incident
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

export default Incidents;
