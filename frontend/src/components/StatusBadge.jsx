import React from 'react';
import { 
  Package, 
  Truck, 
  Anchor, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileCheck,
  Navigation
} from 'lucide-react';

export default function StatusBadge({ status, size = 'md', className = '' }) {
  const normalized = status ? status.toUpperCase() : 'ORDER_PLACED';

  let config = {
    label: 'Order Placed',
    bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
    icon: Package,
    pulse: false,
  };

  switch (normalized) {
    case 'ORDER_PLACED':
      config = {
        label: 'Order Placed',
        bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        dot: 'bg-blue-500',
        icon: Package,
        pulse: false,
      };
      break;
    case 'PICKED_UP':
      config = {
        label: 'Picked Up',
        bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        dot: 'bg-indigo-500',
        icon: Truck,
        pulse: false,
      };
      break;
    case 'IN_TRANSIT':
      config = {
        label: 'In Transit',
        bg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        dot: 'bg-sky-500',
        icon: Navigation,
        pulse: true,
      };
      break;
    case 'AT_PORT':
      config = {
        label: 'At Port / Hub',
        bg: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
        dot: 'bg-cyan-500',
        icon: Anchor,
        pulse: false,
      };
      break;
    case 'CUSTOMS_CLEARANCE':
      config = {
        label: 'Customs Clearance',
        bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
        icon: FileCheck,
        pulse: false,
      };
      break;
    case 'OUT_FOR_DELIVERY':
      config = {
        label: 'Out for Delivery',
        bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        dot: 'bg-purple-500',
        icon: Truck,
        pulse: true,
      };
      break;
    case 'DELIVERED':
      config = {
        label: 'Delivered',
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        icon: CheckCircle2,
        pulse: false,
      };
      break;
    case 'DELAYED':
      config = {
        label: 'Delayed',
        bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500',
        icon: AlertTriangle,
        pulse: true,
      };
      break;
    case 'CANCELLED':
      config = {
        label: 'Cancelled',
        bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700',
        dot: 'bg-slate-400',
        icon: XCircle,
        pulse: false,
      };
      break;
    default:
      break;
  }

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses[size]} ${config.bg} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
}
