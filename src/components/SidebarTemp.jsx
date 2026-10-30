import { LayoutDashboard, Network, BrainCircuit, AlertTriangle, Settings, X, Activity } from "lucide-react";

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "targets", label: "Network Targets", icon: Network },
  { id: "anomalies", label: "AI Anomalies", icon: BrainCircuit },
  { id: "incidents", label: "Incidents", icon: AlertTriangle },
];

function Sidebar({ activePage, setActivePage, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <Activity size={23} />
          </div>

          <div className="brand-info">
            <h2>MONETA</h2>
            <span>NETWORK INTELLIGENCE</span>
          </div>

          <button className="close-sidebar" onClick={onClose}>
            <X size={21} />
          </button>
        </div>

        <div className="workspace-box">
          <span className="workspace-indicator"></span>

          <div>
            <h4>PROD-NOC-01</h4>
            <p>Production environment</p>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? "active" : ""}`}
                onClick={() => {
                  setActivePage(item.id);
                  onClose();
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="engine-card">
            <div className="engine-status">
              <span></span>
              TELEMETRY ENGINE
            </div>

            <h4>All services operational</h4>
            <p>Version 4.18.2</p>
          </div>

          <button className="settings-button">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="sidebar-profile">
            <div className="profile-avatar">AV</div>

            <div>
              <h4>Alex Vance</h4>
              <p>Lead SRE · Active</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
