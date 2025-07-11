"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api-utils"

export function Test403Component() {
  const [status, setStatus] = useState<string>("")

  const test403Redirect = async () => {
    try {
      setStatus("Testing 403 redirect...")
      
      // This should trigger a 403 and redirect to login
      await apiFetch("/api/admin/products", {
        method: "GET"
      })
      
      setStatus("Unexpected success - should have redirected")
    } catch (error) {
      setStatus(`Error caught: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testPublicEndpoint = async () => {
    try {
      setStatus("Testing public endpoint...")
      
      // This should work without redirect
      const data = await apiFetch("/api/products", {
        redirectOn403: false
      })
      
      setStatus(`Success! Found ${Array.isArray(data) ? data.length : 'unknown'} products`)
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">403 Redirect Test</h3>
      <div className="space-y-2">
        <Button onClick={test403Redirect} variant="destructive">
          Test 403 Redirect (Admin Only)
        </Button>
        <Button onClick={testPublicEndpoint} variant="outline">
          Test Public Endpoint
        </Button>
      </div>
      {status && (
        <p className="mt-4 text-sm text-muted-foreground">{status}</p>
      )}
    </div>
  )
} 