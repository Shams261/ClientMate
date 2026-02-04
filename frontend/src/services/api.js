import axios from "axios";

// Base URL for backend - uses environment variable or defaults to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============ LEADS API ============
export const createLead = (leadData) => api.post("/leads", leadData);
export const getLeads = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`/leads${params ? `?${params}` : ""}`);
};
export const updateLead = (id, leadData) => api.put(`/leads/${id}`, leadData);
export const deleteLead = (id) => api.delete(`/leads/${id}`);

// ============ SALES AGENTS API ============
export const createAgent = (agentData) => api.post("/agents", agentData);
export const getAgents = () => api.get("/agents");

// ============ COMMENTS API ============
export const addComment = (leadId, commentData) =>
  api.post(`/leads/${leadId}/comments`, commentData);
export const getComments = (leadId) => api.get(`/leads/${leadId}/comments`);

// ============ REPORTS API ============
export const getLastWeekReport = () => api.get("/report/last-week");
export const getPipelineReport = () => api.get("/report/pipeline");
export const getClosedByAgentReport = () => api.get("/report/closed-by-agent");

// ============ TAGS API ============
// Tags allow categorizing leads (e.g., "High Value", "Follow-up")
// Having a dedicated Tags API ensures consistency - no typos or duplicates
export const getTags = () => api.get("/tags");
export const createTag = (tagData) => api.post("/tags", tagData);

export default api;
