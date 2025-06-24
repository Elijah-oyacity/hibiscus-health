import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { db } from "@/lib/db"

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  active: z.boolean().default(true),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      select: {
        role: true,
      },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { name, description, price, stock, active, features, images } = productSchema.parse(body)

    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        stock,
        active,
        features: features || [],
        images: images || [],
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      select: {
        role: true,
      },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
