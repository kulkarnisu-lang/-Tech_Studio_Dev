import emailjs from '@emailjs/browser';
import { EmailServiceConfig, EmailDeliveryStatus } from '../types';

export const DEFAULT_EMAIL_CONFIG: EmailServiceConfig = {
  serviceId: (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || '',
  publicKey: (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || '',
  userConfirmationTemplateId:
    (import.meta.env.VITE_EMAILJS_TEMPLATE_CONFIRMATION as string) ||
    (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) ||
    '',
  ownerAlertTemplateId:
    (import.meta.env.VITE_EMAILJS_TEMPLATE_ALERT as string) ||
    (import.meta.env.VITE_EMAILJS_ALERT_TEMPLATE_ID as string) ||
    '',
  ownerNotificationEmail:
    (import.meta.env.VITE_ADMIN_EMAIL as string) || 'devmarlow01@gmail.com',
  sendUserConfirmation: true,
  sendOwnerAlert: true,
  isEnabled: true,
};

export interface ContactEmailPayload {
  name: string;
  email: string;
  company?: string;
  serviceInterest: string;
  message?: string;
  companyName?: string;
  ownerEmail?: string;
  source?: string;
}

export interface SendEmailOutcome {
  success: boolean;
  userConfirmationSent: boolean;
  ownerAlertSent: boolean;
  simulated: boolean;
  userError?: string;
  ownerError?: string;
  details: string;
  timestamp: string;
  emailDelivery: EmailDeliveryStatus;
}

/**
 * Checks if EmailJS is fully configured with required API keys
 */
export function isEmailJsConfigured(config: EmailServiceConfig): boolean {
  return Boolean(
    config.isEnabled &&
      config.serviceId &&
      config.serviceId.trim().length > 0 &&
      config.publicKey &&
      config.publicKey.trim().length > 0
  );
}

/**
 * Dispatches both User Confirmation and Business Owner Alert emails
 */
export async function sendContactEmails(
  payload: ContactEmailPayload,
  config: EmailServiceConfig = DEFAULT_EMAIL_CONFIG
): Promise<SendEmailOutcome> {
  const timestamp = new Date().toISOString();
  const targetOwnerEmail =
    config.ownerNotificationEmail?.trim() ||
    payload.ownerEmail?.trim() ||
    'devmarlow01@gmail.com';
  const companyName = payload.companyName || 'TechStudio Quality Engineering';

  // If email notifications are disabled
  if (!config.isEnabled) {
    return {
      success: true,
      userConfirmationSent: false,
      ownerAlertSent: false,
      simulated: true,
      details: 'Email notifications are paused in settings.',
      timestamp,
      emailDelivery: {
        userConfirmationSent: false,
        ownerAlertSent: false,
        simulated: true,
        userConfirmationTimestamp: timestamp,
      },
    };
  }

  // Check if live EmailJS credentials are provided
  const hasLiveKeys = isEmailJsConfigured(config);

  if (!hasLiveKeys) {
    // Simulated / Developer preview delivery
    console.info(
      `[EmailService Simulation] User Confirmation dispatched to ${payload.email}, Owner Alert dispatched to ${targetOwnerEmail}`
    );

    return {
      success: true,
      userConfirmationSent: config.sendUserConfirmation,
      ownerAlertSent: config.sendOwnerAlert,
      simulated: true,
      details: `Dispatched confirmation to ${payload.email} and alert to ${targetOwnerEmail} (Simulated mode: Add EmailJS credentials to connect live SMTP).`,
      timestamp,
      emailDelivery: {
        userConfirmationSent: config.sendUserConfirmation,
        userConfirmationTimestamp: timestamp,
        ownerAlertSent: config.sendOwnerAlert,
        ownerAlertTimestamp: timestamp,
        simulated: true,
      },
    };
  }

  // Live EmailJS dispatch
  let userSuccess = false;
  let ownerSuccess = false;
  let userErrorMsg: string | undefined;
  let ownerErrorMsg: string | undefined;

  // 1. Send User Confirmation Email
  if (config.sendUserConfirmation) {
    const templateId =
      config.userConfirmationTemplateId?.trim() ||
      config.ownerAlertTemplateId?.trim() ||
      '';

    if (templateId) {
      try {
        const userParams = {
          to_name: payload.name,
          to_email: payload.email,
          user_name: payload.name,
          user_email: payload.email,
          recipient: payload.email,
          company: payload.company || 'Not specified',
          service_interest: payload.serviceInterest,
          message: payload.message || 'Consultation request.',
          company_name: companyName,
          owner_email: targetOwnerEmail,
          reply_to: targetOwnerEmail,
          submitted_at: new Date().toLocaleString(),
        };

        await emailjs.send(
          config.serviceId.trim(),
          templateId,
          userParams,
          config.publicKey.trim()
        );
        userSuccess = true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Failed to send user confirmation email via EmailJS:', err);
        userErrorMsg = `User confirmation error: ${message}`;
      }
    } else {
      userErrorMsg = 'User confirmation template ID missing.';
    }
  }

  // 2. Send Business Owner Alert Email
  if (config.sendOwnerAlert) {
    const templateId =
      config.ownerAlertTemplateId?.trim() ||
      config.userConfirmationTemplateId?.trim() ||
      '';

    if (templateId) {
      try {
        const ownerParams = {
          to_name: 'Lead Manager / Business Owner',
          to_email: targetOwnerEmail,
          owner_email: targetOwnerEmail,
          recipient: targetOwnerEmail,
          lead_name: payload.name,
          lead_email: payload.email,
          lead_company: payload.company || 'Individual / Not specified',
          service_interest: payload.serviceInterest,
          lead_message: payload.message || 'No additional message provided.',
          source: payload.source || 'Website Contact Form',
          submitted_at: new Date().toLocaleString(),
          reply_to: payload.email,
          company_name: companyName,
        };

        await emailjs.send(
          config.serviceId.trim(),
          templateId,
          ownerParams,
          config.publicKey.trim()
        );
        ownerSuccess = true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Failed to send business owner alert via EmailJS:', err);
        ownerErrorMsg = `Owner alert error: ${message}`;
      }
    } else {
      ownerErrorMsg = 'Owner alert template ID missing.';
    }
  }

  const combinedError = [userErrorMsg, ownerErrorMsg].filter(Boolean).join('; ');
  const isOverallSuccess = userSuccess || ownerSuccess || (!userErrorMsg && !ownerErrorMsg);

  return {
    success: isOverallSuccess,
    userConfirmationSent: userSuccess,
    ownerAlertSent: ownerSuccess,
    simulated: false,
    userError: userErrorMsg,
    ownerError: ownerErrorMsg,
    details: isOverallSuccess
      ? `Emails successfully sent via EmailJS: Confirmation to ${payload.email} (${userSuccess ? 'OK' : 'Skipped/Failed'}), Alert to ${targetOwnerEmail} (${ownerSuccess ? 'OK' : 'Skipped/Failed'})`
      : `Email dispatch encountered issues: ${combinedError}`,
    timestamp,
    emailDelivery: {
      userConfirmationSent: userSuccess,
      userConfirmationTimestamp: userSuccess ? timestamp : undefined,
      ownerAlertSent: ownerSuccess,
      ownerAlertTimestamp: ownerSuccess ? timestamp : undefined,
      simulated: false,
      error: combinedError || undefined,
    },
  };
}

/**
 * Sends a single test email for verification
 */
export async function sendTestEmail(
  type: 'user' | 'owner',
  targetEmail: string,
  config: EmailServiceConfig
): Promise<{ success: boolean; message: string; simulated: boolean }> {
  if (!isEmailJsConfigured(config)) {
    return {
      success: true,
      simulated: true,
      message: `[Simulated Test OK] Test ${type === 'user' ? 'Client Confirmation' : 'Owner Alert'} dispatched to ${targetEmail}. (Provide EmailJS Service ID and Public Key to send real emails).`,
    };
  }

  const templateId =
    type === 'user'
      ? config.userConfirmationTemplateId.trim() || config.ownerAlertTemplateId.trim()
      : config.ownerAlertTemplateId.trim() || config.userConfirmationTemplateId.trim();

  if (!templateId) {
    return {
      success: false,
      simulated: false,
      message: `Error: Please enter a ${type === 'user' ? 'User Confirmation' : 'Owner Alert'} Template ID first.`,
    };
  }

  try {
    const params = {
      to_name: type === 'user' ? 'Valued Client (Test)' : 'Business Owner (Test)',
      to_email: targetEmail,
      recipient: targetEmail,
      user_name: 'Test Client',
      user_email: targetEmail,
      lead_name: 'Test Lead',
      lead_email: targetEmail,
      company: 'TechStudio Test Inc.',
      lead_company: 'TechStudio Test Inc.',
      service_interest: 'AI-Powered Quality Engineering (Test)',
      message: 'This is an automated test email verifying your EmailJS integration.',
      lead_message: 'This is an automated test email verifying your EmailJS integration.',
      source: 'Admin Portal Email Diagnostic',
      company_name: 'TechStudio Quality Engineering',
      owner_email: config.ownerNotificationEmail || 'devmarlow01@gmail.com',
      reply_to: config.ownerNotificationEmail || 'devmarlow01@gmail.com',
      submitted_at: new Date().toLocaleString(),
    };

    await emailjs.send(
      config.serviceId.trim(),
      templateId,
      params,
      config.publicKey.trim()
    );

    return {
      success: true,
      simulated: false,
      message: `Live EmailJS test message successfully sent to ${targetEmail}!`,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      simulated: false,
      message: `EmailJS error: ${errMsg}`,
    };
  }
}
