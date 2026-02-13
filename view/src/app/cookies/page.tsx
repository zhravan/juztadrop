import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata = {
  title: 'Cookie Policy | juztadrop',
  description: 'How juztadrop uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="How we use cookies and similar technologies on juztadrop."
    >
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They
        help the site remember your preferences and improve your experience.
      </p>

      <h2>2. Cookies we use</h2>
      <p>We use the following types of cookies:</p>
      <ul>
        <li>
          <strong>Essential cookies</strong> — Required for the platform to work, e.g.
          keeping you logged in (session authentication).
        </li>
        <li>
          <strong>Preference cookies</strong> — Remember your choices, such as language
          or region.
        </li>
        <li>
          <strong>Analytics cookies</strong> — Help us understand how visitors use the
          platform so we can improve it.
        </li>
      </ul>

      <h2>3. Session and authentication</h2>
      <p>
        We use a session cookie to keep you signed in. This cookie is essential for
        authentication and is stored securely. It expires when you log out or after a
        period of inactivity.
      </p>

      <h2>4. Third-party cookies</h2>
      <p>
        We may use services that set their own cookies (e.g. analytics). These are
        subject to the respective provider&apos;s privacy policy.
      </p>

      <h2>5. Managing cookies</h2>
      <p>
        Most browsers allow you to control cookies through settings. You can block or
        delete cookies, though this may affect how the platform works. Essential cookies
        are necessary for core functionality.
      </p>

      <h2>6. Updates</h2>
      <p>
        We may update this Cookie Policy as our practices change. Check this page
        periodically for updates.
      </p>

      <h2>7. Contact</h2>
      <p>
        For cookie-related questions, contact us at privacy@juztadrop.xyz.
      </p>
    </LegalPageLayout>
  );
}
