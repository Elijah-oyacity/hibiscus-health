import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useApiErrorHandler() {
  const router = useRouter()

  const handleApiError = useCallback((error: any, options: {
    redirectOn403?: boolean
    redirectTo?: string
  } = {}) => {
    const { redirectOn403 = true, redirectTo = '/login' } = options

    // Check if it's a 403 error
    if (error?.status === 403 || error?.message?.includes('403')) {
      if (redirectOn403) {
        router.push(redirectTo)
        return
      }
    }

    // Re-throw the error for other handling
    throw error
  }, [router])

  const apiFetchWithErrorHandling = useCallback(async (
    url: string,
    options: RequestInit & {
      redirectOn403?: boolean
      redirectTo?: string
    } = {}
  ) => {
    const { redirectOn403 = true, redirectTo = '/login', ...fetchOptions } = options

    try {
      const response = await fetch(url, fetchOptions)
      
      if (response.status === 403 && redirectOn403) {
        router.push(redirectTo)
        throw new Error('Access forbidden - redirecting to login')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      handleApiError(error, { redirectOn403, redirectTo })
      throw error
    }
  }, [router, handleApiError])

  return {
    handleApiError,
    apiFetchWithErrorHandling
  }
} 