'use client';

import { useState, useEffect } from 'react';

export default function DeploymentInfo() {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeploymentInfo() {
      try {
        const res = await fetch('/api/deployment-check');
        if (!res.ok) {
          throw new Error(`Failed to fetch deployment info: ${res.status}`);
        }
        const data = await res.json();
        setInfo(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch deployment information');
        console.error('Error fetching deployment info:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDeploymentInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4">Loading deployment information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Deployment Info</h1>
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Deployment Information</h1>
      
      <div className="grid gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Server Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span className={info?.status === 'ok' ? 'text-green-600' : 'text-red-600'}>
                {info?.status}
              </span>
            </div>
            <div>
              <span className="font-medium">Server Time:</span> {info?.serverTime}
            </div>
            <div>
              <span className="font-medium">Uptime:</span> {Math.round(info?.uptime)} seconds
            </div>
            <div>
              <span className="font-medium">Response Time:</span> {info?.responseTimeMs}ms
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {info?.environment && Object.entries(info.environment).map(([key, value]: [string, any]) => (
              <div key={key}>
                <span className="font-medium">{key}:</span>{' '}
                <span className={value === 'Missing' ? 'text-red-600' : ''}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Deployment</h2>
          {info?.deployment && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(info.deployment).map(([key, value]: [string, any]) => (
                <div key={key}>
                  <span className="font-medium">{key}:</span> {value}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Database</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span className={info?.database?.status === 'Connected' ? 'text-green-600' : 'text-red-600'}>
                {info?.database?.status}
              </span>
            </div>
            {info?.database?.error && (
              <div>
                <span className="font-medium">Error:</span>{' '}
                <span className="text-red-600">
                  {info?.database?.error?.message} (Code: {info?.database?.error?.code})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Server Info</h2>
          <div>
            <div className="mb-2">
              <span className="font-medium">Node.js Version:</span> {info?.serverInfo?.nodejs}
            </div>
            {info?.serverInfo?.memoryUsage && (
              <div>
                <h3 className="text-lg font-medium mb-2">Memory Usage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(info.serverInfo.memoryUsage).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span>{' '}
                      {Math.round(value / 1024 / 1024 * 100) / 100} MB
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
