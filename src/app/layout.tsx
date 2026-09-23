import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'FYtech | Business software, connected',
    template: '%s | FYtech',
  },
  description: 'Business software, connected by FYtech for modern teams, subscriptions, and operations.',
  openGraph: {
    title: 'FYtech',
    description: 'Business software, connected by FYtech for modern teams, subscriptions, and operations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
