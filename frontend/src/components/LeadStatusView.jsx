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

// LeadStatusView Component - Displays leads grouped by status with filtering options
function LeadStatusView() {
  const [allLeads, setAllLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Primary filter: which status columns to show
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Sub-filters: filter within each status column
  const [subFilters, setSubFilters] = useState({
    salesAgent: "",
    priority: "",
    tags: "",
  });

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
        getTags().catch(() => ({ data: [] })), // Graceful fallback if tags API fails
      ]);

      setAllLeads(leadsRes.data);
      setAgents(agentsRes.data);
      setAvailableTags(tagsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  // Apply sub-filters to leads
  const getFilteredLeads = () => {
    return allLeads.filter((lead) => {
      // Agent filter
      if (
        subFilters.salesAgent &&
        lead.salesAgent?._id !== subFilters.salesAgent
      ) {
        return false;
      }
      // Priority filter
      if (subFilters.priority && lead.priority !== subFilters.priority) {
        return false;
      }
      // Tags filter - check if lead has the selected tag
      if (
        subFilters.tags &&
        (!lead.tags || !lead.tags.includes(subFilters.tags))
      ) {
        return false;
      }
      return true;
    });
  };

  // Group filtered leads by status
  const getLeadsByStatus = () => {
    const filteredLeads = getFilteredLeads();
    const grouped = {};
    statuses.forEach((status) => {
      grouped[status] = filteredLeads.filter((lead) => lead.status === status);
    });
    return grouped;
  };

  const leadsByStatus = getLeadsByStatus();

  // Handle sub-filter changes
  const handleSubFilterChange = (e) => {
    const { name, value } = e.target;
    setSubFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Clear all sub-filters
  const clearSubFilters = () => {
    setSubFilters({
      salesAgent: "",
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

  const statusToShow = selectedStatus === "all" ? statuses : [selectedStatus];

  // Calculate total filtered leads
  const totalFilteredLeads = Object.values(leadsByStatus).reduce(
    (sum, leads) => sum + leads.length,
    0,
  );

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">
        <i className="bi bi-kanban me-2"></i>
        Leads by Status
      </h2>

      {/* Filters Section */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h6 className="mb-0">
            <i className="bi bi-funnel me-2"></i>
            Filters
          </h6>
        </Card.Header>
        <Card.Body>
          <Row className="g-3 mb-3">
            {/* Status Filter (Primary) */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">
                  Status View
                </Form.Label>
                <Form.Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  size="sm"
                >
                  <option value="all">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Agent Sub-Filter */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">
                  Filter by Agent
                </Form.Label>
                <Form.Select
                  name="salesAgent"
                  value={subFilters.salesAgent}
                  onChange={handleSubFilterChange}
                  size="sm"
                >
                  <option value="">All Agents</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
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

          {/* Active Filters Display */}
          {hasActiveSubFilters && (
            <Alert variant="info" className="py-2 mb-0">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <strong className="small">
                  Showing {totalFilteredLeads} of {allLeads.length} leads:
                </strong>
                {subFilters.salesAgent && (
                  <Badge bg="info" className="fw-normal">
                    Agent:{" "}
                    {agents.find((a) => a._id === subFilters.salesAgent)?.name}
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

      {/* Status Columns - Kanban Style */}
      <Row className="g-4">
        {statusToShow.map((status) => (
          <Col key={status} lg={selectedStatus === "all" ? true : 12}>
            <Card className="border-0 shadow-sm h-100">
              {/* Column Header */}
              <Card.Header
                className={`bg-${getStatusVariant(status)} bg-opacity-10 border-bottom border-${getStatusVariant(status)} border-3`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className={`mb-0 text-${getStatusVariant(status)}`}>
                    <i className="bi bi-collection me-2"></i>
                    {status}
                  </h5>
                  <Badge bg={getStatusVariant(status)} pill>
                    {leadsByStatus[status]?.length || 0}
                  </Badge>
                </div>
              </Card.Header>

              {/* Lead Cards */}
              <Card.Body
                style={{
                  maxHeight: selectedStatus === "all" ? "400px" : "none",
                  overflowY: "auto",
                }}
              >
                {leadsByStatus[status]?.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No leads
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {leadsByStatus[status]?.map((lead) => (
                      <Card
                        key={lead._id}
                        className={`border-start border-${getStatusVariant(status)} border-3`}
                      >
                        <Card.Body className="p-3">
                          <h6 className="mb-1">{lead.name}</h6>
                          <small className="text-muted d-block mb-2">
                            <i className="bi bi-person-badge me-1"></i>
                            {lead.salesAgent?.name || "Unassigned"}
                          </small>

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
        ))}
      </Row>
    </Container>
  );
}

export default LeadStatusView;
