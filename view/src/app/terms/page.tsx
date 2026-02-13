import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata = {
  title: 'Terms of Service | juztadrop',
  description: 'Terms and conditions for using juztadrop.',
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      description="Terms and conditions for using juztadrop."
    >
      <h2>1. Acceptance of terms</h2>
      <p>
        By accessing or using juztadrop, you agree to these Terms of Service. If you do
        not agree, please do not use our platform.
      </p>

      <h2>2. Use of the platform</h2>
      <p>
        juztadrop connects volunteers with organisations. You may use the platform as a
        volunteer to find and apply to opportunities, or as an organisation to post
        opportunities and manage volunteers. You agree to provide accurate information
        and use the service lawfully.
      </p>

      <h2>3. Account responsibility</h2>
      <p>
        You are responsible for maintaining the security of your account. Do not share
        your credentials. You are responsible for all activity under your account.
      </p>

      <h2>4. Prohibited conduct</h2>
      <p>
        You may not use juztadrop to harass others, post false or misleading content,
        violate laws, or abuse the platform. We reserve the right to suspend or terminate
        accounts that violate these terms.
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        The juztadrop platform, including its design, branding, and software, is owned by
        us. You retain ownership of content you post, but grant us a license to use it
        to operate the service.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        juztadrop is provided &quot;as is&quot;. We are not liable for indirect, incidental, or
        consequential damages arising from your use of the platform.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may update these terms from time to time. Continued use after changes
        constitutes acceptance. We will notify you of material changes.
      </p>

      <h2>8. Contact</h2>
      <p>
        For questions about these terms, contact us at legal@juztadrop.xyz.
      </p>
    </LegalPageLayout>
  );
}
