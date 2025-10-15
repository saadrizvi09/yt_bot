import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

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
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className={`${inter.className} min-h-screen flex flex-col`}>
          <main className="flex-1">{children}</main>
          <footer className="py-6 text-center text-sm text-muted-foreground">
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
