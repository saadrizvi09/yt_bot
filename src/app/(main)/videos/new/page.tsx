import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import AddVideoForm from '@/components/AddVideoForm';

export default async function NewVideoPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New YouTube Video</h1>
      <AddVideoForm />
    </div>
  );
} 