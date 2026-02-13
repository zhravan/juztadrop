import { InProgressPage } from '@/components/common/InProgressPage';

export const metadata = {
  title: 'Create organisation | juztadrop',
  description: 'Register your NGO or organisation to post volunteering opportunities.',
};

export default function CreateOrganisationPage() {
  return (
    <InProgressPage
      title="Create organisation"
      description="Register your NGO and post opportunities for volunteers. We're building this."
    />
  );
}
