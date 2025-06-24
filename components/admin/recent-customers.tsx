import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const customers = [
  {
    id: "USR001",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    date: "2024-05-28",
    plan: "Monthly",
  },
  {
    id: "USR002",
    name: "Michael Chen",
    email: "m.chen@example.com",
    date: "2024-05-27",
    plan: "Quarterly",
  },
  {
    id: "USR003",
    name: "Jessica Williams",
    email: "jwilliams@example.com",
    date: "2024-05-26",
    plan: "Annual",
  },
  {
    id: "USR004",
    name: "David Rodriguez",
    email: "drodriguez@example.com",
    date: "2024-05-25",
    plan: "Monthly",
  },
  {
    id: "USR005",
    name: "Emily Taylor",
    email: "etaylor@example.com",
    date: "2024-05-24",
    plan: "Quarterly",
  },
]

export function RecentCustomers() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="font-medium">{customer.name}</div>
            </TableCell>
            <TableCell>{customer.plan}</TableCell>
            <TableCell>{customer.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
