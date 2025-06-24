import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const orders = [
  {
    id: "ORD001",
    product: "Hibiscus Tablets (30 count)",
    date: "2024-05-01",
    status: "Delivered",
    amount: "$29.99",
  },
  {
    id: "ORD002",
    product: "Hibiscus Tablets (30 count)",
    date: "2024-05-15",
    status: "Delivered",
    amount: "$29.99",
  },
  {
    id: "ORD003",
    product: "Hibiscus Tablets (30 count)",
    date: "2024-06-01",
    status: "Processing",
    amount: "$29.99",
  },
]

export function RecentOrders() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.product}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell className="text-right">{order.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
