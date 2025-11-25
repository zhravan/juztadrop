import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Just a Drop',
  description: 'Connect volunteers with organizations',
  icons: {
    icon: '/jad.png',
    shortcut: '/jad.png',
    apple: '/jad.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
