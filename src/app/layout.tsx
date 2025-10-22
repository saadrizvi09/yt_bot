import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YouTube Video Q&A',
  description: 'Ask questions about YouTube video content using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 text-gray-300`}>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}