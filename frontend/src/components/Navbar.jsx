import { NavLink } from "react-router-dom";
import { Navbar as BsNavbar, Nav, Container } from "react-bootstrap";

// Navbar Component - Main navigation bar for the CRM application
function Navbar() {
  return (
    <BsNavbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container fluid>
        <BsNavbar.Brand as={NavLink} to="/" className="fw-bold">
          <i className="bi bi-building me-2"></i>
          Anvaya CRM
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="navbar-nav" />

        <BsNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
              end
            >
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/leads"
              className={({ isActive }) => (isActive ? "active" : "")}
              end
            >
              <i className="bi bi-people me-1"></i>
              Leads
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/leads/by-status"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="bi bi-kanban me-1"></i>
              By Status
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/leads/by-agent"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="bi bi-person-badge me-1"></i>
              By Agent
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/agents"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="bi bi-person-workspace me-1"></i>
              Agents
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/reports"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <i className="bi bi-bar-chart me-1"></i>
              Reports
            </Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
