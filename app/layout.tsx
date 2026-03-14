import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🖼️ Image Background Remover',
  description: 'Remove image background instantly - free online tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
