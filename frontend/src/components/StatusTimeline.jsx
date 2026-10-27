import React from 'react';
import { 
  Package, 
  Truck, 
  Navigation, 
  Anchor, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { STATUS_STEPS } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const STEP_DETAILS = {
  ORDER_PLACED: { label: 'Order Placed', icon: Package },
  PICKED_UP: { label: 'Picked Up', icon: Truck },
  IN_TRANSIT: { label: 'In Transit', icon: Navigation },
  AT_PORT: { label: 'At Port / Hub', icon: Anchor },
  CUSTOMS_CLEARANCE: { label: 'Customs', icon: FileCheck },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: Truck },
  DELIVERED: { label: 'Delivered', icon: CheckCircle2 },
};

export default function StatusTimeline({ status, events = [], isDelayed = false, delayReason = '' }) {
  const currentStatus = (status || 'ORDER_PLACED').toUpperCase();
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {/* Delayed Alert Notice if applicable */}
      {isDelayed && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-sm">Shipment Schedule Delayed</span>
            <p className="mt-0.5 leading-relaxed text-amber-700 dark:text-amber-300">
              {delayReason || 'Shipment is experiencing unexpected transit delays due to port congestion or marine conditions.'}
            </p>
          </div>
        </div>
      )}

      {/* Cancelled Alert Notice */}
      {currentStatus === 'CANCELLED' && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs">
          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-sm">Consignment Cancelled</span>
            <p className="mt-0.5 leading-relaxed">
              {delayReason || 'This shipment was cancelled prior to completion.'}
            </p>
          </div>
        </div>
      )}

      {/* Step Stepper Bar */}
      <div className="overflow-x-auto pb-4 pt-2">
        <div className="min-w-[640px] flex items-center justify-between relative px-2">
          {/* Progress Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 dark:bg-navy-800 z-0">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-sky-400 transition-all duration-500 rounded-full"
              style={{
                width: `${currentIndex >= 0 ? (currentIndex / (STATUS_STEPS.length - 1)) * 100 : 0}%`,
              }}
            />
          </div>

          {STATUS_STEPS.map((stepKey, idx) => {
            const step = STEP_DETAILS[stepKey];
            const Icon = step.icon;
            const isCompleted = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const isPending = currentIndex < idx;

            return (
              <div key={stepKey} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                    isCompleted
                      ? 'bg-brand-600 text-white shadow-brand-500/20'
                      : isCurrent
                      ? 'bg-sky-500 text-white ring-4 ring-sky-100 dark:ring-sky-950/80 shadow-md shadow-sky-500/30'
                      : 'bg-slate-100 dark:bg-navy-850 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`mt-2 text-xs text-center font-medium max-w-[80px] leading-tight ${
                    isCurrent
                      ? 'text-sky-600 dark:text-sky-400 font-bold'
                      : isCompleted
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Checkpoint Event History */}
      <div className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-6">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-brand-500" />
          Milestone Checkpoint History
        </h4>

        {events && events.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-navy-800">
            {events.map((event, idx) => (
              <div key={event.id || idx} className="relative group">
                {/* Node Dot */}
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white dark:ring-navy-950 group-hover:scale-125 transition-transform" />

                <div className="bg-slate-50 dark:bg-navy-900/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 transition-colors hover:border-brand-300 dark:hover:border-brand-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      {event.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                      {event.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No event checkpoints logged yet.
          </div>
        )}
      </div>
    </div>
  );
}
