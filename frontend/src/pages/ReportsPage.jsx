import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  getPipelineReport,
  getClosedByAgentReport,
  getLastWeekReport,
} from "../services/api";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

function ReportsPage() {
  const [pipelineData, setPipelineData] = useState(null);
  const [closedByAgent, setClosedByAgent] = useState([]);
  const [lastWeekLeads, setLastWeekLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [pipeline, closedAgent, lastWeek] = await Promise.all([
        getPipelineReport(),
        getClosedByAgentReport(),
        getLastWeekReport(),
      ]);

      setPipelineData(pipeline.data);
      setClosedByAgent(closedAgent.data);
      setLastWeekLeads(lastWeek.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      alert("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  // Pipeline Chart Data
  const pipelineChartData = pipelineData
    ? {
        labels: pipelineData.breakdown.map((item) => item._id),
        datasets: [
          {
            label: "Number of Leads",
            data: pipelineData.breakdown.map((item) => item.count),
            backgroundColor: [
              "rgba(52, 152, 219, 0.8)",
              "rgba(243, 156, 18, 0.8)",
              "rgba(155, 89, 182, 0.8)",
              "rgba(230, 126, 34, 0.8)",
              "rgba(46, 204, 113, 0.8)",
            ],
            borderColor: [
              "rgba(52, 152, 219, 1)",
              "rgba(243, 156, 18, 1)",
              "rgba(155, 89, 182, 1)",
              "rgba(230, 126, 34, 1)",
              "rgba(46, 204, 113, 1)",
            ],
            borderWidth: 2,
          },
        ],
      }
    : null;

  // Closed by Agent Chart Data
  const closedByAgentChartData =
    closedByAgent.length > 0
      ? {
          labels: closedByAgent.map((item) => item.salesAgent.name),
          datasets: [
            {
              label: "Closed Leads",
              data: closedByAgent.map((item) => item.closedLeadsCount),
              backgroundColor: "rgba(46, 204, 113, 0.8)",
              borderColor: "rgba(46, 204, 113, 1)",
              borderWidth: 2,
            },
          ],
        }
      : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-3 text-muted">Loading reports...</span>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">
        <i className="bi bi-graph-up me-2"></i>
        Reports & Analytics
      </h1>

      {/* Summary Cards */}
      <Row className="g-4 mb-4">
        <Col lg={4} md={6}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <h6 className="text-muted text-uppercase mb-3">
                Total in Pipeline
              </h6>
              <div className="display-3 fw-bold text-primary mb-0">
                {pipelineData?.totalLeadsInPipeline || 0}
              </div>
              <small className="text-muted">Active Leads</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <h6 className="text-muted text-uppercase mb-3">
                Closed Last Week
              </h6>
              <div className="display-3 fw-bold text-success mb-0">
                {lastWeekLeads.length}
              </div>
              <small className="text-muted">Successful Conversions</small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <h6 className="text-muted text-uppercase mb-3">Active Agents</h6>
              <div className="display-3 fw-bold text-warning mb-0">
                {closedByAgent.length}
              </div>
              <small className="text-muted">Sales Team Members</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-4 mb-4">
        {/* Pipeline Status Chart */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <i className="bi bi-funnel me-2"></i>
                Leads by Status (Pipeline)
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: "300px" }}>
                {pipelineChartData && (
                  <Bar data={pipelineChartData} options={chartOptions} />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Closed by Agent Chart */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <i className="bi bi-trophy me-2"></i>
                Closed Leads by Agent
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: "300px" }}>
                {closedByAgentChartData && (
                  <Bar data={closedByAgentChartData} options={chartOptions} />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leads Closed Last Week Table */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">
            <i className="bi bi-calendar-check me-2"></i>
            Leads Closed in Last 7 Days
          </h5>
        </Card.Header>
        <Card.Body>
          {lastWeekLeads.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-3"></i>
              <p>No leads closed in the last week</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Sales Agent</th>
                    <th>Source</th>
                    <th>Closed At</th>
                  </tr>
                </thead>
                <tbody>
                  {lastWeekLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td className="fw-medium">{lead.name}</td>
                      <td>
                        <Badge bg="primary" className="fw-normal">
                          {lead.salesAgent?.name || "N/A"}
                        </Badge>
                      </td>
                      <td>{lead.source}</td>
                      <td>
                        <small className="text-muted">
                          {lead.closedAt
                            ? new Date(lead.closedAt).toLocaleDateString()
                            : "N/A"}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Agent Performance Details */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0">
            <i className="bi bi-award me-2"></i>
            Agent Performance
          </h5>
        </Card.Header>
        <Card.Body>
          {closedByAgent.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-3"></i>
              <p>No closed leads yet</p>
            </div>
          ) : (
            <Row className="g-4">
              {closedByAgent.map((item) => (
                <Col key={item.salesAgent.id} lg={4} md={6}>
                  <Card className="border h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <h5 className="mb-1">{item.salesAgent.name}</h5>
                          <small className="text-muted">
                            <i className="bi bi-envelope me-1"></i>
                            {item.salesAgent.email}
                          </small>
                        </div>
                        <div
                          className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                          style={{
                            width: "50px",
                            height: "50px",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                          }}
                        >
                          {item.closedLeadsCount}
                        </div>
                      </div>
                      <hr />
                      <div>
                        <p className="small fw-semibold mb-2">Closed Leads:</p>
                        <ul className="small text-muted ps-3 mb-0">
                          {item.leads.slice(0, 3).map((lead, idx) => (
                            <li key={idx}>{lead.name}</li>
                          ))}
                          {item.leads.length > 3 && (
                            <li className="fst-italic">
                              +{item.leads.length - 3} more...
                            </li>
                          )}
                        </ul>
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

export default ReportsPage;
