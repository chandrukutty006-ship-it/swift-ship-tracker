const gpsSimulator = require('../services/gpsSimulator');
const { logAudit } = require('../services/auditService');

exports.getStatus = (req, res) => {
  res.json({
    success: true,
    status: gpsSimulator.getStatus(),
  });
};

exports.toggle = (req, res) => {
  const { running } = req.body;
  if (running) {
    gpsSimulator.start();
  } else {
    gpsSimulator.stop();
  }

  logAudit({
    userId: req.user ? req.user.id : null,
    userEmail: req.user ? req.user.email : 'ADMIN',
    action: 'TOGGLE_SIMULATOR',
    entityType: 'SIMULATOR',
    details: { running },
  });

  res.json({
    success: true,
    status: gpsSimulator.getStatus(),
  });
};

exports.setSpeed = (req, res) => {
  const { speed } = req.body;
  gpsSimulator.setSpeed(speed);

  logAudit({
    userId: req.user ? req.user.id : null,
    userEmail: req.user ? req.user.email : 'ADMIN',
    action: 'SET_SIMULATOR_SPEED',
    entityType: 'SIMULATOR',
    details: { speed },
  });

  res.json({
    success: true,
    status: gpsSimulator.getStatus(),
  });
};

exports.stepOnce = (req, res) => {
  gpsSimulator.tick();
  res.json({
    success: true,
    message: 'Simulation stepped forward 1 cycle.',
  });
};

exports.resetShipments = (req, res) => {
  gpsSimulator.resetActiveShipments();

  logAudit({
    userId: req.user ? req.user.id : null,
    userEmail: req.user ? req.user.email : 'ADMIN',
    action: 'RESET_SIMULATION_POSITIONS',
    entityType: 'SIMULATOR',
    details: 'Reset all active shipment coordinates to origin.',
  });

  res.json({
    success: true,
    message: 'Active shipments reset to origins for demo replay.',
  });
};
