import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import { getAgents, createAgent } from "../services/api"; // API functions to interact with backend for agents

// AgentsPage Component - Manage sales agents: view list and add new agents
function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await getAgents();
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      alert("Failed to fetch agents");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAgent(formData);
      alert("Agent created successfully!");
      setFormData({ name: "", email: "" });
      setShowForm(false);
      fetchAgents();
    } catch (error) {
      console.error("Error creating agent:", error);
      alert(
        "Failed to create agent: " +
          (error.response?.data?.error || error.message),
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Render the AgentsPage component
  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          <i className="bi bi-people-fill me-2"></i>
          Sales Agents
        </h1>
        <Button
          variant={showForm ? "secondary" : "primary"}
          onClick={() => setShowForm(!showForm)}
        >
          <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} me-2`}></i>
          {showForm ? "Cancel" : "New Agent"}
        </Button>
      </div>

      {/* Add Agent Form */}
      {showForm && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              <i className="bi bi-person-plus-fill me-2"></i>
              Add New Sales Agent
            </h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Agent Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter agent name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="agent@example.com"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" variant="primary" className="w-100">
                <i className="bi bi-check-lg me-2"></i>
                Create Agent
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Agents List */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i>
              All Agents
            </h5>
            <Badge bg="primary" pill className="fs-6">
              {agents.length}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {agents.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-3"></i>
              <p>No agents found. Create your first agent to get started!</p>
            </div>
          ) : (
            <Row className="g-4">
              {agents.map((agent) => (
                <Col key={agent._id} lg={4} md={6} sm={12}>
                  <Card className="h-100 border shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "60px",
                            height: "60px",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                          }}
                        >
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1">{agent.name}</h5>
                          <p className="text-muted mb-0 small">
                            <i className="bi bi-envelope me-1"></i>
                            {agent.email}
                          </p>
                        </div>
                      </div>
                      <div className="border-top pt-3">
                        <small className="text-muted">
                          <i className="bi bi-calendar-check me-2"></i>
                          Joined:{" "}
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AgentsPage;
