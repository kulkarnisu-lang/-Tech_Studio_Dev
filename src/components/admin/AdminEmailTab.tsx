import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Key,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Radio,
  FileText,
  Sliders,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { isEmailJsConfigured } from '../../lib/emailService';

export default function AdminEmailTab() {
  const {
    emailConfig,
    updateEmailConfig,
    resetEmailConfigToDefault,
    testEmailNotification,
    adminEmail,
  } = useAdmin();

  const [formData, setFormData] = useState({ ...emailConfig });
  const [isSaved, setIsSaved] = useState(false);
  const [testEmailTarget, setTestEmailTarget] = useState(
    emailConfig.ownerNotificationEmail || adminEmail || 'devmarlow01@gmail.com'
  );
  const [isTestingUser, setIsTestingUser] = useState(false);
  const [isTestingOwner, setIsTestingOwner] = useState(false);
  const [testOutcome, setTestOutcome] = useState<{
    type: 'success' | 'error';
    message: string;
    simulated: boolean;
  } | null>(null);

  const [copiedTemplate, setCopiedTemplate] = useState<'user' | 'owner' | null>(null);

  const isConfigured = isEmailJsConfigured(formData);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateEmailConfig(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTest = async (type: 'user' | 'owner') => {
    if (!testEmailTarget.trim()) return;
    setTestOutcome(null);
    if (type === 'user') setIsTestingUser(true);
    else setIsTestingOwner(true);

    try {
      const outcome = await testEmailNotification(type, testEmailTarget.trim());
      setTestOutcome({
        type: outcome.success ? 'success' : 'error',
        message: outcome.message,
        simulated: outcome.simulated,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestOutcome({
        type: 'error',
        message: `Test failed: ${msg}`,
        simulated: false,
      });
    } finally {
      if (type === 'user') setIsTestingUser(false);
      else setIsTestingOwner(false);
    }
  };

  const copyToClipboard = (text: string, type: 'user' | 'owner') => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(type);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  const sampleUserTemplate = `Subject: Consultation Confirmed: {{company_name}} & {{user_name}}

Hi {{user_name}},

Thank you for reaching out to {{company_name}}. We have received your inquiry regarding:
{{service_interest}}

Details provided:
- Organization: {{company}}
- Notes/Requirements: {{message}}
- Submitted At: {{submitted_at}}

Our quality engineering leadership will review your requirements and respond within 24 business hours.

Best regards,
{{company_name}} Engineering Team
Direct Contact: {{owner_email}}`;

  const sampleOwnerTemplate = `Subject: ⚡ [New Lead] {{lead_name}} - {{service_interest}}

New consultation request received on the website:

• Client Name: {{lead_name}}
• Work Email: {{lead_email}}
• Company / Org: {{lead_company}}
• Focus Area: {{service_interest}}
• Source: {{source}}
• Submitted: {{submitted_at}}

Message / Scope:
{{lead_message}}

(Reply directly to this email to contact {{lead_name}} at {{lead_email}}).`;

  return (
    <div className="space-y-6">
      {/* Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#0C111A] border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Automated Email Service (EmailJS)
            </h2>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Live EmailJS Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Simulation Mode (Keys Pending)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automatically dispatch instant confirmation emails to clients upon contact form submission, and urgent lead alerts to the business owner ({formData.ownerNotificationEmail || adminEmail}).
          </p>
        </div>

        <a
          href="https://dashboard.emailjs.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 transition-colors shrink-0"
        >
          <span>EmailJS Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: API Configuration Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSave}
            className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#0C111A] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  EmailJS Service Credentials
                </h3>
              </div>
              <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className={formData.isEnabled ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}>
                  {formData.isEnabled ? 'Service Active' : 'Service Disabled'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  EmailJS Service ID *
                </label>
                <input
                  type="text"
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  placeholder="e.g. service_xyz123"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Found under Email Services in EmailJS</span>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  EmailJS Public Key *
                </label>
                <input
                  type="text"
                  value={formData.publicKey}
                  onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                  placeholder="e.g. user_abc123 or public_key"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Found in EmailJS &gt; Account &gt; API Keys</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Client Confirmation Template ID
                </label>
                <input
                  type="text"
                  value={formData.userConfirmationTemplateId}
                  onChange={(e) => setFormData({ ...formData, userConfirmationTemplateId: e.target.value })}
                  placeholder="e.g. template_client_confirm"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Dispatched to the submitting user</span>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Owner Alert Template ID
                </label>
                <input
                  type="text"
                  value={formData.ownerAlertTemplateId}
                  onChange={(e) => setFormData({ ...formData, ownerAlertTemplateId: e.target.value })}
                  placeholder="e.g. template_owner_alert"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Dispatched to business owner</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Owner Notification Email
              </label>
              <input
                type="email"
                value={formData.ownerNotificationEmail}
                onChange={(e) => setFormData({ ...formData, ownerNotificationEmail: e.target.value })}
                placeholder="devmarlow01@gmail.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Target recipient for all incoming consultation lead alerts.
              </span>
            </div>

            {/* Notification Delivery Rules */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-700 dark:text-slate-300 block">
                Delivery Dispatch Controls
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.sendUserConfirmation}
                    onChange={(e) => setFormData({ ...formData, sendUserConfirmation: e.target.checked })}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Send Confirmation to Client</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.sendOwnerAlert}
                    onChange={(e) => setFormData({ ...formData, sendOwnerAlert: e.target.checked })}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Send Alert to Business Owner</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={resetEmailConfigToDefault}
                className="px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Reset Defaults
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>

            {isSaved && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono text-emerald-700 dark:text-emerald-300 text-center animate-in fade-in">
                Configuration successfully saved to Firestore & Local Storage!
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Live Diagnostic & Test Dispatch */}
        <div className="lg:col-span-5 space-y-6">
          {/* Test Dispatch Panel */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0C111A] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Send className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Test & Diagnostic
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify your integration by dispatching a sample test email right now to verify delivery.
            </p>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recipient Email for Test
              </label>
              <input
                type="email"
                value={testEmailTarget}
                onChange={(e) => setTestEmailTarget(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleTest('user')}
                disabled={isTestingUser || isTestingOwner || !testEmailTarget.trim()}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-[11px] uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isTestingUser ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                <span>Test Client Email</span>
              </button>

              <button
                type="button"
                onClick={() => handleTest('owner')}
                disabled={isTestingUser || isTestingOwner || !testEmailTarget.trim()}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono font-bold text-[11px] uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isTestingOwner ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Test Owner Alert</span>
              </button>
            </div>

            {testOutcome && (
              <div
                className={`p-3 rounded-lg text-xs font-mono border ${
                  testOutcome.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800'
                }`}
              >
                <div className="font-bold mb-0.5">
                  {testOutcome.simulated ? 'SIMULATED EXECUTION' : 'LIVE API RESULT'}:
                </div>
                <div className="break-words">{testOutcome.message}</div>
              </div>
            )}
          </div>

          {/* Quick Setup Checklist */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0C111A]/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <span className="font-mono uppercase font-bold text-slate-700 dark:text-slate-300 block text-[11px]">
              How EmailJS Works:
            </span>
            <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-sky-500 font-bold">1.</span>
                <span>User submits inquiry on public contact form.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-500 font-bold">2.</span>
                <span>Inquiry is instantly saved to Firestore and local CRM logs.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-500 font-bold">3.</span>
                <span>EmailJS dispatches confirmation to the lead and urgent notification to the owner.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-500 font-bold">4.</span>
                <span>Delivery timestamp is recorded directly on the lead document.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommended EmailJS Template Structures */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#0C111A] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FileText className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            EmailJS Template Reference &amp; Ready-to-Paste Content
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          In your EmailJS dashboard, create two email templates and paste the corresponding template body below. The parameters match exactly what the application sends.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Confirmation Template */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                1. Client Confirmation Template
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(sampleUserTemplate, 'user')}
                className="inline-flex items-center gap-1 text-[10px] font-mono text-sky-600 dark:text-sky-400 hover:underline"
              >
                {copiedTemplate === 'user' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedTemplate === 'user' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-2.5 rounded bg-white dark:bg-black/50 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {sampleUserTemplate}
            </pre>
          </div>

          {/* Owner Alert Template */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                2. Business Owner Alert Template
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(sampleOwnerTemplate, 'owner')}
                className="inline-flex items-center gap-1 text-[10px] font-mono text-sky-600 dark:text-sky-400 hover:underline"
              >
                {copiedTemplate === 'owner' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedTemplate === 'owner' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-2.5 rounded bg-white dark:bg-black/50 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {sampleOwnerTemplate}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
