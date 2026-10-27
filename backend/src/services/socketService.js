let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    // Client joins a specific shipment room for real-time live map updates
    socket.on('join:shipment', (trackingId) => {
      if (trackingId) {
        socket.join(`shipment:${trackingId}`);
      }
    });

    socket.on('leave:shipment', (trackingId) => {
      if (trackingId) {
        socket.leave(`shipment:${trackingId}`);
      }
    });

    // Client joins their user-specific room for private notifications
    socket.on('join:user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    // Join general global live radar room
    socket.on('join:fleet', () => {
      socket.join('fleet_radar');
    });
  });

  return io;
}

function broadcastLocationUpdate(trackingId, locationData) {
  if (!ioInstance) return;
  // Send to viewers of this specific shipment
  ioInstance.to(`shipment:${trackingId}`).emit('shipment:location_update', {
    trackingId,
    ...locationData,
  });
  // Also send to global fleet radar viewers
  ioInstance.to('fleet_radar').emit('shipment:location_update', {
    trackingId,
    ...locationData,
  });
}

function broadcastStatusUpdate(trackingId, statusData) {
  if (!ioInstance) return;
  ioInstance.to(`shipment:${trackingId}`).emit('shipment:status_update', {
    trackingId,
    ...statusData,
  });
  ioInstance.emit('global:shipment_status_changed', {
    trackingId,
    ...statusData,
  });
}

function broadcastNotification(notification) {
  if (!ioInstance) return;
  if (notification.user_id) {
    ioInstance.to(`user:${notification.user_id}`).emit('notification:new', notification);
  } else {
    // Broadcast system notification to all connected clients
    ioInstance.emit('notification:new', notification);
  }
}

function broadcastSimulatorStatus(status) {
  if (!ioInstance) return;
  ioInstance.emit('simulator:status_update', status);
}

module.exports = {
  initSocket,
  broadcastLocationUpdate,
  broadcastStatusUpdate,
  broadcastNotification,
  broadcastSimulatorStatus,
};
