import { Inter } from 'next/font/google';
import { UserButton, currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import { db } from '@/lib/db'; // Re-importing explicitly

const inter = Inter({ subsets: ['latin'] });

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) {
    // Check if user exists in our database
    const existingUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    // If user does not exist, create them
    if (!existingUser) {
      await db.user.create({
        data: {
          id: user.id,
          emailAddress: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || null, // lastName can be null in Clerk
        },
      });
    }
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            YouTube Q&A
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link 
              href="/videos/new" 
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Add Video
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 