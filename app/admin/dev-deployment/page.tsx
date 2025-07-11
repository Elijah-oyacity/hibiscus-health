'use client';

import { useState, useEffect } from 'react';

export default function DevBranchDeployment() {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [deployMessage, setDeployMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDeploymentInfo();
  }, []);

  async function fetchDeploymentInfo() {
    setLoading(true);
    try {
      const res = await fetch('/api/deployment-check');
      if (!res.ok) {
        throw new Error(`Failed to fetch deployment info: ${res.status}`);
      }
      const data = await res.json();
      setInfo(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deployment information');
      console.error('Error fetching deployment info:', err);
    } finally {
      setLoading(false);
    }
  }

  // This function would be implemented in a real-world scenario
  // to trigger a webhook or AWS API call to redeploy
  async function triggerManualDeploy() {
    setDeployStatus('loading');
    setDeployMessage('Attempting to trigger deployment...');
    
    // Get the Amplify app ID from environment info
    const appId = info?.environment?.AMPLIFY_APP_ID;
    
    try {
      // Call our API endpoint to trigger a deployment
      const response = await fetch('/api/trigger-deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId: appId || process.env.NEXT_PUBLIC_AMPLIFY_APP_ID || '',
          branchName: 'dev'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to trigger deployment');
      }
      
      const data = await response.json();
      
      setDeployStatus('success');
      setDeployMessage(`Deployment triggered successfully! Job ID: ${data.jobDetails?.jobId}. Check AWS Amplify console for progress.`);
      
      // Refresh deployment info after a short delay
      setTimeout(() => {
        fetchDeploymentInfo();
      }, 3000);
    } catch (err: any) {
      setDeployStatus('error');
      setDeployMessage(`Failed to trigger deployment: ${err.message}`);
      console.error('Deployment trigger error:', err);
    }
  }

  const isDevBranch = info?.deployment?.isDevBranch === true;
  const currentBranch = info?.deployment?.currentBranch || 'Unknown';

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Dev Branch Deployment</h1>
      <p className="text-muted-foreground mb-6">
        View and manage deployments for the dev branch
      </p>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4">Loading deployment information...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDeploymentInfo}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="bg-card border p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Current Deployment Status</h2>
            
            <div className="grid gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-medium">Current Branch:</span>
                <span className={`px-2 py-1 rounded text-sm ${currentBranch === 'dev' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {currentBranch}
                </span>
              </div>
              
              <div>
                <span className="font-medium">Is Dev Branch:</span>{' '}
                {isDevBranch ? (
                  <span className="text-green-600">Yes</span>
                ) : (
                  <span className="text-amber-600">No - This is not the dev branch</span>
                )}
              </div>
              
              {info?.deployment && (
                <>
                  <div>
                    <span className="font-medium">Last Deployment:</span>{' '}
                    {info.deployment.timestamp !== 'Unknown' ? 
                      new Date(info.deployment.timestamp).toLocaleString() : 
                      'Unknown'}
                  </div>
                  
                  <div>
                    <span className="font-medium">Commit ID:</span>{' '}
                    {info.deployment.commitId || 'Unknown'}
                  </div>
                  
                  {info.deployment.gitHeadRef && info.deployment.gitHeadRef !== 'Unknown' && (
                    <div>
                      <span className="font-medium">Git Reference:</span>{' '}
                      {info.deployment.gitHeadRef}
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Manual Deployment</h3>
              <p className="text-muted-foreground mb-4">
                If automatic deployments are not working, you can trigger a manual deployment.
                This will build and deploy the current code in the dev branch.
              </p>
              
              <button
                onClick={triggerManualDeploy}
                disabled={deployStatus === 'loading'}
                className={`px-4 py-2 rounded ${
                  deployStatus === 'loading' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {deployStatus === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                    Triggering...
                  </span>
                ) : (
                  'Trigger Manual Deploy'
                )}
              </button>
              
              {deployMessage && (
                <div className={`mt-4 p-4 rounded ${
                  deployStatus === 'success' ? 'bg-green-50 text-green-800' : 
                  deployStatus === 'error' ? 'bg-red-50 text-red-800' : 
                  'bg-blue-50 text-blue-800'
                }`}>
                  {deployMessage}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Troubleshooting Steps</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Check if your GitHub repository is correctly connected to AWS Amplify</li>
                <li>Verify that the dev branch is selected for automatic deployments</li>
                <li>Look for any build errors in the AWS Amplify Console</li>
                <li>Check if the webhook from GitHub to AWS Amplify is working</li>
                <li>
                  If using the AWS Amplify CLI, run:{' '}
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                    amplify publish
                  </code>
                </li>
                <li>
                  Try using the AWS CLI to trigger a manual build:{' '}
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                    aws amplify start-job --app-id YOUR_APP_ID --branch-name dev --job-type RELEASE
                  </code>
                </li>
              </ol>
            </div>
          </div>
          
          <div className="bg-card border p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Details</h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-2">Environment Variables</h3>
                <div className="grid gap-2">
                  {info?.environment && Object.entries(info.environment).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span className={value === 'Missing' || value === 'Not set' ? 'text-red-600' : ''}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Database Status</h3>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={info?.database?.status === 'Connected' ? 'text-green-600' : 'text-red-600'}>
                      {info?.database?.status}
                    </span>
                  </div>
                  
                  {info?.database?.error && (
                    <div>
                      <span className="font-medium">Error:</span>
                      <div className="mt-1 p-2 bg-red-50 text-red-800 rounded text-sm">
                        {info?.database?.error?.message}<br />
                        Code: {info?.database?.error?.code}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
