import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@justadrop.xyz';

const resend = new Resend(RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email not sent.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Email Templates

export const sendWelcomeVolunteerEmail = async (email: string, name: string) => {
  return sendEmail({
    to: email,
    subject: 'Welcome to Just a Drop!',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining Just a Drop as a volunteer.</p>
      <p>You can now start browsing and applying for volunteer opportunities in your area.</p>
      <p>Start making a difference today!</p>
    `,
  });
};

export const sendOrganizationRegistrationEmail = async (email: string, name: string) => {
  return sendEmail({
    to: email,
    subject: 'Organization Registration Received',
    html: `
      <h1>Thank you for registering, ${name}!</h1>
      <p>Your organization registration has been received and is currently pending approval.</p>
      <p>Our admin team will review your application and get back to you shortly.</p>
      <p>Once approved, you'll be able to post volunteer opportunities.</p>
    `,
  });
};

export const sendOrganizationApprovedEmail = async (
  email: string,
  name: string,
  notes?: string
) => {
  return sendEmail({
    to: email,
    subject: 'Organization Approved - Welcome to Just a Drop!',
    html: `
      <h1>Congratulations ${name}!</h1>
      <p>Your organization has been approved on Just a Drop.</p>
      <p>You can now start posting volunteer opportunities and connecting with volunteers.</p>
      ${notes ? `<p><strong>Admin notes:</strong> ${notes}</p>` : ''}
      <p>Thank you for joining our platform!</p>
    `,
  });
};

export const sendOrganizationRejectedEmail = async (
  email: string,
  name: string,
  notes: string
) => {
  return sendEmail({
    to: email,
    subject: 'Organization Registration Update',
    html: `
      <h1>Hello ${name},</h1>
      <p>Unfortunately, we are unable to approve your organization registration at this time.</p>
      <p><strong>Reason:</strong> ${notes}</p>
      <p>If you have any questions, please contact our support team.</p>
    `,
  });
};

export const sendApplicationReceivedEmail = async (
  email: string,
  volunteerName: string,
  opportunityTitle: string
) => {
  return sendEmail({
    to: email,
    subject: 'Application Received',
    html: `
      <h1>Application Received!</h1>
      <p>Hi ${volunteerName},</p>
      <p>Your application for <strong>${opportunityTitle}</strong> has been received.</p>
      <p>The organization will review your application and get back to you soon.</p>
    `,
  });
};

export const sendApplicationStatusEmail = async (
  email: string,
  volunteerName: string,
  opportunityTitle: string,
  status: 'accepted' | 'rejected'
) => {
  const subject = status === 'accepted'
    ? 'Application Accepted!'
    : 'Application Update';

  const message = status === 'accepted'
    ? 'Congratulations! Your application has been accepted.'
    : 'Thank you for your interest. Unfortunately, your application was not selected at this time.';

  return sendEmail({
    to: email,
    subject,
    html: `
      <h1>Application Update</h1>
      <p>Hi ${volunteerName},</p>
      <p>Your application for <strong>${opportunityTitle}</strong> has been reviewed.</p>
      <p>${message}</p>
    `,
  });
};
