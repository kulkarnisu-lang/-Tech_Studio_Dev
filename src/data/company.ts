import { CompanyConfig } from '../types';

export const COMPANY_CONFIG: CompanyConfig = {
  name: 'Tech_Studio',
  tagline: 'Quality Engineering, Test Automation & AI Automation',
  positioning:
    'We help software teams build better quality into their products through intelligent testing, automation, Quality Engineering, and AI-powered engineering practices.',
  email: 'contact@techstudio.consulting',
  founderName: 'Dev Marlow / Sharad',
  founderTitle: 'Founder & Principal Quality Engineer',
  founderBio:
    '[Add 2-3 sentences of professional engineering background: e.g., 12+ years leading test architecture, test automation frameworks, CI/CD quality gates, and AI-assisted engineering practices across enterprise and high-growth SaaS environments.]',
  location: 'Global Remote / Pune, India',
  linkedinUrl: 'https://linkedin.com',
  githubUrl: 'https://github.com',
  websiteUrl: 'https://techstudio.consulting',
  calendarBookingUrl: '#contact',
};

// Saved profiles take precedence over defaults, but old template names must
// not hide the verified founder name after a deployment.
export function resolveCompanyConfig(saved: Partial<CompanyConfig>): CompanyConfig {
  const founderName = typeof saved?.founderName === 'string' ? saved.founderName.trim() : '';
  const isPlaceholder = /^\[\s*founder\s*name\s*\/\s*principal\s*consultant\s*\]$/i.test(founderName);

  return {
    ...COMPANY_CONFIG,
    ...saved,
    founderName: !founderName || isPlaceholder ? COMPANY_CONFIG.founderName : founderName,
  };
}
