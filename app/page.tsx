// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  // Optional: Show a simple loading indicator while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default Home;