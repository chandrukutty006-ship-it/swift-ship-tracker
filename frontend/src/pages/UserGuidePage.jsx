import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Navigation, 
  Ship, 
  Anchor, 
  LayoutDashboard, 
  FileText, 
  QrCode, 
  Mail, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  ExternalLink,
  Layers,
  Activity,
  FileSpreadsheet,
  User,
  Compass
} from 'lucide-react';
import { DEMO_TRACKING_IDS } from '../utils/constants';

export default function UserGuidePage() {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-sm">
          <BookOpen className="w-4 h-4 text-brand-500" />
          <span>Official User & Operations Manual</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Swift Ship Tracker: Complete User Guide
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Comprehensive walkthrough of every feature, role permission, telemetry function, and workflow in the Swift Ship Tracker web application.
        </p>
      </div>

      {/* Quick Jump Pill Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-20 z-30 backdrop-blur-md">
        {[
          { id: 'overview', label: '1. Roles & Access' },
          { id: 'tracking', label: '2. Track Consignments' },
          { id: 'map', label: '3. Live Map & Telemetry' },
          { id: 'simulator', label: '4. GPS Simulation Engine' },
          { id: 'admin', label: '5. Admin Control Center' },
          { id: 'fleet', label: '6. Fleet Management' },
          { id: 'customer', label: '7. Customer Dashboard' },
          { id: 'qr-pdf', label: '8. QR & PDF Receipts' },
          { id: 'notifications', label: '9. Alerts & Email Logs' },
          { id: 'audit', label: '10. Security & Audit' },
          { id: 'viva', label: '11. Viva Q&A Talking Points' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollTo(item.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === item.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Guide Content */}
      <div className="space-y-12 text-slate-700 dark:text-slate-300 text-sm">

        {/* 1. Roles & Access */}
        <section id="overview" className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              01
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                User Roles & Access Levels
              </h2>
              <p className="text-xs text-slate-400">Who can do what in the system</p>
            </div>
          </div>

          <p className="leading-relaxed">
            Swift Ship Tracker supports 3 distinct user levels designed for public customers, business partners, and enterprise logistics dispatchers:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Public */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="font-bold text-xs uppercase text-slate-400 block tracking-wider">Level 1</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Public Visitor</h3>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400">
                <li>• No login or registration needed.</li>
                <li>• Track any shipment using a valid Tracking ID (`SST-XXXXXXXX`).</li>
                <li>• View live map, route polyline, moving marker, and full history events.</li>
                <li>• Scan QR code and download official PDF receipts.</li>
              </ul>
            </div>

            {/* Customer */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="font-bold text-xs uppercase text-sky-500 block tracking-wider">Level 2</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Registered Customer</h3>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400">
                <li>• Access personalized "Customer Dashboard" (`/customer/dashboard`).</li>
                <li>• View private list of "My Shipments" with search and filters.</li>
                <li>• In-app notification bell for status milestones and delays.</li>
                <li>• One-click PDF bill of lading downloads and QR shares.</li>
              </ul>
            </div>

            {/* Admin */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="font-bold text-xs uppercase text-brand-600 dark:text-brand-400 block tracking-wider">Level 3</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Administrator</h3>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400">
                <li>• Create, edit, and delete consignments.</li>
                <li>• Manually transition status checkpoints and record delay reasons.</li>
                <li>• Control the live GPS simulation engine (pause, speed 1x–10x, reset).</li>
                <li>• Commission new vessels and vehicles to the fleet.</li>
                <li>• Export CSV reports, inspect audit trail, and view email logs.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                Quick Presentation Login Credentials
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Admin: <code className="font-mono text-brand-600 dark:text-brand-400">admin@swift.com</code> / <code className="font-mono">Admin@123</code> | Customer: <code className="font-mono text-brand-600 dark:text-brand-400">customer1@swift.com</code> / <code className="font-mono">Customer@123</code>
              </span>
            </div>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-colors"
            >
              Go to Sign In Page →
            </Link>
          </div>
        </section>

        {/* 2. Tracking Shipments */}
        <section id="tracking" className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              02
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                How to Track Any Shipment
              </h2>
              <p className="text-xs text-slate-400">Consignment lookup and milestone verification</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Step-by-Step Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <li>
                Click <strong>"Track Shipment"</strong> in the top navbar or visit <Link to="/track" className="text-brand-600 dark:text-brand-400 underline font-mono">/track</Link>.
              </li>
              <li>
                Enter a Tracking ID in the search field (Format: <code className="font-mono bg-slate-100 dark:bg-navy-800 px-1 py-0.5 rounded">SST-XXXXXXXX</code>).
              </li>
              <li>
                Click <strong>"Track Consignment"</strong>. The system performs an instant lookup and renders the complete telemetry dashboard.
              </li>
              <li>
                Click any of the <strong>"Quick Examples"</strong> buttons below the search bar to immediately switch between different global routes.
              </li>
            </ol>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-400 block">
              Sample Tracking Numbers Ready to Test:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {DEMO_TRACKING_IDS.map((d) => (
                <Link
                  key={d.id}
                  to={`/track?id=${d.id}`}
                  className="p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-colors flex items-center justify-between"
                >
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{d.id}</span>
                  <span className="text-[11px] text-slate-500 truncate">{d.route}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Live Map & Telemetry HUD */}
        <section id="map" className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              03
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Live Map & OpenStreetMap Telemetry
              </h2>
              <p className="text-xs text-slate-400">Interactive GIS visual components</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Map Elements Explained:</h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <span><strong>Green Port Marker</strong>: Pinpoints the Origin terminal (e.g. Port of Chennai, Port of Hamburg). Click to view shipper name.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                  <span><strong>Red Flag Marker</strong>: Marks the Destination harbor (e.g. Singapore, Rotterdam). Click to view consignee name.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mt-1 flex-shrink-0" />
                  <span><strong>Pulsing Vessel Marker</strong>: Represents the carrying vessel's current GPS position. Moves smoothly in real time as the simulator runs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500 mt-1 flex-shrink-0" />
                  <span><strong>Route Polyline</strong>: Dashed maritime corridor connecting waypoints through international sea lanes, canals, and straits.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Telemetry HUD & Controls:</h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li>• <strong>Crosshair Button</strong>: Automatically locks and follows the vessel marker as it moves.</li>
                <li>• <strong>Maximize Button</strong>: Fits the full origin-to-destination corridor within the view frame.</li>
                <li>• <strong>Live HUD Bar</strong>: Floating bar showing the current waypoint, voyage progress (0%–100%), and exact coordinates (°N, °E).</li>
                <li>• <strong>Mathematical ETA</strong>: Uses the Haversine formula to compute distance remaining and remaining transit hours.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. GPS Simulation Engine */}
        <section id="simulator" className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              04
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Autonomous GPS Simulation Engine
              </h2>
              <p className="text-xs text-slate-400">Background engine moving ships without physical IoT hardware</p>
            </div>
          </div>

          <p className="leading-relaxed">
            The background simulator runs on the Node.js backend. Every tick (default 3 seconds), it advances all active shipments (`IN_TRANSIT` and `OUT_FOR_DELIVERY`) along their route waypoints and broadcasts updates to connected clients over WebSocket.
          </p>

          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-sky-400">
              Admin Simulator Controls (Available on Dashboard & Global Radar):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="font-bold text-white block mb-1">Play / Pause</span>
                <span className="text-slate-400">Halts or resumes the background coordinate progression.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="font-bold text-white block mb-1">Speed Multipliers</span>
                <span className="text-slate-400">Toggle between <strong>1x, 2x, 5x, and 10x</strong> for fast viva demonstrations.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="font-bold text-white block mb-1">Step 1x</span>
                <span className="text-slate-400">Manually triggers a single simulation cycle on demand.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="font-bold text-white block mb-1">Reset Origins</span>
                <span className="text-slate-400">Resets all active shipments back to their start ports to replay the demo.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Admin Control Center */}
        <section id="admin" className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              05
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Control Center & Shipment Management
              </h2>
              <p className="text-xs text-slate-400">Consignment creation, editing, status updates, and reports</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">A. Creating a New Shipment</h4>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <li>Log in as Admin (`admin@swift.com`) and go to <Link to="/admin/shipments" className="text-brand-600 dark:text-brand-400 underline">Shipments</Link>.</li>
                <li>Click <strong>"+ New Consignment"</strong> button.</li>
                <li>Enter Sender & Receiver details, select Origin & Destination cities (or pick from the Quick Presets dropdown).</li>
                <li>Select Cargo Type (Electronics, Machinery, etc.), gross weight, and assign a carrier vessel.</li>
                <li>Click <strong>"Create & Register Consignment"</strong>. The system auto-generates a unique `SST-XXXXXXXX` tracking ID, calculates waypoint curves, logs an initial event, and creates notifications.</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">B. Updating Milestone Status & Locations</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                In the Shipments management table, click the <strong>Clock icon</strong> on any row to open the <strong>"Update Status"</strong> modal. You can advance status (`IN_TRANSIT` ➔ `AT_PORT` ➔ `CUSTOMS_CLEARANCE` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` or `DELAYED`), add a checkpoint title, location name, and description.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">C. Exporting CSV Manifests</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Click <strong>"Export CSV"</strong> to download a complete, formatted spreadsheet with tracking IDs, status, sender, consignee, coordinates, weights, and delivery dates.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Fleet Management */}
        <section id="fleet" className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              06
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Fleet & Vessel Asset Management
              </h2>
              <p className="text-xs text-slate-400">Managing multimodal transport carriers</p>
            </div>
          </div>

          <p className="leading-relaxed">
            Navigate to <Link to="/admin/vessels" className="text-brand-600 dark:text-brand-400 underline">Fleet</Link> in the navbar to manage marine ships, aircraft, and freight haulers:
          </p>

          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li>• <strong>Supported Asset Types</strong>: Container Ships, Bulk Ore Carriers, Oil Tankers, Cargo Flights, Freight Trucks.</li>
            <li>• <strong>Vessel Registry Specs</strong>: IMO/Registration Number (e.g. `IMO 9821033`), Flag State (Panama, Singapore, etc.), Payload Capacity (e.g. `20,000 TEU`).</li>
            <li>• <strong>Active Load Counter</strong>: Shows the number of shipments currently assigned to each vessel in real time.</li>
            <li>• <strong>Commissioning New Vessels</strong>: Click "+ Add Vessel" to register additional fleet assets.</li>
          </ul>
        </section>

        {/* 7. Customer Dashboard */}
        <section id="customer" className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              07
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Customer Portal & "My Shipments"
              </h2>
              <p className="text-xs text-slate-400">Shipper self-service consignment management</p>
            </div>
          </div>

          <p className="leading-relaxed">
            Registered customers can log in to view their private dashboard at <Link to="/customer/dashboard" className="text-brand-600 dark:text-brand-400 underline">/customer/dashboard</Link>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block">Consignment Summary Cards</span>
              <p className="text-slate-500 dark:text-slate-400">
                Instantly see totals for active orders, in-transit cargo, completed deliveries, and delay alerts.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block">1-Click Live Telemetry</span>
              <p className="text-slate-500 dark:text-slate-400">
                Click the navigation icon on any shipment row to launch its live OpenStreetMap view.
              </p>
            </div>
          </div>
        </section>

        {/* 8. QR Codes & PDF Receipts */}
        <section id="qr-pdf" className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              08
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                QR Code Generation & PDF Bills of Lading
              </h2>
              <p className="text-xs text-slate-400">Digital documentation and physical verification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold">
                <QrCode className="w-5 h-5" />
                <span>Mobile-Scannable QR Codes</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Every consignment has a dynamically generated QR code that links directly to its public tracking page.
              </p>
              <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                <li>• Click <strong>"QR Code"</strong> on any consignment page or table row.</li>
                <li>• Scan with a smartphone camera to track without typing.</li>
                <li>• Click <strong>"Download QR Image (PNG)"</strong> to save the graphic for shipping labels.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <FileText className="w-5 h-5" />
                <span>Client-Side PDF Bills of Lading</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Generates formal consignment receipts using `jsPDF` and `jspdf-autotable`.
              </p>
              <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                <li>• Includes header branding, tracking barcode box, and delivery ETA.</li>
                <li>• Side-by-side Shipper and Consignee contact addresses.</li>
                <li>• Full table of milestone checkpoints with authorized digital stamp.</li>
                <li>• Download file named automatically as <code className="font-mono">SwiftShip_Receipt_SST-XXXX.pdf</code>.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 9. Alerts & Email Logs */}
        <section id="notifications" className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              09
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                In-App Notification Bell & Simulated Emails
              </h2>
              <p className="text-xs text-slate-400">Dual-channel notification architecture</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">In-App Notification Bell:</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Located in the top right navbar. When a shipment's status changes or a delay is flagged, a real-time event triggers an animated red badge. Clicking any notification navigates directly to that consignment.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">Simulated Email Outbox:</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Admins can inspect all dispatched transactional emails at <Link to="/admin/emails" className="text-brand-600 dark:text-brand-400 underline">Email Logs</Link>. Click <strong>"Preview HTML"</strong> to view the rendered email template complete with tracking progress bars and action buttons.
              </p>
            </div>
          </div>
        </section>

        {/* 10. Security & Audit Trail */}
        <section id="audit" className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
              10
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                System Security & Administrative Audit Trail
              </h2>
              <p className="text-xs text-slate-400">Enterprise accountability and compliance</p>
            </div>
          </div>

          <p className="leading-relaxed">
            Every critical operation (consignments created, status changed, simulation toggled, vessel commissioned) is automatically recorded in the <code className="font-mono">audit_logs</code> database table.
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Admins can view this immutable ledger at <Link to="/admin/audit" className="text-brand-600 dark:text-brand-400 underline font-mono">/admin/audit</Link> with operator emails, action tags, timestamps, and client IP addresses.
          </p>
        </section>

        {/* 11. Viva Q&A Talking Points */}
        <section id="viva" className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
              11
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Viva & Project Presentation Q&A Guide
              </h2>
              <p className="text-xs text-slate-400">Key technical answers for external examiners and evaluators</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <span className="font-bold text-sky-400 block">Q1: How does the map update in real time without refreshing the page?</span>
              <p className="text-slate-300 leading-relaxed">
                We use <strong>Socket.IO</strong> with room-based pub/sub. When viewing a shipment, the browser joins room <code className="font-mono text-sky-300">shipment:${'{'}trackingId{'}'}</code>. When the background simulator updates coordinates, the backend emits a <code className="font-mono text-sky-300">shipment:location_update</code> event, which the React Leaflet marker listens to and animates smoothly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <span className="font-bold text-sky-400 block">Q2: How is the ETA calculated? Why not simple straight lines?</span>
              <p className="text-slate-300 leading-relaxed">
                We implement the <strong>Haversine Great-Circle formula</strong> to calculate spherical distance over Earth's curvature. Remaining distance is divided by the carrier's average operational speed (e.g. 20 knots for ships, 750 km/h for flights). If the calculated arrival time exceeds the promised delivery date, the system automatically marks the consignment as delayed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <span className="font-bold text-sky-400 block">Q3: Why SQLite via sql.js instead of MySQL or MongoDB?</span>
              <p className="text-slate-300 leading-relaxed">
                To guarantee <strong>zero setup friction</strong>. `sql.js` is the official SQLite engine compiled to WebAssembly. Any evaluator can clone the repo and run it immediately on any operating system without installing database servers or configuring C++ native build tools.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <span className="font-bold text-sky-400 block">Q4: How does authentication and route security work?</span>
              <p className="text-slate-300 leading-relaxed">
                Passwords are protected with <strong>bcryptjs salt hashing</strong>. Sessions use stateless <strong>JSON Web Tokens (JWT)</strong> transmitted via the <code className="font-mono text-sky-300">Authorization: Bearer</code> header. Express middleware intercepts routes and strictly verifies role permissions (`ADMIN` vs `CUSTOMER`).
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
