import { InProgressPage } from '@/components/common/InProgressPage';

export const metadata = {
  title: 'About | just a drop',
  description: 'Learn about just a drop and our mission.',
};

export default function AboutPage() {
  return (
    <InProgressPage
      title="About us"
      description="Learn about our mission to connect volunteers with organisations that need help."
    />
  );
}
