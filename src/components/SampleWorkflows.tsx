import { FileJson, LockKeyhole } from 'lucide-react';
import { SAMPLE_WORKFLOWS } from '../data/sampleWorkflows';

interface SampleWorkflowsProps {
  onOpenResource: () => void;
}

export default function SampleWorkflows({ onOpenResource }: SampleWorkflowsProps) {
  return (
    <section id="sample-workflows" className="py-16 sm:py-20 bg-slate-100/60 dark:bg-[#0C111A] border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8 space-y-3">
          <p className="text-sm font-mono font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">Workflow samples</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F8FAFC]">Reference Architecture Library</h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">Explore 10 QA and Quality Engineering blueprints plus 2 business automation examples. Each JSON file outlines the inputs, workflow, and review steps for your team to adapt.</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">These reference designs need implementation and tool configuration before they can run.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_WORKFLOWS.map((workflow) => (
            <article key={workflow.id} className="p-5 rounded-xl bg-white dark:bg-[#0A0C10] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3 mb-3">
                <FileJson className="w-5 h-5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{workflow.category === 'qa-workflows' ? 'QA / QE' : 'Business automation'} · v{workflow.version}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC] mb-2">{workflow.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{workflow.summary}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <button id="unlock-workflow-library" type="button" onClick={onOpenResource} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-mono font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors">
            <LockKeyhole className="w-4 h-4" aria-hidden="true" />
            Unlock the Full Library
          </button>
          <p className="text-sm text-slate-600 dark:text-slate-400">Share your name and email to access all 12 JSON downloads.</p>
        </div>
      </div>
    </section>
  );
}
