"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 1420.65,
  },
  {
    name: "Feb",
    total: 1530.85,
  },
  {
    name: "Mar",
    total: 1355.33,
  },
  {
    name: "Apr",
    total: 1921.55,
  },
  {
    name: "May",
    total: 2345.87,
  },
  {
    name: "Jun",
    total: 3201.89,
  },
]

export function AdminOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#E11D8F" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
