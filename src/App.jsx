import { useState } from "react";
import Sidebar from "./components/SidebarTemp";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import NetworkTargets from "./pages/NetworkTargets";
import AIAnomalies from "./pages/AIAnomalies";
import Incidents from "./pages/Incidents";
import AddTarget from "./pages/AddTarget";
import AddIncident from "./pages/AddIncident";

const initialTargets = [
  {
    id: 1,
    name: "Production API",
    address: "api.moneta.local",
    ip: "192.168.1.10",
    protocol: "HTTP",
    status: "Online",
    latency: 24,
    uptime: "99.98%",
    location: "Jakarta, ID",
  },
  {
    id: 2,
    name: "Main Database",
    address: "db.moneta.local",
    ip: "192.168.1.20",
    protocol: "TCP SYN",
    status: "Online",
    latency: 12,
    uptime: "99.99%",
    location: "Jakarta, ID",
  },
  {
    id: 3,
    name: "Authentication Server",
    address: "auth.moneta.local",
    ip: "192.168.1.30",
    protocol: "HTTP",
    status: "Degraded",
    latency: 185,
    uptime: "97.42%",
    location: "Bandung, ID",
  },
  {
    id: 4,
    name: "DNS Resolver",
    address: "dns.moneta.local",
    ip: "192.168.1.40",
    protocol: "ICMP",
    status: "Online",
    latency: 8,
    uptime: "99.95%",
    location: "Jakarta, ID",
  },
  {
    id: 5,
    name: "Backup Server",
    address: "backup.moneta.local",
    ip: "192.168.1.50",
    protocol: "ICMP",
    status: "Offline",
    latency: null,
    uptime: "89.12%",
    location: "Surabaya, ID",
  },
];

const initialIncidents = [
  {
    id: "INC-1042",
    title: "API Response Time Degradation",
    description: "API response time increased significantly.",
    priority: "Critical",
    status: "Investigating",
    created: "Today 10:42",
    assignee: "Alex Vance",
    target: "Production API",
  },
  {
    id: "INC-1041",
    title: "Database Connection Instability",
    description: "Database connections are experiencing instability.",
    priority: "High",
    status: "Acknowledged",
    created: "Today 09:18",
    assignee: "Sarah Chen",
    target: "Main Database",
  },
  {
    id: "INC-1040",
    title: "Backup Server Unreachable",
    description: "Backup server cannot be reached.",
    priority: "High",
    status: "Open",
    created: "Today 08:35",
    assignee: "Unassigned",
    target: "Backup Server",
  },
  {
    id: "INC-1039",
    title: "DNS Latency Spike",
    description: "DNS resolver experienced a latency spike.",
    priority: "Medium",
    status: "Resolved",
    created: "Yesterday 16:20",
    assignee: "Michael Ross",
    target: "DNS Resolver",
  },
];

function App() {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [targets, setTargets] = useState(initialTargets);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [returnPage, setReturnPage] = useState("overview");

  const openAddPage = (page) => {
    setReturnPage(activePage);
    setActivePage(page);
  };

  const handleCancelForm = () => {
    setActivePage(returnPage);
  };

  const handleAddTarget = (formData) => {
    const newTarget = {
      ...formData,
      id: Date.now(),
      address: formData.address || formData.ipAddress || "",
      ip: formData.ip || formData.ipAddress || "",
      status: formData.status || "Online",
      latency: null,
      uptime: "—",
    };

    setTargets((prev) => [newTarget, ...prev]);
    setActivePage("targets");
  };

  const handleUpdateTarget = (updatedTarget) => {
    setTargets((prev) => prev.map((target) => (target.id === updatedTarget.id ? updatedTarget : target)));
  };

  const handleDeleteTarget = (targetId) => {
    setTargets((prev) => prev.filter((target) => target.id !== targetId));
  };

  const handleAddIncident = (formData) => {
    const newIncident = {
      ...formData,
      id: `INC-${Date.now()}`,
      created: "Just now",
      createdAt: new Date().toISOString(),
      assignee: formData.assignee || "Unassigned",
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setActivePage("incidents");
  };

  const handleUpdateIncident = (updatedIncident) => {
    setIncidents((prev) => prev.map((incident) => (incident.id === updatedIncident.id ? updatedIncident : incident)));
  };

  const handleDeleteIncident = (incidentId) => {
    setIncidents((prev) => prev.filter((incident) => incident.id !== incidentId));
  };

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return (
          <Dashboard
            targets={targets}
            incidents={incidents}
            onAddTarget={() => openAddPage("add-target")}
            onAddIncident={() => openAddPage("add-incident")}
            onViewIncidents={() => setActivePage("incidents")}
            onViewAnomalies={() => setActivePage("anomalies")}
          />
        );

      case "targets":
        return <NetworkTargets targets={targets} onAddTarget={() => openAddPage("add-target")} onUpdateTarget={handleUpdateTarget} onDeleteTarget={handleDeleteTarget} />;

      case "anomalies":
        return <AIAnomalies />;

      case "incidents":
        return <Incidents incidents={incidents} onAddIncident={() => openAddPage("add-incident")} onUpdateIncident={handleUpdateIncident} onDeleteIncident={handleDeleteIncident} />;

      case "add-target":
        return <AddTarget onCancel={handleCancelForm} onSubmit={handleAddTarget} />;

      case "add-incident":
        return <AddIncident targets={targets} onCancel={handleCancelForm} onSubmit={handleAddIncident} />;

      default:
        return (
          <Dashboard
            targets={targets}
            incidents={incidents}
            onAddTarget={() => openAddPage("add-target")}
            onAddIncident={() => openAddPage("add-incident")}
            onViewIncidents={() => setActivePage("incidents")}
            onViewAnomalies={() => setActivePage("anomalies")}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="main-content">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="page-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
