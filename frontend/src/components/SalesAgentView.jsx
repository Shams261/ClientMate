import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { getLeads, getAgents, getTags } from "../services/api";

// SalesAgentView Component - Displays leads grouped by sales agents with filtering and sorting
function SalesAgentView() {
  const [allLeads, setAllLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Primary filter: which agent to show
  const [selectedAgent, setSelectedAgent] = useState("all");

  // Sub-filters: filter leads within each agent
  const [subFilters, setSubFilters] = useState({
    status: "",
    priority: "",
    tags: "",
  });

  // Sorting: how to order leads within each agent
  const [sortBy, setSortBy] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");

  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadsRes, agentsRes, tagsRes] = await Promise.all([
        getLeads(),
        getAgents(),
        getTags().catch(() => ({ data: [] })),
      ]);

      setAllLeads(leadsRes.data);
      setAgents(agentsRes.data);
      setAvailableTags(tagsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Apply sub-filters to a lead
  const filterLead = (lead) => {
    if (subFilters.status && lead.status !== subFilters.status) {
      return false;
    }
    if (subFilters.priority && lead.priority !== subFilters.priority) {
      return false;
    }
    if (
      subFilters.tags &&
      (!lead.tags || !lead.tags.includes(subFilters.tags))
    ) {
      return false;
    }
    return true;
  };

  // Sort leads based on current sort settings
  const sortLeads = (leads) => {
    return [...leads].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "status":
          // Sort by status order in the sales pipeline
          aValue = statuses.indexOf(a.status);
          bValue = statuses.indexOf(b.status);
          break;
        case "priority":
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case "timeToClose":
          aValue = a.timeToClose;
          bValue = b.timeToClose;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Group leads by agent with filtering and sorting applied
  const getLeadsByAgent = () => {
    const grouped = {};
    agents.forEach((agent) => {
      const agentLeads = allLeads
        .filter((lead) => lead.salesAgent?._id === agent._id)
        .filter(filterLead);

      grouped[agent._id] = {
        agent: agent,
        leads: sortLeads(agentLeads),
      };
    });
    return grouped;
  };

  const leadsByAgent = getLeadsByAgent();

  // Handle sub-filter changes
  const handleSubFilterChange = (e) => {
    const { name, value } = e.target;
    setSubFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Clear all sub-filters
  const clearSubFilters = () => {
    setSubFilters({
      status: "",
      priority: "",
      tags: "",
    });
  };

  // Check if any sub-filters are active
  const hasActiveSubFilters = Object.values(subFilters).some((v) => v);

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

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-3 text-muted">Loading...</span>
      </Container>
    );
  }

  const agentsToShow =
    selectedAgent === "all" ? Object.keys(leadsByAgent) : [selectedAgent];

  // Calculate totals
  const totalFilteredLeads = Object.values(leadsByAgent).reduce(
    (sum, data) => sum + data.leads.length,
    0,
  );

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">
        <i className="bi bi-person-badge me-2"></i>
        Leads by Sales Agent
      </h2>

      {/* Filters Section */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h6 className="mb-0">
            <i className="bi bi-funnel me-2"></i>
            Filters & Sorting
          </h6>
        </Card.Header>
        <Card.Body>
          <Row className="g-3 mb-3">
            {/* Agent Filter (Primary) */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">
                  Select Agent
                </Form.Label>
                <Form.Select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  size="sm"
                >
                  <option value="all">All Agents</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Status Sub-Filter */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">
                  Filter by Status
                </Form.Label>
                <Form.Select
                  name="status"
                  value={subFilters.status}
                  onChange={handleSubFilterChange}
                  size="sm"
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Priority Sub-Filter */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">
                  Filter by Priority
                </Form.Label>
                <Form.Select
                  name="priority"
                  value={subFilters.priority}
                  onChange={handleSubFilterChange}
                  size="sm"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Tags Sub-Filter */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">
                  Filter by Tag
                </Form.Label>
                <Form.Select
                  name="tags"
                  value={subFilters.tags}
                  onChange={handleSubFilterChange}
                  size="sm"
                >
                  <option value="">All Tags</option>
                  {availableTags.map((tag) => (
                    <option key={tag._id} value={tag.name}>
                      {tag.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Clear Filters Button */}
            <Col md="auto" className="d-flex align-items-end">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={clearSubFilters}
                disabled={!hasActiveSubFilters}
              >
                <i className="bi bi-x-circle me-1"></i>
                Clear Filters
              </Button>
            </Col>
          </Row>

          {/* Sorting Controls */}
          <div className="border-top pt-3">
            <Row className="align-items-center">
              <Col xs="auto">
                <Form.Label className="mb-0 small fw-semibold text-muted">
                  Sort leads by:
                </Form.Label>
              </Col>
              <Col xs="auto">
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  size="sm"
                  style={{ width: "auto" }}
                >
                  <option value="status">Status (Pipeline Order)</option>
                  <option value="priority">Priority</option>
                  <option value="timeToClose">Time to Close</option>
                </Form.Select>
              </Col>
              <Col xs="auto">
                <Form.Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  size="sm"
                  style={{ width: "auto" }}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Select>
              </Col>
            </Row>
          </div>

          {/* Active Filters Display */}
          {hasActiveSubFilters && (
            <Alert variant="info" className="py-2 mb-0 mt-3">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <strong className="small">
                  Showing {totalFilteredLeads} of {allLeads.length} leads:
                </strong>
                {subFilters.status && (
                  <Badge
                    bg={getStatusVariant(subFilters.status)}
                    className="fw-normal"
                  >
                    Status: {subFilters.status}
                  </Badge>
                )}
                {subFilters.priority && (
                  <Badge
                    bg={getPriorityVariant(subFilters.priority)}
                    className="fw-normal"
                  >
                    Priority: {subFilters.priority}
                  </Badge>
                )}
                {subFilters.tags && (
                  <Badge bg="warning" text="dark" className="fw-normal">
                    Tag: {subFilters.tags}
                  </Badge>
                )}
              </div>
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Agent Cards */}
      <Row className="g-4">
        {agentsToShow.map((agentId) => {
          const data = leadsByAgent[agentId];
          if (!data) return null;

          return (
            <Col key={agentId} lg={selectedAgent === "all" ? 4 : 12} md={6}>
              <Card className="border-0 shadow-sm h-100">
                {/* Agent Header */}
                <Card.Header className="bg-white">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      {data.agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-0">{data.agent.name}</h5>
                      <small className="text-muted">
                        {data.leads.length} leads
                        {hasActiveSubFilters && (
                          <span className="fst-italic"> (filtered)</span>
                        )}
                      </small>
                    </div>
                    <Badge bg="primary" pill className="fs-6">
                      {data.leads.length}
                    </Badge>
                  </div>
                </Card.Header>

                {/* Leads */}
                <Card.Body
                  style={{
                    maxHeight: selectedAgent === "all" ? "400px" : "none",
                    overflowY: "auto",
                  }}
                >
                  {data.leads.length === 0 ? (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      {hasActiveSubFilters
                        ? "No matching leads"
                        : "No leads assigned"}
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {data.leads.map((lead) => (
                        <Card
                          key={lead._id}
                          className={`border-start border-${getStatusVariant(lead.status)} border-3`}
                        >
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0">{lead.name}</h6>
                              <Badge
                                bg={getStatusVariant(lead.status)}
                                className="fw-normal"
                              >
                                {lead.status}
                              </Badge>
                            </div>

                            {/* Tags display */}
                            {lead.tags && lead.tags.length > 0 && (
                              <div className="d-flex gap-1 flex-wrap mb-2">
                                {lead.tags.map((tag, idx) => (
                                  <Badge
                                    key={idx}
                                    bg="warning"
                                    text="dark"
                                    className="fw-normal"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center">
                              <Badge
                                bg={getPriorityVariant(lead.priority)}
                                className="fw-normal"
                              >
                                {lead.priority}
                              </Badge>
                              <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                {lead.timeToClose} days
                              </small>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default SalesAgentView;
