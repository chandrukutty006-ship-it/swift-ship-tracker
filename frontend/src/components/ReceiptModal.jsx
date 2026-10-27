import React from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { generateShipmentPdf } from '../services/pdfGenerator';
import { formatDate, formatWeight } from '../utils/formatters';
import StatusBadge from './StatusBadge';

export default function ReceiptModal({ shipment, onClose }) {
  if (!shipment) return null;

  const handleDownload = () => {
    generateShipmentPdf(shipment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-navy-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-navy-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Consignment Receipt & Bill of Lading
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {shipment.tracking_id}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content Preview */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Top Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Consignment Tracking ID
              </span>
              <span className="font-mono text-base font-extrabold text-brand-600 dark:text-brand-400">
                {shipment.tracking_id}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                Current Status
              </span>
              <StatusBadge status={shipment.status} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Estimated Delivery
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {formatDate(shipment.estimated_delivery)}
              </span>
            </div>
          </div>

          {/* Shipper & Consignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/50">
              <span className="font-bold text-[11px] text-brand-600 dark:text-brand-400 uppercase tracking-wider block mb-2">
                1. Shipper / Origin
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{shipment.sender_name}</p>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{shipment.sender_address}</p>
              <p className="text-slate-500 dark:text-slate-400">{shipment.origin_city}, {shipment.origin_country}</p>
              <p className="text-slate-400 font-mono mt-1">Tel: {shipment.sender_phone || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/50">
              <span className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
                2. Consignee / Destination
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{shipment.receiver_name}</p>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{shipment.receiver_address}</p>
              <p className="text-slate-500 dark:text-slate-400">{shipment.destination_city}, {shipment.destination_country}</p>
              <p className="text-slate-400 font-mono mt-1">Tel: {shipment.receiver_phone || 'N/A'}</p>
            </div>
          </div>

          {/* Cargo Details */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-3">
              Cargo & Carrier Specifications
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block">Cargo Type</span>
                <span className="font-semibold text-slate-900 dark:text-white">{shipment.cargo_type}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Gross Weight</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatWeight(shipment.weight_kg)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Volume</span>
                <span className="font-semibold text-slate-900 dark:text-white">{shipment.volume_cbm ? `${shipment.volume_cbm} CBM` : 'Standard'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Carrier Vessel</span>
                <span className="font-semibold text-slate-900 dark:text-white">{shipment.vessel_name || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-navy-950 text-slate-500 dark:text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Electronically verified and signed by Swift Ship Multimodal Network.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-navy-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Official PDF
          </button>
        </div>
      </div>
    </div>
  );
}
