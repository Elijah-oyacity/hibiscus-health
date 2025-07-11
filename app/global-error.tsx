'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
          <p className="text-xl mb-8">
            We've encountered an unexpected error
          </p>
          {error.digest && (
            <p className="text-sm text-muted-foreground mb-6">
              Error Reference: {error.digest}
            </p>
          )}
          <div className="flex gap-4">
            <button
              onClick={reset}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded bg-gray-200 text-gray-900 hover:bg-gray-300"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
