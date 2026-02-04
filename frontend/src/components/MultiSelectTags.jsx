import { useState, useEffect, useRef } from "react";
import { Badge, Form, Button, ListGroup, Spinner } from "react-bootstrap";
import { getTags, createTag } from "../services/api";

// MultiSelectTags Component - Allows selecting multiple tags with create option
function MultiSelectTags({ selectedTags = [], onChange, allowCreate = true }) {
  const [availableTags, setAvailableTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Fetch tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);
  // Close dropdown on outside click kyun ki ye ek dropdown hai jo open hota hai jab user click karta hai aur close hona chahiye jab user bahar click kare
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup: Always remove event listeners to prevent memory leaks
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await getTags();
      setAvailableTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      // Fallback: If API fails, use some default tags
      // This ensures the component doesn't break completely
      setAvailableTags([
        { _id: "1", name: "High Value" },
        { _id: "2", name: "Follow-up" },
        { _id: "3", name: "Urgent" },
        { _id: "4", name: "New Customer" },
        { _id: "5", name: "Returning Customer" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle tag selection toggle
  // WHY: We pass the tag name (string) instead of ID because the Lead model stores tags as string array
  const handleTagToggle = (tagName) => {
    const newSelection = selectedTags.includes(tagName)
      ? selectedTags.filter((t) => t !== tagName) // Remove if already selected
      : [...selectedTags, tagName]; // Add if not selected

    onChange(newSelection);
  };

  // Handle creating a new tag
  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const response = await createTag({ name: newTagName.trim() });
      // Add to available tags list
      setAvailableTags([...availableTags, response.data]);
      // Auto-select the newly created tag
      onChange([...selectedTags, response.data.name]);
      setNewTagName("");
    } catch (error) {
      console.error("Error creating tag:", error);
      // Check if it's a duplicate tag error
      if (error.response?.status === 409) {
        alert("Tag already exists!");
      } else {
        alert("Failed to create tag");
      }
    }
  };

  // Remove a tag from selection (when clicking X on badge)
  const handleRemoveTag = (tagName, e) => {
    e.stopPropagation(); // Prevent dropdown from opening
    onChange(selectedTags.filter((t) => t !== tagName));
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Selected Tags Display - Shows as clickable badges */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="form-control d-flex flex-wrap align-items-center gap-2"
        style={{
          minHeight: "42px",
          cursor: "pointer",
          backgroundColor: "white",
        }}
      >
        {selectedTags.length === 0 ? (
          <span className="text-muted">Select tags...</span>
        ) : (
          selectedTags.map((tag) => (
            <Badge
              key={tag}
              bg="primary"
              className="d-flex align-items-center gap-1"
              style={{ fontSize: "0.875rem" }}
            >
              {tag}
              <button
                onClick={(e) => handleRemoveTag(tag, e)}
                className="btn-close btn-close-white"
                style={{
                  fontSize: "0.5rem",
                  padding: 0,
                  width: "12px",
                  height: "12px",
                }}
                aria-label="Remove tag"
              />
            </Badge>
          ))
        )}
        {/* Dropdown arrow indicator */}
        <i
          className={`bi bi-chevron-${isOpen ? "up" : "down"} ms-auto text-muted`}
        ></i>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="border rounded shadow-sm bg-white"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" variant="primary" />
              <span className="ms-2 text-muted">Loading tags...</span>
            </div>
          ) : (
            <>
              {/* Tag checkboxes */}
              <ListGroup variant="flush">
                {availableTags.map((tag) => (
                  <ListGroup.Item
                    key={tag._id}
                    action
                    active={selectedTags.includes(tag.name)}
                    onClick={() => handleTagToggle(tag.name)}
                    className="d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <Form.Check
                      type="checkbox"
                      checked={selectedTags.includes(tag.name)}
                      onChange={() => {}}
                      className="me-2"
                      style={{ pointerEvents: "none" }}
                    />
                    <span>{tag.name}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* Create new tag section */}
              {allowCreate && (
                <div className="border-top p-2">
                  <Form onSubmit={handleCreateTag} className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Create new tag..."
                      size="sm"
                    />
                    <Button
                      type="submit"
                      variant="success"
                      size="sm"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <i className="bi bi-plus-lg me-1"></i>
                      Add
                    </Button>
                  </Form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiSelectTags;
