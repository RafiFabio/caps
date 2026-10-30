import { Network, AlertTriangle, BrainCircuit, Activity, TrendingUp, Clock, ArrowUpRight, Server, Globe, Wifi, ShieldAlert } from "lucide-react";

import NetworkChart from "../components/NetworkChart";

const metrics = [
  {
    title: "TOTAL TARGETS",
    value: "148",
    detail: "142 UP · 4 DEG · 2 OFF",
    icon: Network,
    color: "cyan",
  },
  {
    title: "ACTIVE INCIDENTS",
    value: "03",
    detail: "1 Critical · 2 Warning",
    icon: AlertTriangle,
    color: "red",
  },
  {
    title: "AI ANOMALIES",
    value: "05",
    detail: "Detected in the past hour",
    icon: BrainCircuit,
    color: "purple",
  },
  {
    title: "GLOBAL RTT",
    value: "24.6 ms",
    detail: "−3.2 ms vs previous hour",
    icon: Activity,
    color: "blue",
  },
];

//contoh data anomali dan insiden
const anomalies = [
  {
    id: 1,
    title: "Unusual latency spike detected",
    target: "gateway-jakarta-01",
    description: "Response time increased by 185% from baseline.",
    time: "2 minutes ago",
    severity: "HIGH",
    type: "high",
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Packet loss pattern identified",
    target: "router-surabaya-02",
    description: "Packet loss reached 8.4% during monitoring.",
    time: "12 minutes ago",
    severity: "MEDIUM",
    type: "medium",
    icon: Activity,
  },
  {
    id: 3,
    title: "Unusual traffic behavior",
    target: "api-server-bandung",
    description: "Traffic volume exceeded the normal threshold.",
    time: "28 minutes ago",
    severity: "LOW",
    type: "low",
    icon: ShieldAlert,
  },
];

const defaultIncidents = [
  {
    id: "INC-2401",
    name: "Gateway Jakarta",
    target: "gateway-jakarta-01",
    issue: "High latency",
    severity: "CRITICAL",
    status: "Investigating",
    time: "10:42:18",
    icon: Globe,
  },
  {
    id: "INC-2402",
    name: "Router Surabaya",
    target: "router-surabaya-02",
    issue: "Packet loss",
    severity: "WARNING",
    status: "Monitoring",
    time: "10:31:05",
    icon: Wifi,
  },
  {
    id: "INC-2403",
    name: "API Server Bandung",
    target: "api-server-bandung",
    issue: "Connection timeout",
    severity: "WARNING",
    status: "Acknowledged",
    time: "10:18:42",
    icon: Server,
  },
];

function Dashboard({ onAddTarget, onAddIncident, targets = [], incidents: addedIncidents = [], onViewIncidents, onViewAnomalies }) {
  const allIncidents = [
    ...addedIncidents.map((incident) => ({
      ...incident,
      name: incident.name || incident.title,
      issue: incident.issue || incident.category,
      severity: incident.severity || (incident.priority === "Critical" ? "CRITICAL" : "WARNING"),
      time: incident.time || "Just now",
      icon: AlertTriangle,
    })),
    ...defaultIncidents,
  ];

  const activeIncidentCount = allIncidents.filter((incident) => incident.status !== "Resolved").length;

  const totalTargets = 148 + targets.length;

  return (
    <div className="dashboard">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">NETWORK OPERATIONS CENTER</span>
          <h1>Overview Dashboard</h1>
          <p>Real-time visibility into your network infrastructure.</p>
        </div>

        <div className="dashboard-actions" style={{ display: "flex", gap: "12px" }}>
          <button className="secondary-button" onClick={onAddTarget}>
            + Add Target
          </button>

          <button className="primary-button" onClick={onAddIncident}>
            + Add Incident
          </button>
        </div>
      </div>

      {/* SYSTEM STATUS */}
      <div className="system-banner">
        <div className="system-banner-left">
          <span className="online-dot"></span>

          <div>
            <h3>ALL SYSTEMS MONITORED</h3>
            <p>Prometheus · Blackbox Exporter · AI Engine</p>
          </div>
        </div>

        <div className="system-banner-right">
          <h2>99.94%</h2>
          <span>GLOBAL AVAILABILITY</span>
        </div>
      </div>

      {/* METRICS */}
      <div className="metrics-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          let value = metric.value;
          let detail = metric.detail;

          if (metric.title === "TOTAL TARGETS") {
            value = String(totalTargets);
            detail = `${targets.length} newly registered`;
          }

          if (metric.title === "ACTIVE INCIDENTS") {
            value = String(activeIncidentCount).padStart(2, "0");
            detail = "Currently active incidents";
          }

          return (
            <div className="metric-card" key={metric.title}>
              <div className="metric-header">
                <span>{metric.title}</span>

                <div className={`metric-icon ${metric.color}`}>
                  <Icon size={19} />
                </div>
              </div>

              <h2>{value}</h2>

              <p>
                <TrendingUp size={13} />
                {detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* NETWORK PERFORMANCE */}
      <section className="dashboard-panel network-panel">
        <div className="panel-header">
          <div>
            <h2>Network Performance</h2>
            <p>Network response time across monitored regions</p>
          </div>

          <div className="chart-filters">
            <button className="active">1H</button>
            <button>6H</button>
            <button>24H</button>
            <button>7D</button>
          </div>
        </div>

        <NetworkChart />

        <div className="probe-row">
          <div>
            <span className="probe-dot http"></span>
            HTTP
          </div>

          <div>
            <span className="probe-dot icmp"></span>
            ICMP
          </div>

          <div>
            <span className="probe-dot tcp"></span>
            TCP SYN
          </div>
        </div>
      </section>

      {/* LOWER DASHBOARD GRID */}
      <div className="dashboard-lower-grid">
        {/* AI ANOMALY STREAM */}
        <section className="dashboard-panel anomaly-panel">
          <div className="section-heading">
            <div>
              <div className="section-title">
                <BrainCircuit size={17} />
                <h2>AI Anomaly Stream</h2>
              </div>

              <p>Recent unusual network behavior detected by AI</p>
            </div>

            <span className="live-tag">
              <span></span>
              LIVE
            </span>
          </div>

          <div className="anomaly-list">
            {anomalies.map((anomaly) => {
              const Icon = anomaly.icon;

              return (
                <div className="anomaly-item" key={anomaly.id}>
                  <div className={`anomaly-icon ${anomaly.type}`}>
                    <Icon size={17} />
                  </div>

                  <div className="anomaly-content">
                    <div className="anomaly-title-row">
                      <h3>{anomaly.title}</h3>
                      <span className={`severity-badge ${anomaly.type}`}>{anomaly.severity}</span>
                    </div>

                    <span className="anomaly-target">{anomaly.target}</span>

                    <p>{anomaly.description}</p>

                    <span className="anomaly-time">
                      <Clock size={11} />
                      {anomaly.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="panel-footer-button" onClick={onViewAnomalies}>
            View all anomalies
            <ArrowUpRight size={14} />
          </button>
        </section>

        {/* ACTIVE INCIDENTS */}
        <section className="dashboard-panel incidents-panel">
          <div className="section-heading">
            <div>
              <div className="section-title">
                <AlertTriangle size={17} />
                <h2>Active Incidents</h2>
              </div>

              <p>Network issues that require attention</p>
            </div>

            <span className="incident-count">{String(activeIncidentCount).padStart(2, "0")} ACTIVE</span>
          </div>

          <div className="incident-list">
            {allIncidents
              .filter((incident) => incident.status !== "Resolved")
              .slice(0, 5)
              .map((incident) => {
                const Icon = incident.icon || AlertTriangle;

                return (
                  <div className="incident-item" key={incident.id}>
                    <div className="incident-main">
                      <div className="incident-icon">
                        <Icon size={17} />
                      </div>

                      <div className="incident-info">
                        <h3>{incident.name}</h3>
                        <span>{incident.target}</span>
                      </div>

                      <span className={`severity-badge ${incident.severity === "CRITICAL" || incident.severity === "Critical" ? "high" : "medium"}`}>{incident.severity}</span>
                    </div>

                    <div className="incident-details">
                      <span>{incident.issue}</span>
                      <span className="incident-status">{incident.status}</span>
                      <span className="incident-time">{incident.time}</span>
                    </div>

                    <span className="incident-id">{incident.id}</span>
                  </div>
                );
              })}
          </div>

          <button className="panel-footer-button" onClick={onViewIncidents}>
            View all incidents
            <ArrowUpRight size={14} />
          </button>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
