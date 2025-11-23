'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-heading-1">SECTRA</h1>
        <p className="text-body text-muted-foreground mt-2">Loading...</p>
      </div>
    </div>
  );
}