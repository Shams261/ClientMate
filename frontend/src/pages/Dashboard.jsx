import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { getLeads, getAgents } from "../services/api";

// Dashboard Component - Overview of leads and agents with stats and recent activity
function Dashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Predefined statuses matching the Lead model
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadsRes, agentsRes] = await Promise.all([
        getLeads(),
        getAgents(),
      ]);
      setLeads(leadsRes.data);
      setAgents(agentsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Compute leads by status for the status overview cards
  const leadsByStatus = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  // Compute leads by priority
  const leadsByPriority = leads.reduce((acc, lead) => {
    acc[lead.priority] = (acc[lead.priority] || 0) + 1;
    return acc;
  }, {});

  // Get recent leads (last 5)
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Bootstrap variant mapping for status
  const getStatusVariant = (status) => {
    const variants = {
      New: "primary",
      Contacted: "warning",
      Qualified: "info",
      "Proposal Sent": "secondary",
      Closed: "success",
    };
    return variants[status] || "secondary";
  };

  // Bootstrap variant mapping for priority
  const getPriorityVariant = (priority) => {
    const variants = {
      High: "danger",
      Medium: "warning",
      Low: "secondary",
    };
    return variants[priority] || "secondary";
  };

  // Navigate to leads page with filter
  // WHY: Quick filters should pre-populate the URL so LeadList shows filtered results
  const handleQuickFilter = (filterType, value) => {
    navigate(`/leads?${filterType}=${encodeURIComponent(value)}`);
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header with Add Lead button */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </h1>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/leads")}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Add New Lead
          </Button>
        </Col>
      </Row>

      {/* Top Stats Cards */}
      <Row className="mb-4 g-4">
        <Col md={6} lg={3}>
          <Card
            className="h-100 border-0 shadow-sm text-center"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/leads")}
          >
            <Card.Body>
              <div className="text-muted small mb-2">
                <i className="bi bi-people-fill me-1"></i>
                Total Leads
              </div>
              <h2 className="display-4 fw-bold text-primary mb-0">
                {leads.length}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="h-100 border-0 shadow-sm text-center"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/agents")}
          >
            <Card.Body>
              <div className="text-muted small mb-2">
                <i className="bi bi-person-workspace me-1"></i>
                Sales Agents
              </div>
              <h2 className="display-4 fw-bold text-success mb-0">
                {agents.length}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="h-100 border-0 shadow-sm text-center"
            style={{ cursor: "pointer" }}
            onClick={() => handleQuickFilter("status", "New")}
          >
            <Card.Body>
              <div className="text-muted small mb-2">
                <i className="bi bi-star-fill me-1"></i>
                New Leads
              </div>
              <h2 className="display-4 fw-bold text-info mb-0">
                {leadsByStatus["New"] || 0}
              </h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="h-100 border-0 shadow-sm text-center"
            style={{ cursor: "pointer" }}
            onClick={() => handleQuickFilter("priority", "High")}
          >
            <Card.Body>
              <div className="text-muted small mb-2">
                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                High Priority
              </div>
              <h2 className="display-4 fw-bold text-danger mb-0">
                {leadsByPriority["High"] || 0}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Grid */}
      <Row className="g-4">
        {/* Left Column - Status Breakdown */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h4 className="mb-0">
                <i className="bi bi-kanban me-2"></i>
                Lead Status Overview
              </h4>
            </Card.Header>
            <Card.Body>
              {/* Status Cards Grid */}
              <Row className="g-3 mb-4">
                {statuses.map((status) => (
                  <Col key={status}>
                    <Card
                      className={`border-start border-4 border-${getStatusVariant(status)} h-100`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleQuickFilter("status", status)}
                    >
                      <Card.Body className="py-3">
                        <h3
                          className={`display-6 fw-bold text-${getStatusVariant(status)} mb-1`}
                        >
                          {leadsByStatus[status] || 0}
                        </h3>
                        <small className="text-muted">{status}</small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Quick Filter Buttons */}
              <div className="border-top pt-4">
                <h6 className="text-muted mb-3">
                  <i className="bi bi-funnel me-2"></i>
                  Quick Filters
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status}
                      variant={`outline-${getStatusVariant(status)}`}
                      size="sm"
                      className="rounded-pill"
                      onClick={() => handleQuickFilter("status", status)}
                    >
                      {status}
                      <Badge bg={getStatusVariant(status)} className="ms-2">
                        {leadsByStatus[status] || 0}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Recent Leads & Priority */}
        <Col lg={4}>
          <Row className="g-4">
            {/* Priority Breakdown */}
            <Col xs={12}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 pt-3 pb-0">
                  <h5 className="mb-0">
                    <i className="bi bi-flag-fill me-2"></i>
                    By Priority
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {["High", "Medium", "Low"].map((priority) => (
                      <ListGroup.Item
                        key={priority}
                        action
                        className="d-flex justify-content-between align-items-center px-0"
                        onClick={() => handleQuickFilter("priority", priority)}
                      >
                        <span>
                          <i
                            className={`bi bi-circle-fill text-${getPriorityVariant(priority)} me-2`}
                            style={{ fontSize: "0.5rem" }}
                          ></i>
                          {priority}
                        </span>
                        <Badge bg={getPriorityVariant(priority)} pill>
                          {leadsByPriority[priority] || 0}
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Leads */}
            <Col xs={12}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-clock-history me-2"></i>
                    Recent Leads
                  </h5>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0"
                    onClick={() => navigate("/leads")}
                  >
                    View All
                  </Button>
                </Card.Header>
                <Card.Body>
                  {recentLeads.length === 0 ? (
                    <p className="text-muted text-center mb-0">No leads yet</p>
                  ) : (
                    <ListGroup variant="flush">
                      {recentLeads.map((lead) => (
                        <ListGroup.Item
                          key={lead._id}
                          action
                          className="px-0 py-2"
                          onClick={() => navigate("/leads")}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="fw-semibold">{lead.name}</div>
                              <small className="text-muted">
                                {lead.salesAgent?.name || "Unassigned"} |{" "}
                                {lead.source}
                              </small>
                            </div>
                            <Badge
                              bg={getStatusVariant(lead.status)}
                              className="ms-2"
                            >
                              {lead.status}
                            </Badge>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
