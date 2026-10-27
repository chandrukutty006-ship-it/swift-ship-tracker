export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return dateStr;
  }
}

export function formatShortDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch (e) {
    return dateStr;
  }
}

export function formatWeight(kg) {
  if (!kg && kg !== 0) return '0 kg';
  const num = parseFloat(kg);
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} tons (${num.toLocaleString()} kg)`;
  }
  return `${num.toLocaleString()} kg`;
}

export function formatDistance(km) {
  if (!km && km !== 0) return '0 km';
  const num = Math.round(km);
  const nm = Math.round(num * 0.539957);
  return `${num.toLocaleString()} km (${nm.toLocaleString()} NM)`;
}
