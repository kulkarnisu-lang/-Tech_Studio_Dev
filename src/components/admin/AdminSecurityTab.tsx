import React from 'react';
import { Shield, Clock } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminSecurityTab() {
  const { adminEmail, currentUserEmail, activityLogs } = useAdmin();
  const securityLogs = activityLogs.filter(log => /login|auth|admin/i.test(log.action));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Shield className="w-5 h-5 text-sky-500" /> Owner Access</h2>
      <div className="p-6 rounded-xl bg-white dark:bg-[#0C111A] border border-slate-200 dark:border-slate-800 space-y-3 text-sm">
        <p>Website editing is restricted to the verified Google account <strong className="break-all">{adminEmail}</strong>.</p>
        <p className="text-slate-500">Signed in as <span className="break-all">{currentUserEmail}</span>.</p>
        <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="inline-block text-sky-600 dark:text-sky-400 underline">Manage Google account security</a>
      </div>
      <div className="p-6 rounded-xl bg-white dark:bg-[#0C111A] border border-slate-200 dark:border-slate-800">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-sky-500" /> Security Activity</h3>
        {securityLogs.length === 0 ? <p className="text-sm text-slate-500">No security activity recorded.</p> : (
          <ul className="space-y-4">
            {securityLogs.map(log => <li key={log.id} className="text-sm border-b border-slate-100 dark:border-slate-800 pb-3"><p className="font-semibold">{log.action}</p><p className="text-slate-500 mt-1">{log.details}</p><p className="text-slate-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p></li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
