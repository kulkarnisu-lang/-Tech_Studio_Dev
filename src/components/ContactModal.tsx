import { useState, useEffect, type FormEvent } from 'react';
import { X, Send, CheckCircle2, Terminal, Loader2, Mail, ShieldCheck, Download } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { SendEmailOutcome } from '../lib/emailService';
import { SAMPLE_WORKFLOWS } from '../data/sampleWorkflows';

export type ContactModalMode = 'consultation' | 'sample-download';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  mode?: ContactModalMode;
}

export default function ContactModal({ isOpen, onClose, initialTopic, mode = 'consultation' }: ContactModalProps) {
  const { companyConfig, addInquiry } = useAdmin();
  const isSampleDownload = mode === 'sample-download';

  const getInitialFormData = (topic?: string) => ({
    name: '',
    email: '',
    company: '',
    serviceInterest: topic || 'Quality Engineering Strategy',
    message: '',
  });

  const [formData, setFormData] = useState(() => getInitialFormData(initialTopic));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailOutcome, setEmailOutcome] = useState<SendEmailOutcome | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Reset modal state whenever it is opened
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setEmailOutcome(null);
      setSubmissionError(null);
      setFormData(getInitialFormData(initialTopic));
    }
  }, [isOpen, initialTopic]);

  const handleClose = () => {
    setSubmitted(false);
    setEmailOutcome(null);
    setSubmissionError(null);
    setFormData(getInitialFormData(initialTopic));
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      // Log inquiry to admin dashboard and dispatch dual emails
      const res = await addInquiry({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        serviceInterest: formData.serviceInterest,
        message: formData.message || (isSampleDownload ? 'Requested the sample workflow library.' : 'Consultation request from website modal.'),
        source: isSampleDownload ? 'sample-download' : 'modal',
      });

      setEmailOutcome(res.emailOutcome);
      setSubmitted(true);
    } catch (err) {
      console.error('Modal submission failed:', err);
      setSubmissionError('We couldn’t save your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="consultation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
        className="relative w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white dark:bg-[#0C111A] rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded bg-slate-900 text-sky-400 dark:bg-slate-900 flex items-center justify-center border border-slate-700">
            <Terminal className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
            {companyConfig.name} Advisory
          </span>
        </div>

        <h3 id="consultation-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight mb-1">
          {isSampleDownload ? 'Get the Workflow Samples' : 'Book a Quality Consultation'}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
          {isSampleDownload ? 'Share your name and work email to access all 12 JSON workflow blueprints.' : 'Discuss your testing stack, automation bottlenecks, or AI roadmap with our principal consultants.'}
        </p>

        {submitted && isSampleDownload ? (
          <div className="space-y-4" aria-live="polite">
            <div className="p-4 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-500/10">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Your workflow samples are ready</h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Download each blueprint below and adapt it to your tools and environment.</p>
            </div>
            <ul className="space-y-2 max-h-80 overflow-y-auto pr-1" aria-label="Workflow downloads">
              {SAMPLE_WORKFLOWS.map((workflow) => (
                <li key={workflow.id}>
                  <a href={workflow.filePath} download={`${workflow.id}.json`} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500 text-slate-900 dark:text-white focus-visible:outline-2 focus-visible:outline-sky-500">
                    <span>
                      <span className="block text-sm font-semibold">{workflow.title}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">JSON · v{workflow.version}</span>
                    </span>
                    <Download className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg text-sm font-mono font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90">Close Window</button>
            </div>
          </div>
        ) : submitted ? (
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#0C111A] border border-emerald-200 dark:border-emerald-800/80 text-left space-y-3.5 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Consultation Request Dispatched
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Logged to CRM and notifications automatically routed.
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-[#0A0C10] border border-slate-200 dark:border-slate-800">
                <Mail className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Confirmation to Client:
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{formData.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-[#0A0C10] border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Leadership Alert Sent:
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{companyConfig.email}</span>
                </div>
              </div>
            </div>

            {emailOutcome && (
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Status: {emailOutcome.simulated ? 'Simulation mode (keys pending)' : 'EmailJS active'}
              </p>
            )}

            <div className="pt-1 flex items-center justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {submissionError && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{submissionError}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="modal-name" className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name *
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label htmlFor="modal-email" className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email *
                </label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@company.com"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className={isSampleDownload ? '' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}>
              <div>
                <label htmlFor="modal-company" className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company
                </label>
                <input
                  id="modal-company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Name"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {!isSampleDownload && <div>
                <label htmlFor="modal-topic" className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Discussion Topic
                </label>
                <input
                  id="modal-topic"
                  type="text"
                  value={formData.serviceInterest}
                  onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>}
            </div>

            {!isSampleDownload && <div>
              <label htmlFor="modal-message" className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Context / Key Question
              </label>
              <textarea
                id="modal-message"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your testing challenges, timeline, or current goals..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0C10] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>}

            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md font-mono font-bold text-xs uppercase tracking-wider text-slate-950 bg-sky-500 hover:bg-sky-400 transition-all shadow-2xs disabled:opacity-75 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isSampleDownload ? 'Preparing Your Downloads...' : 'Dispatching Request & Emails...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isSampleDownload ? 'Access All 12 Downloads' : 'Initiate Consultation Request'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
