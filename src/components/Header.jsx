import { Menu, Bell, ChevronRight } from "lucide-react";

function Header({ onMenuClick, activePage }) {
  const pageNames = {
    overview: "Overview",
    targets: "Network Targets",
    anomalies: "AI Anomalies",
    incidents: "Incidents",
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onMenuClick} aria-label="Open navigation menu">
          <Menu size={23} />
        </button>

        <div className="breadcrumb">
          <span>Workspace</span>
          <ChevronRight size={15} />
          <strong>{pageNames[activePage]}</strong>
        </div>
      </div>

      <div className="header-right">
        <div className="live-indicator">
          <span></span>
          SYSTEM LIVE
        </div>

        <button className="notification-button">
          <Bell size={20} />
          <span></span>
        </button>

        <div className="header-profile">
          <div className="profile-avatar">AV</div>

          <div>
            <h4>Alex Vance</h4>
            <p>Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
