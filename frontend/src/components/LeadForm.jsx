import { useState, useEffect } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { createLead, getAgents } from "../services/api";
import MultiSelectTags from "./MultiSelectTags";
import { useToast } from "../context/ToastContext";

function LeadForm({ onSuccess }) {
  const { showToast } = useToast();
  const [agents, setAgents] = useState([]);
  // Form data state with tags as an array for multi-select
  const [formData, setFormData] = useState({
    name: "",
    source: "Website",
    salesAgent: "",
    status: "New",
    tags: [], // Initialize as empty array taaki multiple tags store kar sake
    timeToClose: 30,
    priority: "Medium",
  });

  // Fetch agents on component mount hook hamne use kiya hai taaki jaise hi component load ho agents ka data fetch ho jaye
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await getAgents();
      setAgents(response.data);
      if (response.data.length > 0) {
        setFormData((prev) => ({ ...prev, salesAgent: response.data[0]._id }));
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for tag changes from MultiSelectTags component
  const handleTagsChange = (newTags) => {
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // tag array ko directly bhej rahe hain kyunki Lead model me ye array hi hai
      const dataToSend = {
        ...formData,
        tags: formData.tags, // Already an array from MultiSelectTags
      };

      await createLead(dataToSend);
      showToast("Lead created successfully!", "success");

      // Reset form
      setFormData({
        name: "",
        source: "Website",
        salesAgent: agents[0]?._id || "",
        status: "New",
        tags: [], // Reset to empty array
        timeToClose: 30,
        priority: "Medium",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating lead:", error);
      showToast(
        "Failed to create lead: " +
          (error.response?.data?.error || error.message),
        "error"
      );
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-plus-circle me-2"></i>
          Create New Lead
        </h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-person me-1"></i>
              Lead Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter lead name"
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <i className="bi bi-globe me-1"></i>
                  Source <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <i className="bi bi-person-badge me-1"></i>
                  Sales Agent <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="salesAgent"
                  value={formData.salesAgent}
                  onChange={handleChange}
                  required
                >
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <i className="bi bi-flag me-1"></i>
                  Status
                </Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Priority
                </Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <i className="bi bi-clock me-1"></i>
                  Time to Close (days) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="timeToClose"
                  value={formData.timeToClose}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* yahan par app tags ka section hai */}
          <Form.Group className="mb-4">
            <Form.Label>
              <i className="bi bi-tags me-1"></i>
              Tags
            </Form.Label>
            <MultiSelectTags
              selectedTags={formData.tags}
              onChange={handleTagsChange}
              allowCreate={true}
            />
            <Form.Text className="text-muted">
              Select existing tags or create new ones
            </Form.Text>
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit" size="lg">
              <i className="bi bi-check-lg me-2"></i>
              Create Lead
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default LeadForm;
