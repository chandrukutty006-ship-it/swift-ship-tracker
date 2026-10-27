import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Eye, RefreshCw, Send, ExternalLink, Inbox } from 'lucide-react';
import api from '../services/api';
import EmailPreviewModal from '../components/EmailPreviewModal';
import { formatDate } from '../utils/formatters';

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await api.get('/emails?limit=50');
      if (res.data.success) {
        setEmails(res.data.emails || []);
      }
    } catch (err) {
      console.error('Failed to load email logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleOpenEmail = async (id) => {
    try {
      const res = await api.get(`/emails/${id}`);
      if (res.data.success) {
        setSelectedEmail(res.data.email);
      }
    } catch (e) {
      alert('Failed to load email details.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400">
            Outbox Simulation Telemetry
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Customer Notification Email Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Simulated transactional dispatch records. Click any email to view the exact HTML layout sent to the client.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchEmails}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Emails Table */}
      <div className="rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading email logs...</div>
          ) : emails.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Inbox className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No emails logged yet</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-navy-950/60 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Dispatched Time</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Consignment ID</th>
                  <th className="py-3 px-4">Event Trigger</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {emails.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {formatDate(m.sent_at)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 dark:text-white block">{m.to_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{m.to_email}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-sm truncate">
                      {m.subject}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                      {m.tracking_id || 'GENERAL'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                        {m.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEmail(m.id)}
                        className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 text-sky-600 dark:text-sky-400 font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview HTML
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {selectedEmail && (
        <EmailPreviewModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </div>
  );
}
