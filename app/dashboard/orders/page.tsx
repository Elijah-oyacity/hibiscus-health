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
import { 
  Plus, 
  Search, 
  FileDown,
  Eye
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DashboardOrdersPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  
  // For new manual order
  const [items, setItems] = useState([{ productId: "", quantity: 1, price: 0 }])
  const [totalAmount, setTotalAmount] = useState("")
  const [status, setStatus] = useState("PENDING")
  const [products, setProducts] = useState<Array<{id: string, name: string, price: number}>>([])

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      setOrders(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data || [])
    } catch (error) {
      console.error("Failed to fetch products", error)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items,
          totalAmount: parseFloat(totalAmount) * 100, // Convert to cents
          status
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create order")
      toast({ title: "Order created!", description: `Order created successfully.` })
      setItems([{ productId: "", quantity: 1, price: 0 }])
      setTotalAmount("")
      setStatus("PENDING")
      setDialogOpen(false)
      fetchOrders()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: orderId,
          status: newStatus
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update order")
      toast({ title: "Order updated!", description: `Status changed to ${newStatus}.` })
      fetchOrders()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  function viewOrderDetails(orderId: string) {
    // In a real app, this would navigate to a detailed order page
    toast({ title: "View Order", description: `Viewing details for order ${orderId}` })
  }

  function downloadInvoice(orderId: string) {
    // In a real app, this would download an invoice PDF
    toast({ title: "Download Invoice", description: `Downloading invoice for order ${orderId}` })
  }

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
    
    // Calculate total
    const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setTotalAmount((total / 100).toString())
  }

  const getProductPrice = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.price / 100 : 0
  }

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.name : "Unknown Product"
  }

  // Filter and search logic
  const filteredOrders = orders?.filter((order: any) => {
    const matchesStatus = filterStatus === "all" || !filterStatus || order.status === filterStatus
    const matchesSearch = !searchTerm || 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-500"
      case "SHIPPED": return "bg-blue-500"
      case "PROCESSING": return "bg-amber-500"
      case "PENDING": return "bg-gray-500"
      case "CANCELED": return "bg-red-500"
      case "FAILED": return "bg-red-600"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-hibiscus-600 hover:bg-hibiscus-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Order</DialogTitle>
              <DialogDescription>
                Create a new manual order.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-4">
                {items.map((item, index) => (
                  <div key={index} className="grid gap-2 border p-3 rounded">
                    <div className="flex justify-between items-center">
                      <Label>Item {index + 1}</Label>
                      {items.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label>Product</Label>
                      <Select 
                        value={item.productId} 
                        onValueChange={(value) => {
                          updateItem(index, "productId", value)
                          updateItem(index, "price", getProductPrice(value))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product: any) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Quantity</Label>
                      <Input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={e => updateItem(index, "quantity", parseInt(e.target.value))}
                        required 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Price per unit</Label>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        value={(item.price / 100).toFixed(2)} 
                        onChange={e => updateItem(index, "price", parseFloat(e.target.value) * 100)}
                        required 
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addItem}>
                  Add Item
                </Button>
                <div className="grid gap-2">
                  <Label>Total Amount (USD)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={totalAmount} 
                    onChange={e => setTotalAmount(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELED">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-hibiscus-600 hover:bg-hibiscus-700" disabled={loading}>
                  {loading ? "Creating..." : "Create Order"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No orders found.</p>
            <Button 
              onClick={() => setDialogOpen(true)} 
              className="bg-hibiscus-600 hover:bg-hibiscus-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Order
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p>{order.user?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{order.user?.email || "No email"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {order.orderItems?.map((item: any, index: number) => (
                        <div key={index} className="text-sm">
                          <p>{item.product?.name || "Unknown Product"}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={order.status} 
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="h-8 w-[110px]">
                        <SelectValue>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">
                          <Badge className="bg-gray-500">Pending</Badge>
                        </SelectItem>
                        <SelectItem value="PROCESSING">
                          <Badge className="bg-amber-500">Processing</Badge>
                        </SelectItem>
                        <SelectItem value="SHIPPED">
                          <Badge className="bg-blue-500">Shipped</Badge>
                        </SelectItem>
                        <SelectItem value="DELIVERED">
                          <Badge className="bg-green-500">Delivered</Badge>
                        </SelectItem>
                        <SelectItem value="CANCELED">
                          <Badge className="bg-red-500">Canceled</Badge>
                        </SelectItem>
                        <SelectItem value="FAILED">
                          <Badge className="bg-red-600">Failed</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>${(order.totalAmount / 100).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => viewOrderDetails(order.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => downloadInvoice(order.id)}>
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
