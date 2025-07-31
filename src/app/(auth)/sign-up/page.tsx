import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-bold">Create an account</h1>
      <SignUp />
    </div>
  );
} 