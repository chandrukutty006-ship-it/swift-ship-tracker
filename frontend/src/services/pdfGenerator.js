import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, formatWeight } from '../utils/formatters';

export function generateShipmentPdf(shipment) {
  if (!shipment) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [2, 132, 199]; // #0284c7 Ocean Blue
  const darkNavy = [15, 23, 42]; // #0f172a Deep Navy

  // Header Background Bar
  doc.setFillColor(...darkNavy);
  doc.rect(0, 0, 210, 36, 'F');

  // Title / Logo
  doc.setTextColor(56, 189, 248); // Sky blue
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SWIFT SHIP TRACKER', 14, 18);

  doc.setTextColor(203, 213, 225); // Slate light
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL MULTIMODAL BILL OF LADING & CONSIGNMENT RECEIPT', 14, 25);
  doc.text('Global Cargo Telemetry & Real-Time Tracking Network', 14, 30);

  // Document Metadata Box (Right side of header)
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`DOC DATE: ${new Date().toISOString().slice(0, 10)}`, 150, 18);
  doc.text(`STATUS: ${shipment.status.replace(/_/g, ' ')}`, 150, 24);
  doc.text(`SYSTEM ID: #SST-${shipment.id || '01'}`, 150, 30);

  // Tracking ID Highlight Banner
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, 42, 182, 18, 3, 3, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CONSIGNMENT TRACKING NUMBER', 20, 49);

  doc.setTextColor(...darkNavy);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(shipment.tracking_id, 20, 56);

  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.text(`Estimated Delivery: ${formatDate(shipment.estimated_delivery)}`, 110, 53);

  // Shipper & Consignee Columns
  autoTable(doc, {
    startY: 65,
    margin: { left: 14, right: 14 },
    head: [['1. SHIPPER / SENDER', '2. CONSIGNEE / RECEIVER']],
    body: [
      [
        `Name: ${shipment.sender_name}\nAddress: ${shipment.sender_address || 'Port Terminal Depot'}\nPhone: ${shipment.sender_phone || 'N/A'}\nOrigin: ${shipment.origin_city}, ${shipment.origin_country || ''}`,
        `Name: ${shipment.receiver_name}\nAddress: ${shipment.receiver_address || 'Destination Hub'}\nPhone: ${shipment.receiver_phone || 'N/A'}\nDestination: ${shipment.destination_city}, ${shipment.destination_country || ''}`,
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', fontSize: 10 },
    bodyStyles: { fontSize: 9, cellPadding: 4, textColor: [30, 41, 59] },
  });

  // Cargo & Routing Specifications
  const cargoY = doc.lastAutoTable.finalY + 8;
  autoTable(doc, {
    startY: cargoY,
    margin: { left: 14, right: 14 },
    head: [['CARGO TYPE', 'GROSS WEIGHT', 'VOLUME', 'CARRIER / VESSEL', 'CURRENT LOCATION']],
    body: [
      [
        shipment.cargo_type,
        formatWeight(shipment.weight_kg),
        shipment.volume_cbm ? `${shipment.volume_cbm} CBM` : 'Standard',
        shipment.vessel_name || 'Unassigned Fleet Unit',
        shipment.current_location_name || shipment.origin_city,
      ],
    ],
    theme: 'striped',
    headStyles: { fillColor: darkNavy, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, cellPadding: 4 },
  });

  // Tracking Checkpoints / Events Timeline
  if (shipment.events && shipment.events.length > 0) {
    const eventsY = doc.lastAutoTable.finalY + 8;
    const eventRows = shipment.events.map((ev) => [
      formatDate(ev.timestamp),
      ev.status.replace(/_/g, ' '),
      ev.location,
      ev.title + (ev.description ? ` - ${ev.description}` : ''),
    ]);

    autoTable(doc, {
      startY: eventsY,
      margin: { left: 14, right: 14 },
      head: [['DATE & TIME', 'STATUS', 'LOCATION', 'MILESTONE DETAILS']],
      body: eventRows,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8, cellPadding: 3 },
    });
  }

  // Footer / Verification Notice
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 230;

  if (finalY < 260) {
    doc.setDrawColor(226, 232, 240);
    doc.line(14, finalY, 196, finalY);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Notice: This electronically generated document is certified by the Swift Ship Tracker Automated Telemetry System.',
      14,
      finalY + 6
    );
    doc.text(
      `Verify live at http://localhost:5173/track?id=${shipment.tracking_id} | Swift Logistics Global Cargo Network`,
      14,
      finalY + 11
    );

    // Authorized Stamp Box
    doc.setDrawColor(2, 132, 199);
    doc.roundedRect(140, finalY + 16, 56, 18, 2, 2);
    doc.setFontSize(7);
    doc.setTextColor(2, 132, 199);
    doc.text('ELECTRONICALLY VERIFIED', 148, finalY + 23);
    doc.text('SWIFT LOGISTICS AUTH CARRIER', 143, finalY + 28);
  }

  // Save the PDF
  doc.save(`SwiftShip_Receipt_${shipment.tracking_id}.pdf`);
}
