import { io } from 'socket.io-client';

// Connect to current origin, which proxies /socket.io in Vite to backend
export const socket = io(window.location.origin, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

export function joinShipmentRoom(trackingId) {
  if (trackingId) {
    socket.emit('join:shipment', trackingId);
  }
}

export function leaveShipmentRoom(trackingId) {
  if (trackingId) {
    socket.emit('leave:shipment', trackingId);
  }
}

export function joinUserRoom(userId) {
  if (userId) {
    socket.emit('join:user', userId);
  }
}

export function joinFleetRoom() {
  socket.emit('join:fleet');
}
