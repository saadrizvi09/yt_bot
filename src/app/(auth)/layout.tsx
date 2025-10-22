import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Link */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300 hover:from-white hover:to-blue-400 transition-all">
            YT Bot
          </Link>
        </div>

        {/* Glassmorphism Card for Auth Forms */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}