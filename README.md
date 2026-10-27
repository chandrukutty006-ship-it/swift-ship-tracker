# 🚢 Swift Ship Tracker - Live Cargo & Marine Vessel Tracking System

> **Final Year Project (FYP)**: Full-Stack Web Application for Real-Time Multimodal Consignment Telemetry, Live Map Navigation, Autonomous GPS Route Simulation, Intelligent ETA Estimation, and Multimodal Bills of Lading.

---

## 📌 Executive Summary

**Swift Ship Tracker** is an end-to-end, production-ready logistics and vessel telemetry platform. It bridges the gap between traditional supply chain management and live IoT telemetry by providing:
1. **Public Consignment Tracking**: Instant lookups by Tracking ID with OpenStreetMap waypoints, real-time ship movements, and milestone checkpoints without requiring sign-in.
2. **Autonomous GPS Simulation Engine**: A background worker that moves in-transit cargo along maritime shipping lanes every few seconds, recalculating real-time coordinates, remaining nautical miles, and dynamic ETAs without needing physical transponders.
3. **Role-Based Portals**:
   - **Admin**: Full consignment lifecycle control, fleet vessel commissioning, simulator speed controls, CSV reporting, and tamper-evident audit logs.
   - **Customer**: Dedicated consignment ledger, live notifications, bill of lading PDF generation, and mobile-scannable QR codes.
   - **Public Visitor**: Clean, instantaneous live tracking interface.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v7, Lucide Icons | Blazing fast client rendering, reactive UI state, and responsive dark/light maritime theme. |
| **Maps & Telemetry** | Leaflet, React-Leaflet, OpenStreetMap | 100% free, zero API key friction, custom SVG radar markers and animated polylines. |
| **Backend** | Node.js, Express.js | Robust REST API, modular controller-service architecture, Helmet security, rate limiting, and CORS. |
| **Database** | SQLite via `sql.js` (WebAssembly SQLite) | Zero native C++ compilation setup required; runs natively on Windows, Linux, and macOS with file persistence. |
| **Real-Time** | Socket.IO (Server & Client) | Sub-second bidirectional WebSocket pushes for live vessel movement, room broadcasting, and instant alert pings. |
| **Analytics & Reports** | Recharts, jsPDF, jspdf-autotable, qrcode.react | Visual analytics charts, instant mobile QR code generation, and official client-side PDF bills of lading. |
| **Security** | JSON Web Tokens (JWT), bcryptjs password hashing | Stateless Bearer token authentication and role-based route middleware. |

---

## 🚀 Quick Start Guide (Zero-Setup in 2 Commands)

### Prerequisites
- Node.js (v18+) and npm installed.

### Step 1: Install Dependencies
Run the following from the root workspace directory:
```bash
npm run install:all
```
*(This automatically installs packages for both root, backend, and frontend)*

### Step 2: Seed Demo Database
Populate 1 Admin, 2 Customers, 5 Fleet Vessels, and 20 realistic global shipments:
```bash
npm run seed
```

### Step 3: Run the Full Application
Spin up both the Express Backend (Port 5000) and the React Vite Frontend (Port 5173) concurrently:
```bash
npm run dev
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔑 Demo Credentials & Quick Access

The application includes one-click role selector buttons on the Login Page (`/login`) for viva presentations:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@swift.com` | `Admin@123` | Full system control, consignment CRUD, simulator controls, vessel fleet, audit trail, email logs. |
| **Customer 1** | `customer1@swift.com` | `Customer@123` | View personal consignments (Pacific Rim Electronics), track live cargo, generate PDF receipts. |
| **Customer 2** | `customer2@swift.com` | `Customer@123` | View personal consignments (Zenith Maritime Trading), receive delay notices, QR codes. |
| **Public Visitor** | *(No Login)* | *(No Login)* | Search and track any shipment by ID (e.g. `SST-CHNSIN01`). |

---

## 📦 Sample Tracking IDs for Demonstration

| Tracking ID | Route | Vessel | Cargo Type | Status / Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **`SST-CHNSIN01`** | Chennai → Singapore | MV Swift Titan | Electronics | **IN_TRANSIT** (Navigating Malacca Strait) |
| **`SST-BOMDXB02`** | Mumbai → Dubai | SS Pacific Voyager | Chemicals | **IN_TRANSIT** (Cruising Arabian Sea) |
| **`SST-CMBRTM03`** | Colombo → Rotterdam | MV Atlantic Carrier | Perishables | **DELAYED** (Red Sea Convoy Backlog Alert) |
| **`SST-NYCLON05`** | New York → London | Global Freight 747 | Pharmaceuticals | **DELIVERED** (Signed & Confirmed with Confetti) |
| **`SST-ANTSS07`** | Antwerp → Santos | MV Atlantic Carrier | Chemicals | **CUSTOMS_CLEARANCE** (Santos Terminal Check) |
| **`SST-DUBCOL08`** | Dubai → Colombo | SS Pacific Voyager | Heavy Machinery | **AT_PORT** (Outer Harbor Anchorage) |
| **`SST-HAMALX10`** | Hamburg → Alexandria | EuroTransit Express 01 | Heavy Machinery | **OUT_FOR_DELIVERY** (Final Road Convoy) |

---

## 🗄️ Database Architecture & ER Diagram

The database schema utilizes standard SQLite foreign key relationships and indexing:

```
    +-----------------------------------------------------------------+
    |                             USERS                               |
    +-----------------------------------------------------------------+
    | id (PK) | name | email (UQ) | password_hash | role | phone | co |
    +-----------------------------------------------------------------+
           | 1                                          | 1
           | owns                                       | logs
           v 0..*                                       v 0..*
    +---------------------------+               +---------------------+
    |         SHIPMENTS         |               |     AUDIT_LOGS      |
    +---------------------------+               +---------------------+
    | id (PK)                   |               | id (PK)             |
    | tracking_id (UQ)          |               | user_id (FK)        |
    | user_id (FK)              |               | action              |
    | vessel_id (FK)            |               | entity_type         |
    | sender_name, address      |               | entity_id           |
    | receiver_name, address    |               | details             |
    | origin_city, lat, lng     |               | ip_address          |
    | dest_city, lat, lng       |               | created_at          |
    | current_lat, current_lng  |               +---------------------+
    | current_location_name     |
    | cargo_type, weight_kg     |                          | 1
    | status, estimated_delivery|                          | carries
    | waypoints_json (polyline) |                          v 0..*
    | progress_percent          |               +---------------------+
    | is_delayed, delay_reason  |               |       VESSELS       |
    +---------------------------+               +---------------------+
           | 1             | 1                  | id (PK)             |
           | has           | triggers           | name                |
           v 0..*          v 0..*               | type                |
    +------------------+  +------------------+  | registration_num(UQ)|
    | SHIPMENT_EVENTS  |  |  NOTIFICATIONS   |  | capacity            |
    +------------------+  +------------------+  | flag                |
    | id (PK)          |  | id (PK)          |  | status              |
    | shipment_id (FK) |  | user_id (FK)     |  | current_lat, lng    |
    | status           |  | shipment_id (FK) |  +---------------------+
    | title, desc      |  | title, message   |
    | location         |  | type, is_read    |
    | lat, lng, time   |  | created_at       |
    +------------------+  +------------------+
```

---

## 🧠 Viva / Presentation Technical Talking Points

### 1. Great-Circle Distance & Dynamic ETA Formula (`etaCalculator.js`)
- Standard Euclidean distance fails over planetary curvature. Swift Ship Tracker implements the **Haversine Formula**:
  $$\Delta\sigma = 2 \arcsin \sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}$$
  $$d = R \cdot \Delta\sigma \quad (R = 6,371\text{ km})$$
- Calculated sea miles are divided by average operational speed per asset type (e.g. 20 knots $\approx 37$ km/h for container vessels, 750 km/h for air freight).
- When `calculated_eta > estimated_delivery`, the system automatically flags `is_delayed = 1` and alerts users via WebSocket.

### 2. Live GPS Simulation Engine (`gpsSimulator.js`)
- Runs as an autonomous background service without third-party dependencies.
- Every tick ($N$ seconds $\times$ speed multiplier), it pulls active shipments in `IN_TRANSIT` or `OUT_FOR_DELIVERY` status.
- It interpolates current coordinates along multi-point route waypoints:
  $$P(t) = P_i + f \cdot (P_{i+1} - P_i)$$
- Automatically broadcasts `{ type: 'LOCATION_UPDATE', trackingId, currentLat, currentLng, progressPercent }` to room `shipment:${trackingId}`.

### 3. Real-Time WebSocket Rooms Architecture (`socketService.js`)
- Eliminates expensive HTTP polling.
- Clients subscribe only to their viewed shipment (`socket.emit('join:shipment', trackingId)`), preserving server memory and network bandwidth.
- Dedicated rooms exist for user private notifications (`user:${userId}`) and global fleet radar (`fleet_radar`).

### 4. Zero C++ Setup SQLite Layer (`database.js`)
- Uses WebAssembly-compiled SQLite (`sql.js`).
- Guarantees seamless execution on any operating system without requiring Visual Studio C++ compilers or python build tools.
- Automatically flushes database transactions to `backend/data/swiftship.sqlite`.

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Create new customer account.
- `POST /api/auth/login` - Authenticate credentials and receive JWT.
- `GET /api/auth/me` - Validate session and get current profile.
- `PUT /api/auth/profile` - Update profile details and password.

### Shipments
- `GET /api/shipments/track/:trackingId` - **Public** tracking lookup with waypoints, events, and live coordinates.
- `GET /api/shipments` - List all shipments (with search, status filter, sort, pagination).
- `GET /api/shipments/my-shipments` - Get logged-in customer's shipments.
- `POST /api/shipments` - *(Admin)* Create new shipment with auto-generated `SST-XXXXXXXX` ID and waypoint curve.
- `PUT /api/shipments/:id` - *(Admin)* Update consignment specifications.
- `PUT /api/shipments/:id/status` - *(Admin)* Progress status and append timeline checkpoint.
- `PUT /api/shipments/:id/location` - *(Admin)* Manual GPS coordinate ping.
- `DELETE /api/shipments/:id` - *(Admin)* Delete shipment and cascade events.

### Fleet & Operations
- `GET /api/vessels` - List all fleet carriers with active load counts.
- `POST /api/vessels` - *(Admin)* Commission new vessel.
- `PUT /api/vessels/:id` - *(Admin)* Update vessel status.
- `DELETE /api/vessels/:id` - *(Admin)* Decommission vessel.

### Telemetry Simulation
- `GET /api/simulator/status` - Check current simulator state.
- `POST /api/simulator/toggle` - *(Admin)* Pause or resume simulation.
- `POST /api/simulator/speed` - *(Admin)* Set speed multiplier (1x, 2x, 5x, 10x).
- `POST /api/simulator/step` - *(Admin)* Advance 1 cycle.
- `POST /api/simulator/reset` - *(Admin)* Reset all active shipments back to origin ports for replay.

### Notifications & Audits
- `GET /api/notifications` - Get user or system notifications.
- `PUT /api/notifications/:id/read` - Mark notification read.
- `GET /api/reports/export-csv` - *(Admin)* Download filtered shipment manifest as CSV.
- `GET /api/audit` - *(Admin)* View immutable audit log.
- `GET /api/emails` - *(Admin)* View simulated email dispatch outbox.
- `GET /api/emails/:id` - *(Admin)* View rendered transactional HTML email.

---

## 📂 Project Structure

```
d:/ship-project/
├── backend/
│   ├── data/
│   │   └── swiftship.sqlite         # SQLite persistent database file
│   ├── src/
│   │   ├── controllers/             # Request handlers (auth, shipment, vessel, etc.)
│   │   ├── db/                      # Database wrapper (sql.js) & seed scripts
│   │   ├── middleware/              # JWT auth, role guard, error handling
│   │   ├── routes/                  # Express REST routes
│   │   ├── services/                # ETA calculator, GPS simulator, sockets, emails
│   │   ├── app.js                   # Express application setup
│   │   └── server.js                # Server entrypoint with Socket.IO
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/              # LiveMap, GlobalFleetMap, Modals, Navbar, etc.
│   │   ├── context/                 # AuthContext and ThemeContext
│   │   ├── pages/                   # LandingPage, PublicTrackingPage, Dashboards
│   │   ├── services/                # Axios API client, Socket client, PDF generator
│   │   ├── utils/                   # Constants, date & weight formatters
│   │   ├── App.jsx                  # Main routing structure
│   │   ├── main.jsx                 # React root entry
│   │   └── index.css                # Tailwind & Leaflet styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── package.json                     # Root orchestrator (concurrently)
├── .env.example
└── README.md
```

---

## 🎓 Academic Credit & License

Developed as a Final Year Project showcasing modern full-stack web engineering, real-time WebSocket protocol integration, GIS map rendering, and robust database architecture.

MIT License &copy; 2026 Swift Ship Logistics Network.
