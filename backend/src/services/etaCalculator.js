/**
 * ETA & Distance Calculation Utility for Swift Ship Tracker
 * Uses Haversine Great-Circle formula to compute distances across Earth coordinates.
 */

// Earth radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Returns estimated average transit speed in km/h based on cargo/vessel type
 */
function getAverageSpeedKmH(vesselType = 'Container Ship') {
  switch (vesselType) {
    case 'Cargo Flight':
      return 750; // Air freight avg ~750 km/h
    case 'Freight Truck':
      return 65; // Highway hauler avg ~65 km/h
    case 'Oil Tanker':
      return 26; // ~14 knots
    case 'Bulk Carrier':
      return 24; // ~13 knots
    case 'Container Ship':
    default:
      return 37; // ~20 knots (modern container vessel)
  }
}

/**
 * Calculates remaining travel time, ETA, and checks if delayed
 * @param {number} currentLat 
 * @param {number} currentLng 
 * @param {number} destLat 
 * @param {number} destLng 
 * @param {string} vesselType 
 * @param {string|Date} estimatedDelivery 
 */
function calculateEta(currentLat, currentLng, destLat, destLng, vesselType = 'Container Ship', estimatedDelivery = null) {
  const distanceRemainingKm = calculateDistanceKm(currentLat, currentLng, destLat, destLng);
  const avgSpeed = getAverageSpeedKmH(vesselType);

  // Time in hours + 6 hours standard hub/berth buffer
  const transitHours = distanceRemainingKm / avgSpeed + 6;
  const calculatedEtaDate = new Date(Date.now() + transitHours * 3600 * 1000);

  let isDelayed = 0;
  let delayHours = 0;

  if (estimatedDelivery) {
    const targetDate = new Date(estimatedDelivery);
    if (calculatedEtaDate > targetDate) {
      isDelayed = 1;
      delayHours = Math.round((calculatedEtaDate.getTime() - targetDate.getTime()) / (1000 * 3600));
    }
  }

  return {
    distanceRemainingKm: Math.round(distanceRemainingKm),
    distanceRemainingNauticalMiles: Math.round(distanceRemainingKm * 0.539957),
    remainingHours: Math.round(transitHours),
    calculatedEta: calculatedEtaDate.toISOString(),
    isDelayed,
    delayHours,
    averageSpeedKmH: avgSpeed,
  };
}

module.exports = {
  calculateDistanceKm,
  getAverageSpeedKmH,
  calculateEta,
};
