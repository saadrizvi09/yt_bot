import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-bold">Sign in to your account</h1>
      <SignIn />
    </div>
  );
} 