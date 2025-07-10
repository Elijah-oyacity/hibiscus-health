import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth.config"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const slug = searchParams.get("slug")
    const featured = searchParams.get("featured")

    if (id) {
      const product = await db.product.findUnique({
        where: { id }
      })

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      return NextResponse.json(product)
    }

    if (slug) {
      const product = await db.product.findUnique({
        where: { slug }
      })

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      return NextResponse.json(product)
    }

    // Build where clause
    const whereClause: any = {}
    if (featured === "true") {
      whereClause.isFeatured = true
    }

    const products = await db.product.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can create products
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create products" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      name,
      slug,
      description,
      longDescription,
      benefits,
      ingredients,
      dosage,
      price,
      stockQuantity,
      imageUrl,
      imageAdobeId,
      images,
      stripePriceId,
      stripeProductId,
      isFeatured
    } = body

    if (!name || !slug || !description || !price || stockQuantity === undefined) {
      return NextResponse.json(
        { error: "Name, slug, description, price, and stockQuantity are required" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProduct = await db.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        longDescription,
        benefits,
        ingredients,
        dosage,
        price: Math.round(price * 100), // Convert to cents
        stockQuantity,
        imageUrl,
        imageAdobeId,
        images,
        stripePriceId,
        stripeProductId,
        isFeatured: isFeatured || false
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can update products
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update products" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // If updating slug, check if it already exists
    if (updateData.slug && updateData.slug !== existingProduct.slug) {
      const slugExists = await db.product.findUnique({
        where: { slug: updateData.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: "Product with this slug already exists" },
          { status: 400 }
        )
      }
    }

    // Convert price to cents if provided
    if (updateData.price) {
      updateData.price = Math.round(updateData.price * 100)
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can delete products
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete products" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Check if product has associated orders
    const orderItems = await db.orderItem.findMany({
      where: { productId: id }
    })

    if (orderItems.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete product with associated orders" },
        { status: 400 }
      )
    }

    await db.product.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
