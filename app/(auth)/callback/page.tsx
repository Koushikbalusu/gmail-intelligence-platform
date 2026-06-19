'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { data, error } = await supabase.auth.exchangeCodeForSession(
        new URL(window.location.href).searchParams.get('code') || ''
      );

      if (error) {
        router.push('/auth/error');
        return;
      }

      router.push('/');
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Processing authentication...</h1>
        <p className="text-gray-600 mt-2">Please wait while we complete your login.</p>
      </div>
    </div>
  );
}
