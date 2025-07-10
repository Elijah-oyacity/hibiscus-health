"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"

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
  const [dialogOpen, setDialogOpen] = useState(false)

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
      // Convert the price from a string in dollars to an integer in cents
      const priceInCents = Math.round(parseFloat(price) * 100);
      
      // Make sure price is a valid number
      if (isNaN(priceInCents)) {
        throw new Error("Price must be a valid number");
      }
      
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          price: priceInCents, // Send as integer (cents) instead of string
          interval, 
          description 
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add plan")
      toast({ title: "Plan added!", description: `Subscription plan '${name}' created.` })
      setName("")
      setPrice("")
      setInterval("")
      setDescription("")
      setDialogOpen(false)
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
      // Convert the price from a string in dollars to an integer in cents
      const priceInCents = Math.round(parseFloat(editFields.price) * 100);
      
      // Make sure price is a valid number
      if (isNaN(priceInCents)) {
        throw new Error("Price must be a valid number");
      }
      
      const res = await fetch("/api/subscription", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          name: editFields.name,
          description: editFields.description,
          interval: editFields.interval,
          price: priceInCents // Send as integer (cents) instead of string
        }),
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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-hibiscus-600 hover:bg-hibiscus-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Subscription Plan</DialogTitle>
              <DialogDescription>
                Create a new subscription plan for your customers.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Premium Plan" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    placeholder="99.99" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="interval">Interval</Label>
                  <Input 
                    id="interval" 
                    value={interval} 
                    onChange={e => setInterval(e.target.value)} 
                    placeholder="month, year, etc." 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Includes all premium features" 
                    required 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-hibiscus-600 hover:bg-hibiscus-700" disabled={loading}>
                  {loading ? "Adding..." : "Add Plan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No subscription plans found.</p>
            <Button 
              onClick={() => setDialogOpen(true)} 
              className="bg-hibiscus-600 hover:bg-hibiscus-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan: any) => (
                <TableRow key={plan.id}>
                  {editId === plan.id ? (
                    <>
                      <TableCell colSpan={4}>
                        <div className="flex gap-4">
                          <Input
                            value={editFields.name}
                            onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
                            placeholder="Plan name"
                          />
                          <Input
                            value={editFields.description}
                            onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                            placeholder="Description"
                          />
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editFields.price}
                            onChange={e => setEditFields(f => ({ ...f, price: e.target.value }))}
                            placeholder="Price"
                          />
                          <Input
                            value={editFields.interval}
                            onChange={e => setEditFields(f => ({ ...f, interval: e.target.value }))}
                            placeholder="Interval"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleEditSave(plan.id)} disabled={loading}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.description}</TableCell>
                      <TableCell>${(plan.price / 100).toFixed(2)}</TableCell>
                      <TableCell>{plan.interval}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(plan)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(plan.id)} disabled={loading}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
