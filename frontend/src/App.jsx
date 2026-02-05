import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LeadsPage from "./pages/LeadsPage";
import AgentsPage from "./pages/AgentsPage";
import ReportsPage from "./pages/ReportsPage";
import LeadStatusView from "./components/LeadStatusView";
import SalesAgentView from "./components/SalesAgentView";
import "./App.css";

function App() {
  return (
    <Router>
      <ToastProvider>
        <div className="App min-vh-100 d-flex flex-column">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/by-status" element={<LeadStatusView />} />
              <Route path="/leads/by-agent" element={<SalesAgentView />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
