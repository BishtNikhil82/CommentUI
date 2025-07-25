// src/app/auth/reauth/page.tsx
'use client';
import { useState } from 'react';
import { signInWithGoogle } from '@/lib/auth';

export default function ReauthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReauth = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Supabase will handle redirect
    } catch (err: any) {
      setError(err.message || 'Re-authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Re-authenticate with YouTube</h1>
        <p className="mb-6">To continue, please re-authenticate your YouTube account.</p>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-60"
          onClick={handleReauth}
          disabled={loading}
        >
          {loading ? 'Redirecting...' : 'Re-authenticate'}
        </button>
      </div>
    </div>
  );
} 