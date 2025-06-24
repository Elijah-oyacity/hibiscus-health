"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardSubscriptionsPage() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [interval, setInterval] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState([])
  const [editId, setEditId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState({ name: "", price: "", interval: "", description: "" })

  async function fetchPlans() {
    const res = await fetch("/api/subscription")
    const data = await res.json()
    setPlans(data.plans || [])
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, interval, description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add plan")
      toast({ title: "Plan added!", description: `Subscription plan '${name}' created.` })
      setName("")
      setPrice("")
      setInterval("")
      setDescription("")
      fetchPlans()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this plan?")) return
    setLoading(true)
    try {
      const res = await fetch("/api/subscription", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete plan")
      toast({ title: "Plan deleted!" })
      fetchPlans()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  function startEdit(plan: any) {
    setEditId(plan.id)
    setEditFields({
      name: plan.name,
      price: (plan.price / 100).toString(),
      interval: plan.interval,
      description: plan.description,
    })
  }

  function cancelEdit() {
    setEditId(null)
    setEditFields({ name: "", price: "", interval: "", description: "" })
  }

  async function handleEditSave(id: string) {
    setLoading(true)
    try {
      const res = await fetch("/api/subscription", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editFields }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update plan")
      toast({ title: "Plan updated!" })
      setEditId(null)
      fetchPlans()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Plan Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input id="price" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="interval">Interval</Label>
              <Input id="interval" value={interval} onChange={e => setInterval(e.target.value)} placeholder="month, year, etc." required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <CardFooter>
              <Button type="submit" className="w-full bg-hibiscus-600 hover:bg-hibiscus-700" disabled={loading}>
                {loading ? "Adding..." : "Add Plan"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">Subscription Plans</h2>
        {plans.length === 0 && <div className="text-gray-500">No plans found.</div>}
        <div className="space-y-4">
          {plans.map((plan: any) => (
            <Card key={plan.id}>
              <CardContent className="py-4">
                {editId === plan.id ? (
                  <div className="space-y-2">
                    <Input value={editFields.name} onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))} />
                    <Input type="number" value={editFields.price} onChange={e => setEditFields(f => ({ ...f, price: e.target.value }))} />
                    <Input value={editFields.interval} onChange={e => setEditFields(f => ({ ...f, interval: e.target.value }))} />
                    <Input value={editFields.description} onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))} />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => handleEditSave(plan.id)} disabled={loading}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-semibold">{plan.name}</div>
                      <div className="text-sm text-gray-500">{plan.description}</div>
                      <div className="text-sm">${(plan.price / 100).toFixed(2)} / {plan.interval}</div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button size="sm" variant="outline" onClick={() => startEdit(plan)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(plan.id)} disabled={loading}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
