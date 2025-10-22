import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { ArrowRightIcon, ChartBarIcon, BoltIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default async function LandingPage() {
  const token = (await cookies()).get('token')?.value;
  const payload = token ? verifyToken(token) : null;
  const isAuthenticated = !!payload?.userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 text-white overflow-x-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Glassmorphism Navigation */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/60 border-b border-white/10 shadow-lg">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
                YT Bot
              </span>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                  <form action="/api/auth/logout" method="post">
                    <button type="submit" className="rounded-md bg-red-600/80 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-red-600 hover:scale-105">Sign out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign in</Link>
                  <Link href="/sign-up" className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="mx-auto max-w-4xl px-6 pt-24 pb-16 sm:pt-32 text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-4 py-2 text-sm text-gray-300 backdrop-blur-md bg-white/5 border border-white/10">
                🚀 Powered by Gemini & AssemblyAI
              </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                {isAuthenticated ? 'Welcome Back!' : 'Ask Anything,'}
              </span>
              <span className="block mt-2">
                About Any YouTube Video
              </span>
            </h1>
            <p className="mt-8 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
              {isAuthenticated
                ? 'Ready to dive deeper into your video library? Add a new video or explore your dashboard to get started.'
                : 'Transform any YouTube video into an interactive chatbot. Upload, ask questions, and get instant, intelligent answers from the video’s content.'
              }
            </p>
            <div className="mt-12 flex items-center justify-center gap-6">
              <Link
                href={isAuthenticated ? "/videos/new" : "/sign-up"}
                className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30"
              >
                {isAuthenticated ? 'Add New Video' : 'Get Started Free'}
                <ArrowRightIcon className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16 sm:mt-24">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<ChartBarIcon className="w-6 h-6 text-blue-400" />}
                title="Smart Video Analysis"
                description="Our AI transcribes and analyzes videos to understand the content, context, and key topics."
              />
              <FeatureCard
                icon={<ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-400" />}
                title="Instant Q&A"
                description="Ask complex questions in natural language and get accurate, context-aware answers in seconds."
              />
              <FeatureCard
                icon={<BoltIcon className="w-6 h-6 text-indigo-400" />}
                title="Lightning Fast"
                description="Powered by cutting-edge AI for rapid processing and near-instantaneous responses."
              />
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-8 mt-24 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} YT Bot. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

// Feature Card Component for cleaner code
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-white/20 hover:shadow-blue-500/20">
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-800 border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}