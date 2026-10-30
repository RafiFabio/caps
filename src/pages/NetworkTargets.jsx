import { useState, useEffect } from "react";
import { Search, Plus, Network, Globe, Server, Wifi, RefreshCw, MoreHorizontal, Pencil, Trash2, X, MapPin, Activity, Clock, ShieldCheck } from "lucide-react";

function NetworkTargets({ targets = [], onAddTarget, onUpdateTarget, onDeleteTarget }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const normalizedStatus = (status) => (status === "Active" ? "Online" : status || "Unknown");

  const filteredTargets = targets.filter((target) => {
    const searchText = search.toLowerCase();

    const matchesSearch = (target.name || "").toLowerCase().includes(searchText) || (target.address || "").toLowerCase().includes(searchText) || (target.ip || target.ipAddress || "").toLowerCase().includes(searchText);

    const matchesFilter = filter === "All" || normalizedStatus(target.status) === filter;

    return matchesSearch && matchesFilter;
  });

  const onlineCount = targets.filter((target) => normalizedStatus(target.status) === "Online").length;

  const degradedCount = targets.filter((target) => normalizedStatus(target.status) === "Degraded").length;

  const offlineCount = targets.filter((target) => normalizedStatus(target.status) === "Offline").length;

  const openDetail = (target) => {
    setSelectedTarget(target);
    setIsEditing(false);
  };

  const closeDetail = () => {
    setSelectedTarget(null);
    setIsEditing(false);
    setEditForm({});
  };

  const startEdit = () => {
    setEditForm({
      name: selectedTarget.name || "",
      address: selectedTarget.address || selectedTarget.ipAddress || "",
      ip: selectedTarget.ip || selectedTarget.ipAddress || "",
      type: selectedTarget.type || "",
      location: selectedTarget.location || "",
      status: normalizedStatus(selectedTarget.status),
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

    if (!editForm.name.trim()) {
      window.alert("Target name tidak boleh kosong.");
      return;
    }

    const updatedTarget = {
      ...selectedTarget,
      ...editForm,
      name: editForm.name.trim(),
      address: editForm.address.trim(),
      ip: editForm.ip.trim(),
      location: editForm.location.trim(),
    };

    onUpdateTarget(updatedTarget);
    setSelectedTarget(updatedTarget);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus target "${selectedTarget.name}"?`);

    if (!confirmed) return;

    onDeleteTarget(selectedTarget.id);
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
          <div className="eyebrow">MONITORING / INFRASTRUCTURE</div>
          <h1>Network Targets</h1>
          <p>Monitor and manage all registered network endpoints.</p>
        </div>

        <button className="primary-button" onClick={onAddTarget}>
          <Plus size={15} />
          Add Target
        </button>
      </div>

      <div className="target-summary-grid">
        <div className="target-summary-card">
          <div className="target-summary-icon cyan">
            <Network size={19} />
          </div>
          <div>
            <p>Total Targets</p>
            <h2>{targets.length}</h2>
          </div>
        </div>

        <div className="target-summary-card">
          <div className="target-summary-icon green">
            <Wifi size={19} />
          </div>
          <div>
            <p>Online</p>
            <h2>{onlineCount}</h2>
          </div>
        </div>

        <div className="target-summary-card">
          <div className="target-summary-icon orange">
            <RefreshCw size={19} />
          </div>
          <div>
            <p>Degraded</p>
            <h2>{degradedCount}</h2>
          </div>
        </div>

        <div className="target-summary-card">
          <div className="target-summary-icon red">
            <Server size={19} />
          </div>
          <div>
            <p>Offline</p>
            <h2>{offlineCount}</h2>
          </div>
        </div>
      </div>

      <section className="dashboard-panel target-panel">
        <div className="panel-header">
          <div>
            <h2>Registered Endpoints</h2>
            <p>Network targets currently monitored by MONETA.</p>
          </div>
          <span className="panel-tag">LIVE MONITORING</span>
        </div>

        <div className="target-toolbar">
          <div className="target-search">
            <Search size={16} />
            <input type="text" placeholder="Search name, domain, or IP address..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>

          <div className="target-filters">
            {["All", "Online", "Degraded", "Offline"].map((item) => (
              <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Target</th>
                <th>Probe</th>
                <th>Status</th>
                <th>Latency</th>
                <th>Uptime</th>
                <th>Location</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredTargets.map((target) => {
                const status = normalizedStatus(target.status);

                return (
                  <tr key={target.id}>
                    <td>
                      <div className="table-primary">
                        <div className="table-icon">
                          <Globe size={17} />
                        </div>
                        <div>
                          <strong>{target.name}</strong>
                          <span>{target.address || target.ipAddress || "—"}</span>
                          <span>{target.ip || target.ipAddress || "—"}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="probe-type">{target.type || "—"}</span>
                    </td>

                    <td>
                      <span className={`status-badge ${status.toLowerCase()}`}>
                        <span></span>
                        {status}
                      </span>
                    </td>

                    <td>
                      <strong className="latency-value">{target.latency == null ? "—" : `${target.latency} ms`}</strong>
                    </td>

                    <td>{target.uptime || "—"}</td>
                    <td>{target.location || "—"}</td>

                    <td>
                      <div className="data-actions">
                        <button className="table-action" title="View details" onClick={() => openDetail(target)}>
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTargets.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    No network targets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          Showing {filteredTargets.length} of {targets.length} targets
        </div>
      </section>

      {selectedTarget && (
        <div className="detail-overlay" onClick={closeDetail}>
          <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
            <div className="detail-modal-header">
              <div>
                <span className="detail-eyebrow">{isEditing ? "EDIT TARGET" : "TARGET DETAILS"}</span>
                <h2>{isEditing ? "Edit Network Target" : selectedTarget.name}</h2>
                <p>{isEditing ? "Update the registered endpoint information." : "View network endpoint information and monitoring status."}</p>
              </div>

              <button className="detail-close-button" onClick={closeDetail} title="Close">
                <X size={19} />
              </button>
            </div>

            {isEditing ? (
              <form className="detail-form" onSubmit={saveEdit}>
                <div className="form-group">
                  <label>Target Name</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} required />
                </div>

                <div className="form-group">
                  <label>Address / Domain</label>
                  <input type="text" name="address" value={editForm.address} onChange={handleEditChange} required />
                </div>

                <div className="form-group">
                  <label>IP Address</label>
                  <input type="text" name="ip" value={editForm.ip} onChange={handleEditChange} />
                </div>

                <div className="detail-form-grid">
                  <div className="form-group">
                    <label>Probe Type</label>
                    <select name="type" value={editForm.type} onChange={handleEditChange}>
                      <option value="">Select Probe</option>
                      <option value="HTTP">HTTP</option>
                      <option value="TCP SYN">TCP SYN</option>
                      <option value="ICMP">ICMP</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={editForm.status} onChange={handleEditChange}>
                      <option value="Online">Online</option>
                      <option value="Degraded">Degraded</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={editForm.location} onChange={handleEditChange} />
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
                    <Globe size={25} />
                  </div>

                  <div>
                    <h3>{selectedTarget.name}</h3>
                    <p>{selectedTarget.address || selectedTarget.ipAddress || "No address"}</p>
                  </div>

                  <span className={`status-badge ${normalizedStatus(selectedTarget.status).toLowerCase()}`}>
                    <span></span>
                    {normalizedStatus(selectedTarget.status)}
                  </span>
                </div>

                <div className="detail-grid">
                  <div className="detail-grid-item">
                    <span>
                      <Network size={14} /> Target ID
                    </span>
                    <strong>{selectedTarget.id}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>
                      <Activity size={14} /> Probe Type
                    </span>
                    <strong>{selectedTarget.type || "—"}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>
                      <Globe size={14} /> IP Address
                    </span>
                    <strong>{selectedTarget.ip || selectedTarget.ipAddress || "—"}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>
                      <MapPin size={14} /> Location
                    </span>
                    <strong>{selectedTarget.location || "—"}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>
                      <Clock size={14} /> Latency
                    </span>
                    <strong>{selectedTarget.latency == null ? "—" : `${selectedTarget.latency} ms`}</strong>
                  </div>

                  <div className="detail-grid-item">
                    <span>
                      <ShieldCheck size={14} /> Uptime
                    </span>
                    <strong>{selectedTarget.uptime || "—"}</strong>
                  </div>
                </div>

                <div className="detail-modal-actions">
                  <button className="detail-delete-button" onClick={handleDelete}>
                    <Trash2 size={15} />
                    Delete
                  </button>

                  <button className="detail-edit-button" onClick={startEdit}>
                    <Pencil size={15} />
                    Edit Target
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

export default NetworkTargets;
