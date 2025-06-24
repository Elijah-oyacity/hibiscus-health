import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { db } from "@/lib/db"

const accountSchema = z.object({
  name: z.string().min(1),
  image: z.string().optional(),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, image } = accountSchema.parse(body)

    const user = await db.user.update({
      where: {
        email: session.user.email as string,
      },
      data: {
        name,
        image,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
  } catch (error) {
    console.error("Error updating account:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
