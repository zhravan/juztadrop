import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Just a Drop',
  description: 'Connect volunteers with organizations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
