import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Badge,
  Form,
  Card,
  ListGroup,
} from "react-bootstrap";
import {
  getComments,
  addComment,
  updateLead,
  getAgents,
} from "../services/api";
import MultiSelectTags from "./MultiSelectTags";
import { useToast } from "../context/ToastContext";

// Component to display and edit lead details, as well as manage comments
function LeadDetails({ lead, onClose, onUpdate }) {
  const { showToast } = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [agents, setAgents] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [editData, setEditData] = useState({
    name: lead.name,
    source: lead.source,
    salesAgent: lead.salesAgent?._id || "",
    status: lead.status,
    tags: lead.tags || [],
    timeToClose: lead.timeToClose,
    priority: lead.priority,
  });

  useEffect(() => {
    fetchComments();
    fetchAgents();
  }, [lead._id]);

  useEffect(() => {
    if (agents.length > 0 && !commentAuthor) {
      setCommentAuthor(lead.salesAgent?._id || agents[0]._id);
    }
  }, [agents, lead.salesAgent]);

  const fetchComments = async () => {
    try {
      const response = await getComments(lead._id);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await getAgents();
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!commentAuthor) {
      showToast("Please select an agent as the comment author", "warning");
      return;
    }

    try {
      await addComment(lead._id, {
        author: commentAuthor,
        commentText: newComment,
      });
      setNewComment("");
      fetchComments();
      showToast("Comment added successfully!", "success");
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast("Failed to add comment", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...editData,
        tags: editData.tags,
      };
      await updateLead(lead._id, dataToSend);
      showToast("Lead updated successfully!", "success");
      setEditMode(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating lead:", error);
      showToast("Failed to update lead", "error");
    }
  };

  const handleTagsChange = (newTags) => {
    setEditData({ ...editData, tags: newTags });
  };

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

  const getPriorityVariant = (priority) => {
    const variants = {
      High: "danger",
      Medium: "warning",
      Low: "secondary",
    };
    return variants[priority] || "secondary";
  };

  return (
    <Modal show={true} onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title>
          {editMode ? (
            <>
              <i className="bi bi-pencil-square me-2"></i>
              Edit Lead
            </>
          ) : (
            <>
              <i className="bi bi-person-lines-fill me-2"></i>
              {lead.name}
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!editMode ? (
          <>
            {/* View Mode - Lead Details */}
            <Card className="border-0 bg-light mb-4">
              <Card.Body className="p-3">
                <Row className="g-3">
                  <Col xs={6}>
                    <div className="mb-2">
                      <small className="text-muted fw-semibold d-block mb-1">
                        <i className="bi bi-person-badge me-1"></i>
                        Sales Agent
                      </small>
                      <span>{lead.salesAgent?.name || "Unassigned"}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="mb-2">
                      <small className="text-muted fw-semibold d-block mb-1">
                        <i className="bi bi-globe me-1"></i>
                        Source
                      </small>
                      <span>{lead.source}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="mb-2">
                      <small className="text-muted fw-semibold d-block mb-1">
                        <i className="bi bi-flag me-1"></i>
                        Status
                      </small>
                      <Badge
                        bg={getStatusVariant(lead.status)}
                        className="fw-normal"
                      >
                        {lead.status}
                      </Badge>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="mb-2">
                      <small className="text-muted fw-semibold d-block mb-1">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Priority
                      </small>
                      <Badge
                        bg={getPriorityVariant(lead.priority)}
                        className="fw-normal"
                      >
                        {lead.priority}
                      </Badge>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="mb-2">
                      <small className="text-muted fw-semibold d-block mb-1">
                        <i className="bi bi-clock me-1"></i>
                        Time to Close
                      </small>
                      <Badge bg="light" text="dark" className="fw-normal">
                        {lead.timeToClose} days
                      </Badge>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="mb-2">
                      <small className="text-muted fw-semibold d-block mb-1">
                        <i className="bi bi-tags me-1"></i>
                        Tags
                      </small>
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
                          <span className="text-muted">None</span>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Comments Section */}
            <div className="border-top pt-3">
              <h6 className="mb-3">
                <i className="bi bi-chat-left-text me-2"></i>
                Comments <Badge bg="secondary">{comments.length}</Badge>
              </h6>

              <div
                style={{ maxHeight: "200px", overflowY: "auto" }}
                className="mb-3"
              >
                {comments.length === 0 ? (
                  <Card className="bg-light border-0">
                    <Card.Body className="text-center text-muted py-3">
                      <i className="bi bi-chat fs-2 d-block mb-2"></i>
                      No comments yet. Add the first one below.
                    </Card.Body>
                  </Card>
                ) : (
                  <ListGroup variant="flush">
                    {comments.map((comment) => (
                      <ListGroup.Item
                        key={comment._id}
                        className="border-start border-primary border-3 mb-2 bg-light px-3 py-2"
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <strong className="text-primary small">
                            <i className="bi bi-person-circle me-1"></i>
                            {comment.author?.name || "Unknown"}
                          </strong>
                          <small className="text-muted">
                            {new Date(comment.createdAt).toLocaleString()}
                          </small>
                        </div>
                        <p className="mb-0 small">{comment.commentText}</p>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>

              <Form onSubmit={handleAddComment}>
                <Form.Group className="mb-2">
                  <Form.Label className="small fw-semibold">
                    Add Comment
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your comment or update about this lead..."
                  />
                </Form.Group>

                <Row className="g-2 align-items-end">
                  <Col xs={12} sm={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">
                        <i className="bi bi-person-badge me-1"></i>
                        Comment Author
                      </Form.Label>
                      <Form.Select
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        size="sm"
                      >
                        <option value="">Select Agent</option>
                        {agents.map((agent) => (
                          <option key={agent._id} value={agent._id}>
                            {agent.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100"
                      disabled={!newComment.trim() || !commentAuthor}
                    >
                      <i className="bi bi-send me-2"></i>
                      Submit Comment
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </>
        ) : (
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-person me-1"></i>
                Lead Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Row className="mb-3 g-2">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-globe me-1"></i>
                    Source
                  </Form.Label>
                  <Form.Select
                    value={editData.source}
                    onChange={(e) =>
                      setEditData({ ...editData, source: e.target.value })
                    }
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
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-person-badge me-1"></i>
                    Sales Agent
                  </Form.Label>
                  <Form.Select
                    value={editData.salesAgent}
                    onChange={(e) =>
                      setEditData({ ...editData, salesAgent: e.target.value })
                    }
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

            <Row className="mb-3 g-2">
              <Col xs={12} sm={4}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-flag me-1"></i>
                    Status
                  </Form.Label>
                  <Form.Select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Closed">Closed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} sm={4}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    Priority
                  </Form.Label>
                  <Form.Select
                    value={editData.priority}
                    onChange={(e) =>
                      setEditData({ ...editData, priority: e.target.value })
                    }
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} sm={4}>
                <Form.Group>
                  <Form.Label>
                    <i className="bi bi-clock me-1"></i>
                    Time to Close (days)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={editData.timeToClose}
                    onChange={(e) =>
                      setEditData({ ...editData, timeToClose: e.target.value })
                    }
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>
                <i className="bi bi-tags me-1"></i>
                Tags
              </Form.Label>
              <MultiSelectTags
                selectedTags={editData.tags}
                onChange={handleTagsChange}
                allowCreate={true}
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="success" type="submit" size="lg">
                <i className="bi bi-check-lg me-2"></i>
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="outline-secondary"
          onClick={() => setEditMode(!editMode)}
        >
          <i className={`bi ${editMode ? "bi-x-lg" : "bi-pencil"} me-2`}></i>
          {editMode ? "Cancel" : "Edit Lead"}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          <i className="bi bi-x-circle me-2"></i>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LeadDetails;
