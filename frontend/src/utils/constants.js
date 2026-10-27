export const SHIPMENT_STATUSES = [
  { value: 'ORDER_PLACED', label: 'Order Placed', color: 'blue' },
  { value: 'PICKED_UP', label: 'Picked Up', color: 'indigo' },
  { value: 'IN_TRANSIT', label: 'In Transit', color: 'sky' },
  { value: 'AT_PORT', label: 'At Port / Hub', color: 'cyan' },
  { value: 'CUSTOMS_CLEARANCE', label: 'Customs Clearance', color: 'amber' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'purple' },
  { value: 'DELIVERED', label: 'Delivered', color: 'emerald' },
  { value: 'DELAYED', label: 'Delayed', color: 'rose' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'slate' },
];

export const STATUS_STEPS = [
  'ORDER_PLACED',
  'PICKED_UP',
  'IN_TRANSIT',
  'AT_PORT',
  'CUSTOMS_CLEARANCE',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export const CARGO_TYPES = [
  'General Cargo',
  'Electronics',
  'Heavy Machinery',
  'Chemicals',
  'Perishables',
  'Pharmaceuticals',
  'Automotive Parts',
  'Textiles',
  'Minerals & Ore',
];

export const VESSEL_TYPES = [
  'Container Ship',
  'Bulk Carrier',
  'Oil Tanker',
  'Cargo Flight',
  'Freight Truck',
];

export const DEMO_TRACKING_IDS = [
  { id: 'SST-CHNSIN01', route: 'Chennai → Singapore', status: 'IN_TRANSIT', desc: 'Active Malacca Strait Container Ship' },
  { id: 'SST-BOMDXB02', route: 'Mumbai → Dubai', status: 'IN_TRANSIT', desc: 'Arabian Sea Chemical Tanker' },
  { id: 'SST-CMBRTM03', route: 'Colombo → Rotterdam', status: 'DELAYED', desc: 'Red Sea Weather Delay' },
  { id: 'SST-NYCLON05', route: 'New York → London', status: 'DELIVERED', desc: 'Completed Transatlantic Air Cargo' },
  { id: 'SST-ANTSS07', route: 'Antwerp → Santos', status: 'CUSTOMS_CLEARANCE', desc: 'Brazil Port Customs Review' },
];
