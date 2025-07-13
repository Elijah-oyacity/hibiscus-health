/**
 * Handles API responses and automatically redirects to login on 403 errors
 * @param response - The fetch response
 * @param options - Additional options for handling the response
 * @returns The parsed JSON response
 */
export async function handleApiResponse(
  response: Response,
  options: {
    redirectOn403?: boolean
    redirectTo?: string
  } = {}
) {
  const { redirectOn403 = true, redirectTo = '/login' } = options

  if (response.status === 403 && redirectOn403) {
    // Redirect to login page for forbidden access
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
    throw new Error('Access forbidden - redirecting to login')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Enhanced fetch function that automatically handles 403 redirects
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Promise with the parsed JSON response
 */
export async function apiFetch(
  url: string,
  options: RequestInit & {
    redirectOn403?: boolean
    redirectTo?: string
  } = {}
) {
  const { redirectOn403 = true, redirectTo = '/login', ...fetchOptions } = options
  
  const response = await fetch(url, fetchOptions)
  return handleApiResponse(response, { redirectOn403, redirectTo })
} 