import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import LeadForm from "../components/LeadForm";
import LeadList from "../components/LeadList";

function LeadsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLeadCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setShowForm(false);
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          <i className="bi bi-people-fill me-2"></i>
          Leads Management
        </h1>
        <Button
          variant={showForm ? "secondary" : "primary"}
          onClick={() => setShowForm(!showForm)}
        >
          <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} me-2`}></i>
          {showForm ? "Cancel" : "New Lead"}
        </Button>
      </div>

      {showForm && <LeadForm onSuccess={handleLeadCreated} />}

      <div className="mt-4">
        <LeadList key={refreshKey} />
      </div>
    </Container>
  );
}

export default LeadsPage;
