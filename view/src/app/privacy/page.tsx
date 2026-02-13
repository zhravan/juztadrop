import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata = {
  title: 'Privacy Policy | juztadrop',
  description: 'How juztadrop collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How we collect, use, and protect your personal information."
    >
      <h2>1. Information we collect</h2>
      <p>
        When you use juztadrop, we collect information you provide directly, such as your
        email address when you sign up, and any profile or organisation details you choose
        to add. We also collect usage data to improve our services.
      </p>

      <h2>2. How we use your information</h2>
      <p>
        We use your information to provide and improve our platform, connect volunteers
        with organisations, send you important updates about your account, and communicate
        with you about opportunities relevant to your interests.
      </p>

      <h2>3. Information sharing</h2>
      <p>
        We do not sell your personal information. We may share data with organisations
        when you apply to their opportunities, or with service providers who help us
        operate the platform, under strict confidentiality agreements.
      </p>

      <h2>4. Data security</h2>
      <p>
        We implement appropriate security measures to protect your data. Your account is
        protected by authentication, and we use industry-standard practices to safeguard
        information in transit and at rest.
      </p>

      <h2>5. Your rights</h2>
      <p>
        You can access, update, or delete your account data at any time. You may also
        request a copy of your data or object to certain processing. Contact us for
        assistance.
      </p>

      <h2>6. Contact</h2>
      <p>
        For privacy-related questions, contact us at privacy@juztadrop.xyz.
      </p>
    </LegalPageLayout>
  );
}
