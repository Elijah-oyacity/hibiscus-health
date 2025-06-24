import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"

import { db } from "@/lib/db"

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = userSchema.parse(body)

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
