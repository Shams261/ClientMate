# 🤝 ClientMate CRM

<div align="center">

![ClientMate CRM](https://img.shields.io/badge/ClientMate-CRM-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**A Modern Customer Relationship Management System for Lead Tracking & Sales Pipeline Management**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Architecture](#-architecture) • [API Docs](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Data Flow Diagrams](#-data-flow-diagrams)
- [Database Schema](#-database-schema)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

---

## 🎯 Overview

**ClientMate CRM** is a full-stack web application designed to streamline sales operations by providing a centralized platform for managing leads, tracking sales pipelines, and monitoring team performance. Built with modern technologies, it offers an intuitive interface for sales teams to efficiently manage their customer relationships.

### Why ClientMate?

- 📊 **Visual Pipeline Management** - Track leads through customizable sales stages
- 👥 **Team Collaboration** - Assign leads to sales agents and monitor workload
- 🏷️ **Smart Tagging System** - Categorize and filter leads with custom tags
- 📈 **Real-time Analytics** - Generate reports on pipeline health and agent performance
- 🎨 **Modern UI/UX** - Responsive design with Bootstrap 5 components
- 🚀 **Fast & Scalable** - Built with React, Node.js, and MongoDB

---

## ✨ Features

### Core Functionality

#### 🎯 Lead Management

- ✅ Create, Read, Update, Delete (CRUD) operations for leads
- ✅ Assign leads to sales agents
- ✅ Track lead status through pipeline stages: `New → Contacted → Qualified → Proposal Sent → Closed`
- ✅ Set priority levels (High, Medium, Low)
- ✅ Estimate time to close for forecasting
- ✅ Add multiple tags for categorization

#### 👨‍💼 Sales Agent Management

- ✅ Manage sales team members
- ✅ View agent workload and lead distribution
- ✅ Track agent performance and closed deals

#### 📊 Reporting & Analytics

- ✅ **Pipeline Report** - Visualize leads by status
- ✅ **Agent Performance** - Track closed deals per agent
- ✅ **Weekly Activity** - Monitor leads closed in last 7 days
- ✅ **Interactive Charts** - Bar and Pie charts with Chart.js

#### 🏷️ Tag System

- ✅ Create custom tags (e.g., "High Value", "Follow-up", "VIP")
- ✅ Multi-select tag assignment
- ✅ Filter and search by tags
- ✅ Consistent tag management across the system

#### 🎨 Views & Filters

- ✅ **Lead Status View** - Group leads by pipeline stage (Kanban-style)
- ✅ **Sales Agent View** - Group leads by assigned agent
- ✅ **Advanced Filtering** - Filter by status, priority, tags, and source
- ✅ **Sorting** - Sort by various criteria (status, priority, time to close)

---

## 🛠️ Tech Stack

### Frontend

```
⚛️  React 19.2.0          - UI Library
🎨  Bootstrap 5.3.8       - CSS Framework
🔷  React Bootstrap 2.10  - React Components
🎭  React Router 7.13     - Client-side Routing
📊  Chart.js 4.5          - Data Visualization
🔥  React Icons 5.5       - Icon Library
📡  Axios 1.13            - HTTP Client
⚡  Vite 5.1              - Build Tool
```

### Backend

```
🟢  Node.js               - Runtime Environment
🚂  Express.js            - Web Framework
🍃  MongoDB               - NoSQL Database
🔗  Mongoose              - ODM for MongoDB
🔐  CORS                  - Cross-Origin Resource Sharing
🌐  dotenv                - Environment Variables
```

### DevOps & Deployment

```
🚀  Vercel                - Frontend Hosting
🌐  Render                - Backend Hosting
📦  npm                   - Package Manager
🔧  Git                   - Version Control
```

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React SPA (Vite)                        │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┬─────────┐  │  │
│  │  │Dashboard │  Leads   │ Agents   │ Reports  │ Views   │  │  │
│  │  └──────────┴──────────┴──────────┴──────────┴─────────┘  │  │
│  │                                                             │  │
│  │  Components:                                                │  │
│  │  • LeadForm, LeadList, LeadDetails                         │  │
│  │  • MultiSelectTags, Navbar                                 │  │
│  │  • SalesAgentView, LeadStatusView                          │  │
│  │  • Reports (Charts & Analytics)                            │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (Axios)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API LAYER (Express.js)                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      Routes & Controllers                  │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┬─────────┐  │  │
│  │  │ /leads   │ /agents  │ /tags    │ /report  │ /health │  │  │
│  │  └──────────┴──────────┴──────────┴──────────┴─────────┘  │  │
│  │                                                             │  │
│  │  Middleware:                                                │  │
│  │  • CORS • JSON Parser • Error Handler                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER (MongoDB)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                        Collections                         │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┐            │  │
│  │  │  leads   │  agents  │   tags   │ comments │            │  │
│  │  └──────────┴──────────┴──────────┴──────────┘            │  │
│  │                                                             │  │
│  │  Indexes: _id, salesAgent, status, tags, createdAt        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture (Frontend)

```
src/
├── pages/                  # Route-level components
│   ├── Dashboard.jsx       # Main dashboard with metrics
│   ├── LeadsPage.jsx       # Lead management page
│   ├── AgentsPage.jsx      # Sales agent management
│   └── ReportsPage.jsx     # Analytics & reports
│
├── components/             # Reusable components
│   ├── Navbar.jsx          # Navigation bar
│   ├── LeadForm.jsx        # Create/Edit lead form
│   ├── LeadList.jsx        # Tabular lead display
│   ├── LeadDetails.jsx     # Detailed lead view
│   ├── LeadStatusView.jsx  # Pipeline/Kanban view
│   ├── SalesAgentView.jsx  # Agent workload view
│   ├── MultiSelectTags.jsx # Tag selector component
│   └── Reports.jsx         # Chart components
│
├── services/               # API integration
│   └── api.js              # Axios HTTP client
│
└── App.jsx                 # Root component with routing
```

---

## 📊 Data Flow Diagrams

### 1. Lead Creation Flow (DFD Level 0)

```
┌─────────────┐
│    User     │
│ (Sales Rep) │
└──────┬──────┘
       │
       │ 1. Fill Lead Form
       ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  ┌──────────────────────────────┐   │
│  │       LeadForm.jsx           │   │
│  │  • Validate Input            │   │
│  │  • Select Sales Agent        │   │
│  │  • Choose Tags               │   │
│  └──────────┬───────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ 2. POST /leads
              │    { name, source, salesAgent,
              │      status, tags, priority... }
              ▼
┌─────────────────────────────────────┐
│      Backend (Express + Node)       │
│  ┌──────────────────────────────┐   │
│  │   leadController.createLead   │   │
│  │  • Validate ObjectId          │   │
│  │  • Check Agent exists         │   │
│  │  • Create Lead document       │   │
│  └──────────┬───────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ 3. db.leads.insertOne()
              ▼
┌─────────────────────────────────────┐
│         MongoDB Database            │
│  ┌──────────────────────────────┐   │
│  │      Leads Collection         │   │
│  │  { _id, name, source,         │   │
│  │    salesAgent (ObjectId),     │   │
│  │    status, tags[], priority,  │   │
│  │    timeToClose, createdAt }   │   │
│  └──────────┬───────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ 4. Return Created Lead
              ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  • Show Success Message             │
│  • Refresh Lead List                │
│  • Reset Form                       │
└─────────────────────────────────────┘
```

### 2. Lead Filtering & Viewing Flow (DFD Level 1)

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ 1. Select Filters
       │    (Status, Priority, Tags, Agent)
       ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  ┌──────────────────────────────┐   │
│  │   LeadList / LeadStatusView   │   │
│  │  • Build Query Params         │   │
│  └──────────┬───────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ 2. GET /leads?status=New&tags=High Value
              ▼
┌─────────────────────────────────────┐
│      Backend (Express)              │
│  ┌──────────────────────────────┐   │
│  │    leadController.getLeads    │   │
│  │  • Parse Query Params         │   │
│  │  • Build MongoDB Filter       │   │
│  │  • Apply Sorting              │   │
│  └──────────┬───────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ 3. db.leads.find({ status: "New",
              │                    tags: { $in: ["High Value"] } })
              │                  .populate("salesAgent")
              ▼
┌─────────────────────────────────────┐
│         MongoDB Database            │
│  • Execute Query with Filters       │
│  • Join with Agents Collection      │
│  • Return Matching Documents        │
└─────────────┬───────────────────────┘
              │
              │ 4. Return Filtered Leads
              ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  • Render Lead Cards/Table          │
│  • Group by Status/Agent            │
│  • Show Applied Filters             │
└─────────────────────────────────────┘
```

### 3. Tag Management Flow (DFD Level 1)

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ 1. Click Tags Dropdown
       ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  ┌──────────────────────────────┐   │
│  │    MultiSelectTags.jsx        │   │
│  │  • Open Dropdown              │   │
│  └──────────┬───────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ 2. GET /tags
              ▼
┌─────────────────────────────────────┐
│      Backend (Express)              │
│  ┌──────────────────────────────┐   │
│  │   tagController.getAllTags    │   │
│  └──────────┬───────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ 3. db.tags.find().sort({ name: 1 })
              ▼
┌─────────────────────────────────────┐
│         MongoDB Database            │
│  • Return All Tags                  │
│  • Sorted Alphabetically            │
└─────────────┬───────────────────────┘
              │
              │ 4. Return Tag List
              │    [{ _id, name }, ...]
              ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  • Display Tags as Checkboxes       │
│  • Show Selected Tags as Badges     │
│  • Provide "Create New Tag" Option  │
└─────────────┬───────────────────────┘
              │
              │ 5. User Creates New Tag
              │    "VIP Customer"
              ▼
┌─────────────────────────────────────┐
│      Backend (Express)              │
│  ┌──────────────────────────────┐   │
│  │   tagController.createTag     │   │
│  │  • Validate Unique Name       │   │
│  └──────────┬───────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ 6. db.tags.insertOne({ name: "VIP Customer" })
              ▼
┌─────────────────────────────────────┐
│         MongoDB Database            │
│  • Create New Tag                   │
│  • Enforce Unique Constraint        │
└─────────────┬───────────────────────┘
              │
              │ 7. Return Created Tag
              ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  • Add to Tag List                  │
│  • Auto-select New Tag              │
│  • Show as Badge                    │
└─────────────────────────────────────┘
```

### 4. Analytics & Reporting Flow

```
┌─────────────┐
│ Sales Manager│
└──────┬──────┘
       │
       │ 1. Navigate to Reports
       ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  ┌──────────────────────────────┐   │
│  │       ReportsPage.jsx         │   │
│  │  • Fetch All Reports          │   │
│  └──────────┬───────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ 2. Parallel API Calls:
              │    GET /report/pipeline
              │    GET /report/closed-by-agent
              │    GET /report/last-week
              ▼
┌─────────────────────────────────────┐
│      Backend (Express)              │
│  ┌──────────────────────────────┐   │
│  │  Report Controller Methods    │   │
│  │                               │   │
│  │  • getPipelineReport()        │   │
│  │    - Count leads by status    │   │
│  │                               │   │
│  │  • getClosedByAgentReport()   │   │
│  │    - Group closed by agent    │   │
│  │                               │   │
│  │  • getLastWeekReport()        │   │
│  │    - Filter by closedAt date  │   │
│  └──────────┬───────────────────┘   │
└─────────────┼───────────────────────┘
              │
              │ 3. MongoDB Aggregation Queries
              │    - $group by status
              │    - $match { status: "Closed" }
              │    - $match { closedAt: { $gte: lastWeek } }
              ▼
┌─────────────────────────────────────┐
│         MongoDB Database            │
│  • Aggregate Pipeline Execution     │
│  • Statistical Calculations         │
│  • Return Computed Results          │
└─────────────┬───────────────────────┘
              │
              │ 4. Return Report Data
              ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  • Render Chart.js Visualizations   │
│  • Display Summary Cards            │
│  • Show Recent Activity Table       │
│  • Agent Performance Metrics        │
└─────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────┐
│           SalesAgent                │
├─────────────────────────────────────┤
│ _id: ObjectId (PK)                  │
│ name: String (required)             │
│ email: String (required)            │
│ createdAt: Date                     │
└───────────────┬─────────────────────┘
                │
                │ 1:N (One agent has many leads)
                │
                ▼
┌─────────────────────────────────────┐
│              Lead                   │
├─────────────────────────────────────┤
│ _id: ObjectId (PK)                  │
│ name: String (required)             │
│ source: Enum (required)             │
│   ["Website", "Referral",           │
│    "Cold Call", "Advertisement",    │
│    "Email", "Other"]                │
│ salesAgent: ObjectId (FK) ──────────┼──> SalesAgent._id
│ status: Enum (required)             │
│   ["New", "Contacted",              │
│    "Qualified", "Proposal Sent",    │
│    "Closed"]                        │
│ tags: [String]                      │ ─┐
│ timeToClose: Number (days)          │  │ M:N (Many-to-Many)
│ priority: Enum                      │  │ (Array of strings)
│   ["High", "Medium", "Low"]         │  │
│ createdAt: Date                     │  │
│ updatedAt: Date                     │  │
│ closedAt: Date (optional)           │  │
└─────────────────────────────────────┘  │
                                         │
                                         │
                ┌────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│              Tag                    │
├─────────────────────────────────────┤
│ _id: ObjectId (PK)                  │
│ name: String (unique, required)     │
│ createdAt: Date                     │
└─────────────────────────────────────┘
```

### Collection Details

#### **1. Leads Collection**

```javascript
{
  _id: ObjectId("..."),
  name: "Acme Corp",
  source: "Website",
  salesAgent: ObjectId("..."),  // Reference to SalesAgent
  status: "Qualified",
  tags: ["High Value", "Urgent", "Decision Maker"],
  timeToClose: 30,  // days
  priority: "High",
  createdAt: ISODate("2026-02-01T..."),
  updatedAt: ISODate("2026-02-03T..."),
  closedAt: null
}
```

**Indexes:**

- `_id` (Primary)
- `salesAgent` (Foreign Key, for filtering by agent)
- `status` (For pipeline queries)
- `createdAt` (For sorting)

#### **2. SalesAgents Collection**

```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  createdAt: ISODate("2026-01-15T...")
}
```

**Indexes:**

- `_id` (Primary)
- `email` (For lookups)

#### **3. Tags Collection**

```javascript
{
  _id: ObjectId("..."),
  name: "High Value",
  createdAt: ISODate("2026-01-10T...")
}
```

**Indexes:**

- `_id` (Primary)
- `name` (Unique constraint)

---

## 🚀 Installation & Setup

### Prerequisites

```bash
Node.js >= 18.x
npm >= 9.x
MongoDB >= 6.x
Git
```

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/clientmate-crm.git
cd clientmate-crm
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/clientmate-crm
NODE_ENV=development
```

**Start MongoDB** (if running locally):

```bash
# macOS/Linux
mongod

# Or with Homebrew
brew services start mongodb-community
```

**Seed Initial Data:**

```bash
# Seed tags
node seedTags.js
```

**Start Backend Server:**

```bash
npm start
# Server runs on http://localhost:3000
```

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to `.env`:

```env
VITE_API_URL=http://localhost:3000
```

**Start Frontend Dev Server:**

```bash
npm run dev
# App runs on http://localhost:5173
```

### 4️⃣ Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:3000
Production: https://clientmate-p6q4.onrender.com
```

### Authentication

Currently, the API does not require authentication. (Future enhancement)

---

### 🎯 Leads Endpoints

#### **Create Lead**

```http
POST /leads
Content-Type: application/json

{
  "name": "Acme Corporation",
  "source": "Website",
  "salesAgent": "65a1b2c3d4e5f6789abcdef0",
  "status": "New",
  "tags": ["High Value", "Urgent"],
  "timeToClose": 30,
  "priority": "High"
}
```

**Response (201 Created):**

```json
{
  "_id": "65a1b2c3d4e5f6789abcdef1",
  "name": "Acme Corporation",
  "source": "Website",
  "salesAgent": {
    "_id": "65a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "status": "New",
  "tags": ["High Value", "Urgent"],
  "timeToClose": 30,
  "priority": "High",
  "createdAt": "2026-02-03T10:30:00.000Z",
  "updatedAt": "2026-02-03T10:30:00.000Z"
}
```

#### **Get All Leads (with filtering)**

```http
GET /leads?status=New&priority=High&tags=Urgent&salesAgent=65a1b2c3d4e5f6789abcdef0
```

**Response (200 OK):**

```json
[
  {
    "_id": "65a1b2c3d4e5f6789abcdef1",
    "name": "Acme Corporation",
    "source": "Website",
    "salesAgent": {
      /* populated agent data */
    },
    "status": "New",
    "tags": ["High Value", "Urgent"],
    "timeToClose": 30,
    "priority": "High",
    "createdAt": "2026-02-03T10:30:00.000Z"
  }
]
```

#### **Update Lead**

```http
PUT /leads/:id
Content-Type: application/json

{
  "status": "Qualified",
  "tags": ["High Value", "Urgent", "Decision Maker"]
}
```

#### **Delete Lead**

```http
DELETE /leads/:id
```

---

### 👥 Sales Agents Endpoints

#### **Create Agent**

```http
POST /agents
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

#### **Get All Agents**

```http
GET /agents
```

**Response:**

```json
[
  {
    "_id": "65a1b2c3d4e5f6789abcdef0",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-15T08:00:00.000Z"
  }
]
```

---

### 🏷️ Tags Endpoints

#### **Get All Tags**

```http
GET /tags
```

**Response:**

```json
[
  {
    "_id": "65a1b2c3d4e5f6789abcdef2",
    "name": "High Value",
    "createdAt": "2026-01-10T12:00:00.000Z"
  },
  {
    "_id": "65a1b2c3d4e5f6789abcdef3",
    "name": "Follow-up",
    "createdAt": "2026-01-10T12:01:00.000Z"
  }
]
```

#### **Create Tag**

```http
POST /tags
Content-Type: application/json

{
  "name": "VIP Customer"
}
```

---

### 📊 Reports Endpoints

#### **Pipeline Report**

```http
GET /report/pipeline
```

**Response:**

```json
{
  "totalLeadsInPipeline": 45,
  "breakdown": [
    { "_id": "New", "count": 12 },
    { "_id": "Contacted", "count": 8 },
    { "_id": "Qualified", "count": 15 },
    { "_id": "Proposal Sent", "count": 10 }
  ]
}
```

#### **Closed Leads by Agent**

```http
GET /report/closed-by-agent
```

**Response:**

```json
[
  {
    "salesAgent": {
      "_id": "65a1b2c3d4e5f6789abcdef0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "closedLeadsCount": 15,
    "leads": [
      { "_id": "...", "name": "Lead 1" },
      { "_id": "...", "name": "Lead 2" }
    ]
  }
]
```

#### **Last Week Activity**

```http
GET /report/last-week
```

**Response:**

```json
[
  {
    "_id": "65a1b2c3d4e5f6789abcdef1",
    "name": "Acme Corporation",
    "salesAgent": {
      /* populated */
    },
    "source": "Website",
    "closedAt": "2026-02-01T14:30:00.000Z"
  }
]
```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Push code to GitHub**
2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
3. **Configure Environment Variables**
   - `VITE_API_URL`: `https://clientmate-p6q4.onrender.com`
4. **Deploy** 🚀

The `vercel.json` configuration is already set up.

### Backend Deployment (Render)

1. **Create new Web Service** on [render.com](https://render.com)
2. **Connect GitHub repository**
3. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     PORT=3000
     NODE_ENV=production
     ```
4. **Deploy** 🚀

### Database (MongoDB Atlas)

1. Create account on [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Create database user
4. Whitelist IP addresses (or allow all: `0.0.0.0/0`)
5. Get connection string and add to backend ENV

---

## 📂 Project Structure

```
clientmate-crm/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── leadController.js    # Lead CRUD logic
│   │   │   ├── salesAgentController.js
│   │   │   ├── tagController.js
│   │   │   └── reportController.js  # Analytics logic
│   │   ├── models/
│   │   │   ├── Lead.js              # Lead schema
│   │   │   ├── SalesAgent.js        # Agent schema
│   │   │   └── Tag.js               # Tag schema
│   │   ├── routes/
│   │   │   ├── leadRoutes.js        # Lead endpoints
│   │   │   ├── salesAgentRoutes.js
│   │   │   ├── tagRoutes.js
│   │   │   └── reportRoutes.js
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Server entry point
│   ├── seedTags.js                  # Seed script for tags
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg              # App favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── LeadForm.jsx         # Create/edit form
│   │   │   ├── LeadList.jsx         # Table view
│   │   │   ├── LeadDetails.jsx      # Detail modal
│   │   │   ├── LeadStatusView.jsx   # Pipeline view
│   │   │   ├── SalesAgentView.jsx   # Agent workload
│   │   │   ├── MultiSelectTags.jsx  # Tag selector
│   │   │   ├── Navbar.jsx           # Navigation
│   │   │   └── Reports.jsx          # Charts
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── LeadsPage.jsx        # Lead management
│   │   │   ├── AgentsPage.jsx       # Agent management
│   │   │   └── ReportsPage.jsx      # Analytics page
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── App.jsx                  # Root component
│   │   ├── App.css                  # Custom styles
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── vercel.json                  # Vercel config
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── README.md                        # This file
```

---

## 🎨 UI/UX Features

### Modern Design Elements

- ✅ **Bootstrap 5** - Professional, responsive UI
- ✅ **Bootstrap Icons** - 1000+ scalable vector icons
- ✅ **Responsive Grid** - Mobile-first design
- ✅ **Shadow Effects** - Modern card elevation
- ✅ **Color-coded Status** - Visual status indicators
- ✅ **Interactive Charts** - Chart.js visualizations
- ✅ **Loading States** - Skeleton screens and spinners
- ✅ **Form Validation** - Real-time input validation
- ✅ **Toast Notifications** - User feedback messages

### Key UI Components

1. **Dashboard Cards** - Metric summaries with icons
2. **Kanban Board** - Drag-and-drop pipeline view (Status View)
3. **Data Tables** - Sortable, filterable lead tables
4. **Modal Forms** - Create/edit without page reload
5. **Dropdown Filters** - Multi-select with badges
6. **Chart Widgets** - Bar, Pie, Line charts
7. **Agent Cards** - Visual workload distribution

---

## 🔐 Security Considerations

### Current Implementation

- ✅ CORS enabled for cross-origin requests
- ✅ Input validation on backend
- ✅ MongoDB ObjectId validation
- ✅ Environment variables for sensitive data

### Future Enhancements

- 🔲 JWT-based authentication
- 🔲 Role-based access control (Admin, Manager, Sales Rep)
- 🔲 Rate limiting on API endpoints
- 🔲 Password hashing for user accounts
- 🔲 HTTPS enforcement
- 🔲 SQL injection prevention (already handled by Mongoose)
- 🔲 XSS protection middleware

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create new lead with all fields
- [ ] Update lead status through pipeline
- [ ] Filter leads by status, priority, tags
- [ ] Assign lead to different agent
- [ ] Create and assign new tags
- [ ] View reports and verify data accuracy
- [ ] Test responsive design on mobile
- [ ] Verify data persistence after server restart

### Future Automated Testing

```bash
# Backend (Jest + Supertest)
npm test

# Frontend (Vitest + Testing Library)
npm run test:ui
```

---

## 🐛 Known Issues & Future Enhancements

### Known Issues

- None at the moment 🎉

### Planned Features

#### Short-term (v1.1)

- [ ] User authentication & authorization
- [ ] Email notifications for lead assignments
- [ ] Activity timeline for leads
- [ ] Bulk lead import (CSV)
- [ ] Advanced search with multiple criteria
- [ ] Lead score calculation

#### Long-term (v2.0)

- [ ] Mobile app (React Native)
- [ ] Integration with email providers (Gmail, Outlook)
- [ ] Calendar integration for meetings
- [ ] AI-powered lead scoring
- [ ] Automated workflow triggers
- [ ] Custom fields for leads
- [ ] Document attachments
- [ ] Team collaboration features (notes, @mentions)
- [ ] Export reports to PDF/Excel

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- Use **ES6+** syntax
- Follow **Airbnb JavaScript Style Guide**
- Write descriptive commit messages
- Add comments for complex logic
- Update documentation when needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Acknowledgments

### Created By

**Shams Tabrez**

- GitHub: [@shamstabrez](https://github.com/Shams261)
- Email: shamsshoaib261@gmail.com

### Acknowledgments

- [React](https://react.dev/) - UI Library
- [Bootstrap](https://getbootstrap.com/) - CSS Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Express.js](https://expressjs.com/) - Backend Framework
- [Chart.js](https://www.chartjs.org/) - Data Visualization
- [Vercel](https://vercel.com/) - Frontend Hosting
- [Render](https://render.com/) - Backend Hosting

---

## 📞 Support

For issues, questions, or suggestions:

- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/Shams261/clientmate-crm/issues)
- 📖 Docs: [GitHub Wiki](https://github.com/Shams261/clientmate-crm/wiki)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Shams Tabrez](https://github.com/Shams261)

[⬆ Back to Top](#-clientmate-crm)

</div>
