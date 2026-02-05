import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Form,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { getLeads, deleteLead, getAgents, getTags } from "../services/api";
import { useSearchParams } from "react-router-dom";
import LeadDetails from "./LeadDetails";

// LeadList Component - Displays list of leads with filtering, sorting, and actions
function LeadList() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLead, setSelectedLead] = useState(null);

  // Filters - now includes tags
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    salesAgent: searchParams.get("salesAgent") || "",
    priority: searchParams.get("priority") || "",
    source: searchParams.get("source") || "",
    tags: searchParams.get("tags") || "", // NEW: Tags filter
  });

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const sortLeads = (leadsToSort) => {
    const sorted = [...leadsToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "timeToClose":
          aValue = a.timeToClose;
          bValue = b.timeToClose;
          break;
        case "priority":
          // Custom priority sorting: High > Medium > Low
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
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

    return sorted;
  };
  const sortedLeads = sortLeads(leads);

  // Fetch leads when URL params change (filters)
  useEffect(() => {
    fetchLeads();
  }, [searchParams]);

  // Fetch agents and tags on mount (for dropdown options)
  useEffect(() => {
    fetchAgents();
    fetchTags();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await getAgents();
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await getTags();
      setAvailableTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      // Fallback tags if API fails
      setAvailableTags([
        { _id: "1", name: "High Value" },
        { _id: "2", name: "Follow-up" },
        { _id: "3", name: "Urgent" },
      ]);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.salesAgent) params.salesAgent = filters.salesAgent;
      if (filters.priority) params.priority = filters.priority;
      if (filters.source) params.source = filters.source;
      if (filters.tags) params.tags = filters.tags;

      const response = await getLeads(params);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      alert("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Update URL with filters
    // WHY: This keeps URL in sync with UI state
    const params = {};
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) params[key] = newFilters[key];
    });
    setSearchParams(params);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await deleteLead(id);
      alert("Lead deleted successfully");
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Failed to delete lead");
    }
  };

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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-3 text-muted">Loading leads...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">
        <i className="bi bi-people-fill me-2"></i>
        All Leads <Badge bg="secondary">{leads.length}</Badge>
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
          <Row className="g-3">
            {/* Status Filter */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">Status</Form.Label>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  size="sm"
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Sales Agent Filter */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">
                  Sales Agent
                </Form.Label>
                <Form.Select
                  name="salesAgent"
                  value={filters.salesAgent}
                  onChange={handleFilterChange}
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

            {/* Priority Filter */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  size="sm"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Source Filter */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">Source</Form.Label>
                <Form.Select
                  name="source"
                  value={filters.source}
                  onChange={handleFilterChange}
                  size="sm"
                >
                  <option value="">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Tags Filter */}
            <Col md>
              <Form.Group>
                <Form.Label className="small text-muted">Tags</Form.Label>
                <Form.Select
                  name="tags"
                  value={filters.tags}
                  onChange={handleFilterChange}
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
          </Row>
        </Card.Body>
      </Card>

      {/* Controls Row */}
      {/* Controls Row - Responsive for mobile */}
      <Row className="mb-3 g-2">
        <Col xs={12} sm="auto" className="mb-2 mb-sm-0">
          <Button
            variant="outline-secondary"
            size="sm"
            className="w-100 w-sm-auto"
            onClick={() => {
              setFilters({
                status: "",
                salesAgent: "",
                priority: "",
                source: "",
                tags: "",
              });
              setSearchParams({});
            }}
          >
            <i className="bi bi-x-circle me-1"></i>
            Clear Filters
          </Button>
        </Col>

        <Col xs={12} sm className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 ms-sm-auto">
          <Form.Label className="mb-1 mb-sm-0 small fw-semibold text-nowrap">Sort by:</Form.Label>
          <div className="d-flex gap-2 flex-grow-1 flex-sm-grow-0">
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="sm"
              className="flex-grow-1"
            >
              <option value="createdAt">Created Date</option>
              <option value="timeToClose">Time to Close</option>
              <option value="priority">Priority</option>
            </Form.Select>
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              size="sm"
              className="flex-grow-1"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </Form.Select>
          </div>
        </Col>
      </Row>

      {/* Active Filters Display */}
      {Object.values(filters).some((f) => f) && (
        <Alert variant="info" className="py-2">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <strong className="small">Active filters:</strong>
            {filters.status && (
              <Badge bg="primary" className="fw-normal">
                Status: {filters.status}
              </Badge>
            )}
            {filters.salesAgent && (
              <Badge bg="info" className="fw-normal">
                Agent:{" "}
                {agents.find((a) => a._id === filters.salesAgent)?.name ||
                  filters.salesAgent}
              </Badge>
            )}
            {filters.priority && (
              <Badge
                bg={getPriorityVariant(filters.priority)}
                className="fw-normal"
              >
                Priority: {filters.priority}
              </Badge>
            )}
            {filters.source && (
              <Badge bg="success" className="fw-normal">
                Source: {filters.source}
              </Badge>
            )}
            {filters.tags && (
              <Badge bg="warning" text="dark" className="fw-normal">
                Tag: {filters.tags}
              </Badge>
            )}
          </div>
        </Alert>
      )}

      {/* Leads Table */}
      <Card className="border-0 shadow-sm">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Lead Name</th>
                <th>Sales Agent</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Source</th>
                <th>Tags</th>
                <th>Time to Close</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No leads found
                  </td>
                </tr>
              ) : (
                sortedLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none fw-semibold"
                        onClick={() => setSelectedLead(lead)}
                      >
                        {lead.name}
                      </Button>
                    </td>
                    <td>
                      {lead.salesAgent?.name || (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(lead.status)}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getPriorityVariant(lead.priority)}>
                        {lead.priority}
                      </Badge>
                    </td>
                    <td>{lead.source}</td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {lead.tags && lead.tags.length > 0 ? (
                          lead.tags.map((tag, idx) => (
                            <Badge
                              key={idx}
                              bg="warning"
                              text="dark"
                              className="fw-normal"
                            >
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge bg="light" text="dark">
                        <i className="bi bi-clock me-1"></i>
                        {lead.timeToClose} days
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(lead._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Lead Details Modal */}
      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={() => {
            setSelectedLead(null);
            fetchLeads();
          }}
        />
      )}
    </div>
  );
}

export default LeadList;
