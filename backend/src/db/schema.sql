-- Swift Ship Tracker Database Schema (SQLite)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK(role IN ('ADMIN', 'CUSTOMER')),
  phone TEXT,
  company TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vessels Table (Marine ships, aircraft, freight haulers)
CREATE TABLE IF NOT EXISTS vessels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Container Ship' CHECK(type IN ('Container Ship', 'Bulk Carrier', 'Oil Tanker', 'Cargo Flight', 'Freight Truck')),
  registration_number TEXT UNIQUE NOT NULL,
  capacity TEXT NOT NULL,
  flag TEXT NOT NULL DEFAULT 'Panama',
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'IN_PORT', 'MAINTENANCE', 'IDLE')),
  current_lat REAL,
  current_lng REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Shipments Table
CREATE TABLE IF NOT EXISTS shipments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tracking_id TEXT UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  sender_phone TEXT,
  receiver_name TEXT NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_phone TEXT,
  origin_city TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  origin_lat REAL NOT NULL,
  origin_lng REAL NOT NULL,
  destination_city TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  destination_lat REAL NOT NULL,
  destination_lng REAL NOT NULL,
  current_lat REAL NOT NULL,
  current_lng REAL NOT NULL,
  current_location_name TEXT NOT NULL,
  cargo_type TEXT NOT NULL DEFAULT 'General Cargo',
  weight_kg REAL NOT NULL,
  volume_cbm REAL DEFAULT 0,
  vessel_id INTEGER REFERENCES vessels(id) ON DELETE SET NULL,
  vessel_name TEXT,
  status TEXT NOT NULL DEFAULT 'ORDER_PLACED' CHECK(status IN (
    'ORDER_PLACED', 'PICKED_UP', 'IN_TRANSIT', 'AT_PORT', 'CUSTOMS_CLEARANCE', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELAYED', 'CANCELLED'
  )),
  estimated_delivery DATETIME NOT NULL,
  actual_delivery DATETIME,
  progress_percent REAL DEFAULT 0,
  waypoints_json TEXT, -- JSON Array of [{ lat, lng, name, reached }]
  current_waypoint_index INTEGER DEFAULT 0,
  is_delayed INTEGER DEFAULT 0,
  delay_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Shipment Events (Timeline history)
CREATE TABLE IF NOT EXISTS shipment_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  shipment_id INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'STATUS_UPDATE',
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Email Logs Table (Simulated Email Dispatch)
CREATE TABLE IF NOT EXISTS email_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  to_email TEXT NOT NULL,
  to_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  tracking_id TEXT,
  event_type TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Audit Logs Table (Administrative accountability)
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Simulator Configuration Table
CREATE TABLE IF NOT EXISTS simulator_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  is_running INTEGER DEFAULT 1,
  interval_seconds INTEGER DEFAULT 3,
  speed_multiplier REAL DEFAULT 1.0,
  last_tick DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_id ON shipments(tracking_id);
CREATE INDEX IF NOT EXISTS idx_shipments_user_id ON shipments(user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_events_shipment_id ON shipment_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
