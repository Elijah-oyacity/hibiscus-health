"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function DashboardProductsPage() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [editId, setEditId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState({ 
    name: "", 
    slug: "",
    price: "", 
    stockQuantity: "", 
    description: "" 
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          slug,
          price: parseFloat(price), 
          stockQuantity: parseInt(stockQuantity), 
          description
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add product")
      toast({ title: "Product added!", description: `Product '${name}' created successfully.` })
      setName("")
      setSlug("")
      setPrice("")
      setStockQuantity("")
      setDescription("")
      setDialogOpen(false)
      fetchProducts()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete product")
      toast({ title: "Product deleted!" })
      fetchProducts()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  function startEdit(product: any) {
    setEditId(product.id)
    setEditFields({
      name: product.name,
      slug: product.slug,
      price: typeof product.price === 'number' ? (product.price / 100).toString() : product.price,
      stockQuantity: product.stockQuantity.toString(),
      description: product.description || "",
    })
  }

  function cancelEdit() {
    setEditId(null)
    setEditFields({ name: "", slug: "", price: "", stockQuantity: "", description: "" })
  }

  async function handleEditSave(id: string) {
    setLoading(true)
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id,
          name: editFields.name,
          slug: editFields.slug,
          price: parseFloat(editFields.price),
          stockQuantity: parseInt(editFields.stockQuantity),
          description: editFields.description,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update product")
      toast({ title: "Product updated!" })
      setEditId(null)
      fetchProducts()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (value: string) => {
    setName(value)
    setSlug(generateSlug(value))
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-hibiscus-600 hover:bg-hibiscus-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Add a new product to your inventory.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={e => handleNameChange(e.target.value)} 
                    placeholder="Hibiscus Extract" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input 
                    id="slug" 
                    value={slug} 
                    onChange={e => setSlug(e.target.value)} 
                    placeholder="hibiscus-extract" 
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
                    placeholder="29.99" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input 
                    id="stockQuantity" 
                    type="number" 
                    min="0" 
                    step="1" 
                    value={stockQuantity} 
                    onChange={e => setStockQuantity(e.target.value)} 
                    placeholder="100" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Product description" 
                    rows={3}
                    required 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-hibiscus-600 hover:bg-hibiscus-700" disabled={loading}>
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No products found.</p>
            <Button 
              onClick={() => setDialogOpen(true)} 
              className="bg-hibiscus-600 hover:bg-hibiscus-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product.id}>
                  {editId === product.id ? (
                    <>
                      <TableCell colSpan={5}>
                        <div className="flex flex-col gap-4">
                          <Input
                            value={editFields.name}
                            onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
                            placeholder="Product name"
                          />
                          <Input
                            value={editFields.slug}
                            onChange={e => setEditFields(f => ({ ...f, slug: e.target.value }))}
                            placeholder="Product slug"
                          />
                          <Textarea
                            value={editFields.description}
                            onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                            placeholder="Description"
                            rows={2}
                          />
                          <div className="flex gap-4">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editFields.price}
                              onChange={e => setEditFields(f => ({ ...f, price: e.target.value }))}
                              placeholder="Price"
                            />
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              value={editFields.stockQuantity}
                              onChange={e => setEditFields(f => ({ ...f, stockQuantity: e.target.value }))}
                              placeholder="Stock"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleEditSave(product.id)} disabled={loading}>
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
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{product.slug}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{product.description}</TableCell>
                      <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={product.stockQuantity > 10 ? "bg-green-500" : "bg-amber-500"}>
                          {product.stockQuantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)} disabled={loading}>
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
