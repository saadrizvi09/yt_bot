import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  );
} 