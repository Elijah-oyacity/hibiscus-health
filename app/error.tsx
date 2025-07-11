'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We apologize for the inconvenience. Our team has been notified of this issue.
      </p>
      {error.digest && (
        <p className="text-sm text-muted-foreground mb-6">
          Error Reference: {error.digest}
        </p>
      )}
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
