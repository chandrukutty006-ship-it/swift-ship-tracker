import React from 'react';
import { X, Mail, Calendar, User, Hash } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function EmailPreviewModal({ email, onClose }) {
  if (!email) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-navy-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-navy-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Simulated Email Dispatch Preview
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {email.tracking_id || 'SYSTEM DISPATCH'}
              </p>
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

        {/* Email Meta Headers */}
        <div className="px-6 py-3 bg-slate-100/70 dark:bg-navy-950/50 border-b border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 dark:text-white">To:</span>
              <span>{email.to_name} &lt;{email.to_email}&gt;</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(email.sent_at)}</span>
            </div>
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">Subject: </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{email.subject}</span>
          </div>
        </div>

        {/* Rendered HTML Container */}
        <div className="p-6 overflow-y-auto bg-slate-50 dark:bg-navy-950 flex justify-center">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-slate-900">
            <div
              className="p-4"
              dangerouslySetInnerHTML={{ __html: email.body_html || '<p>No content</p>' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-navy-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-navy-800 hover:bg-slate-300 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
