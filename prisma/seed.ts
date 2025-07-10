import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample products
  const products = [
    {
      name: "Hibiscus Tablets (30 count)",
      slug: "hibiscus-tablets-30",
      description: "One month supply of our premium hibiscus tablets for blood pressure support.",
      longDescription: "Our Hibiscus Tablets are formulated with premium hibiscus extract, standardized to contain the optimal concentration of anthocyanins and other beneficial compounds. Each tablet provides 500mg of hibiscus extract, carefully processed to preserve its natural properties.",
      benefits: "Supports healthy blood pressure levels, rich in antioxidants, natural energy boost",
      ingredients: "Hibiscus sabdariffa extract (flower), Microcrystalline cellulose, Vegetable capsule (hypromellose), Rice flour, Magnesium stearate (vegetable source).",
      dosage: "Take one tablet daily with water, preferably with a meal.",
      price: 2999, // $29.99 in cents
      stockQuantity: 150,
      imageUrl: "/placeholder-aek36.png",
      isFeatured: true,
      stripePriceId: "price_hibiscus_tablets_30",
      stripeProductId: "prod_hibiscus_tablets_30",
    },
    {
      name: "Hibiscus Tablets (90 count)",
      slug: "hibiscus-tablets-90",
      description: "Three month supply of our premium hibiscus tablets for blood pressure support.",
      longDescription: "Our Hibiscus Tablets are formulated with premium hibiscus extract, standardized to contain the optimal concentration of anthocyanins and other beneficial compounds. Each tablet provides 500mg of hibiscus extract, carefully processed to preserve its natural properties.",
      benefits: "Supports healthy blood pressure levels, rich in antioxidants, natural energy boost",
      ingredients: "Hibiscus sabdariffa extract (flower), Microcrystalline cellulose, Vegetable capsule (hypromellose), Rice flour, Magnesium stearate (vegetable source).",
      dosage: "Take one tablet daily with water, preferably with a meal.",
      price: 7999, // $79.99 in cents
      stockQuantity: 75,
      imageUrl: "/placeholder-f17mz.png",
      isFeatured: true,
      stripePriceId: "price_hibiscus_tablets_90",
      stripeProductId: "prod_hibiscus_tablets_90",
    },
    {
      name: "Hibiscus Extract (2oz)",
      slug: "hibiscus-extract-2oz",
      description: "Concentrated hibiscus extract in liquid form for maximum absorption.",
      longDescription: "Our Hibiscus Extract is a concentrated liquid formula designed for maximum absorption and convenience. Each 2oz bottle contains premium hibiscus extract in an easy-to-use dropper format.",
      benefits: "Rapid absorption, concentrated formula, easy to use",
      ingredients: "Hibiscus sabdariffa extract (flower), Vegetable glycerin, Purified water, Natural flavors.",
      dosage: "Take 1 dropper (approximately 1ml) daily, added to water or juice.",
      price: 3499, // $34.99 in cents
      stockQuantity: 100,
      imageUrl: "/placeholder-b0dgo.png",
      isFeatured: true,
      stripePriceId: "price_hibiscus_extract_2oz",
      stripeProductId: "prod_hibiscus_extract_2oz",
    },
    {
      name: "Hibiscus & Hawthorn Complex",
      slug: "hibiscus-hawthorn-complex",
      description: "Advanced formula combining hibiscus with hawthorn for comprehensive heart health support.",
      longDescription: "Our Hibiscus & Hawthorn Complex combines two powerful botanicals known for their cardiovascular benefits. This advanced formula provides comprehensive support for heart health and healthy blood pressure maintenance.",
      benefits: "Comprehensive heart health support, synergistic formula, cardiovascular benefits",
      ingredients: "Hibiscus sabdariffa extract (flower), Hawthorn (Crataegus spp.) extract (leaf and flower), Microcrystalline cellulose, Vegetable capsule (hypromellose), Rice flour, Magnesium stearate (vegetable source).",
      dosage: "Take one tablet daily with water, preferably with a meal.",
      price: 3999, // $39.99 in cents
      stockQuantity: 50,
      imageUrl: "/placeholder-sekc1.png",
      isFeatured: false,
      stripePriceId: "price_hibiscus_hawthorn_complex",
      stripeProductId: "prod_hibiscus_hawthorn_complex",
    },
    {
      name: "Hibiscus Tea (30 bags)",
      slug: "hibiscus-tea-30",
      description: "Premium hibiscus tea bags for a delicious way to support healthy blood pressure.",
      longDescription: "Our Premium Hibiscus Tea provides a delicious and relaxing way to enjoy the benefits of hibiscus. Each tea bag contains pure, organic hibiscus flowers, carefully selected for optimal flavor and potency.",
      benefits: "Delicious taste, rich in antioxidants, relaxing experience",
      ingredients: "Organic Hibiscus sabdariffa flowers.",
      dosage: "Steep one tea bag in 8oz of hot water for 5-7 minutes. Enjoy 1-2 cups daily.",
      price: 1999, // $19.99 in cents
      stockQuantity: 200,
      imageUrl: "/placeholder-bag4k.png",
      isFeatured: false,
      stripePriceId: "price_hibiscus_tea_30",
      stripeProductId: "prod_hibiscus_tea_30",
    },
    {
      name: "Hibiscus Powder (8oz)",
      slug: "hibiscus-powder-8oz",
      description: "Pure hibiscus powder for versatile use in smoothies, baking, and beverages.",
      longDescription: "Our Pure Hibiscus Powder is made from carefully selected hibiscus flowers, ground into a fine powder for maximum versatility. Perfect for adding to smoothies, baking recipes, or creating custom beverages.",
      benefits: "Versatile use, pure powder form, easy to incorporate",
      ingredients: "100% Pure Hibiscus sabdariffa flower powder.",
      dosage: "Add 1/2 to 1 teaspoon to smoothies, beverages, or recipes as desired.",
      price: 2499, // $24.99 in cents
      stockQuantity: 80,
      imageUrl: "/placeholder-powder.png",
      isFeatured: false,
      stripePriceId: "price_hibiscus_powder_8oz",
      stripeProductId: "prod_hibiscus_powder_8oz",
    },
    {
      name: "Hibiscus Capsules (60 count)",
      slug: "hibiscus-capsules-60",
      description: "Convenient capsule form of hibiscus extract for easy daily supplementation.",
      longDescription: "Our Hibiscus Capsules provide a convenient way to get your daily hibiscus supplement. Each capsule contains 500mg of pure hibiscus extract in an easy-to-swallow vegetarian capsule.",
      benefits: "Convenient capsules, easy to swallow, consistent dosage",
      ingredients: "Hibiscus sabdariffa extract (flower), Vegetarian capsule (hypromellose), Rice flour, Magnesium stearate (vegetable source).",
      dosage: "Take 1-2 capsules daily with water, preferably with a meal.",
      price: 4499, // $44.99 in cents
      stockQuantity: 120,
      imageUrl: "/placeholder-capsules.png",
      isFeatured: false,
      stripePriceId: "price_hibiscus_capsules_60",
      stripeProductId: "prod_hibiscus_capsules_60",
    },
    {
      name: "Hibiscus & Ginger Blend",
      slug: "hibiscus-ginger-blend",
      description: "Refreshing blend of hibiscus and ginger for digestive and cardiovascular support.",
      longDescription: "Our Hibiscus & Ginger Blend combines the cardiovascular benefits of hibiscus with the digestive support of ginger. This refreshing blend provides comprehensive health support in a delicious, easy-to-enjoy format.",
      benefits: "Digestive support, cardiovascular benefits, refreshing taste",
      ingredients: "Hibiscus sabdariffa extract (flower), Ginger (Zingiber officinale) extract (root), Natural flavors, Purified water.",
      dosage: "Take 1-2 servings daily, mixed with water or your favorite beverage.",
      price: 2799, // $27.99 in cents
      stockQuantity: 90,
      imageUrl: "/placeholder-blend.png",
      isFeatured: false,
      stripePriceId: "price_hibiscus_ginger_blend",
      stripeProductId: "prod_hibiscus_ginger_blend",
    },
    {
      name: "Hibiscus Wellness Kit",
      slug: "hibiscus-wellness-kit",
      description: "Complete wellness kit including tablets, tea, and extract for comprehensive hibiscus benefits.",
      longDescription: "Our Hibiscus Wellness Kit provides everything you need to experience the full benefits of hibiscus. This comprehensive kit includes tablets for daily supplementation, tea for relaxation, and extract for concentrated benefits.",
      benefits: "Complete wellness solution, multiple formats, comprehensive benefits",
      ingredients: "Hibiscus sabdariffa extract (flower), Organic hibiscus flowers, Natural flavors, Vegetable capsules.",
      dosage: "Use as directed for each product in the kit.",
      price: 8999, // $89.99 in cents
      stockQuantity: 30,
      imageUrl: "/placeholder-kit.png",
      isFeatured: true,
      stripePriceId: "price_hibiscus_wellness_kit",
      stripeProductId: "prod_hibiscus_wellness_kit",
    },
    {
      name: "Hibiscus & Turmeric Complex",
      slug: "hibiscus-turmeric-complex",
      description: "Powerful combination of hibiscus and turmeric for anti-inflammatory and cardiovascular support.",
      longDescription: "Our Hibiscus & Turmeric Complex combines two powerful botanicals known for their anti-inflammatory and cardiovascular benefits. This synergistic formula provides comprehensive support for overall health and wellness.",
      benefits: "Anti-inflammatory support, cardiovascular benefits, synergistic formula",
      ingredients: "Hibiscus sabdariffa extract (flower), Turmeric (Curcuma longa) extract (root), Black pepper extract, Microcrystalline cellulose, Vegetable capsule (hypromellose).",
      dosage: "Take 1-2 capsules daily with water, preferably with a meal.",
      price: 5499, // $54.99 in cents
      stockQuantity: 60,
      imageUrl: "/placeholder-complex.png",
      isFeatured: false,
      stripePriceId: "price_hibiscus_turmeric_complex",
      stripeProductId: "prod_hibiscus_turmeric_complex",
    },
  ]

  console.log('📦 Creating products...')
  const createdProducts = []
  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
    createdProducts.push(createdProduct)
    console.log(`✅ Created product: ${createdProduct.name}`)
  }

  // Create sample subscription plans
  const subscriptionPlans = [
    {
      name: "Free",
      description: "Have minimal access",
      price: 0,
      interval: "month",
      stripePriceId: "price_free_plan",
      productId: "prod_free_plan",
      active: true,
    },
    {
      name: "Basic",
      description: "Essential hibiscus supplements for daily health",
      price: 2999, // $29.99 in cents
      interval: "month",
      stripePriceId: "price_basic_plan",
      productId: "prod_basic_plan",
      active: true,
    },
    {
      name: "Premium",
      description: "Comprehensive wellness with premium hibiscus products",
      price: 5999, // $59.99 in cents
      interval: "month",
      stripePriceId: "price_premium_plan",
      productId: "prod_premium_plan",
      active: true,
    },
    {
      name: "Family",
      description: "Complete family wellness package with multiple products",
      price: 9999, // $99.99 in cents
      interval: "month",
      stripePriceId: "price_family_plan",
      productId: "prod_family_plan",
      active: true,
    },
    {
      name: "Annual Basic",
      description: "Essential hibiscus supplements with annual discount",
      price: 29999, // $299.99 in cents
      interval: "year",
      stripePriceId: "price_annual_basic_plan",
      productId: "prod_annual_basic_plan",
      active: true,
    },
  ]

  console.log('📋 Creating subscription plans...')
  const createdPlans = []
  for (const plan of subscriptionPlans) {
    const createdPlan = await prisma.subscriptionPlan.upsert({
      where: { stripePriceId: plan.stripePriceId },
      update: plan,
      create: plan,
    })
    createdPlans.push(createdPlan)
    console.log(`✅ Created plan: ${createdPlan.name}`)
  }

  // Create sample users (if they don't exist)
  const users = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "USER" as const,
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "USER" as const,
    },
    {
      name: "Admin User",
      email: "admin@hibiscus-health.com",
      role: "ADMIN" as const,
    },
  ]

  console.log('👥 Creating users...')
  const createdUsers = []
  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    })
    createdUsers.push(createdUser)
    console.log(`✅ Created user: ${createdUser.name}`)
  }

  // Create sample orders
  const orders = [
    {
      userId: createdUsers[0].id,
      totalAmount: 2999, // $29.99
      status: "DELIVERED" as const,
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      billingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      orderItems: [
        { productId: createdProducts[0].id, quantity: 1, price: 2999 }
      ]
    },
    {
      userId: createdUsers[1].id,
      totalAmount: 7999, // $79.99
      status: "SHIPPED" as const,
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      billingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      orderItems: [
        { productId: createdProducts[1].id, quantity: 1, price: 7999 }
      ]
    },
    {
      userId: createdUsers[0].id,
      totalAmount: 3499, // $34.99
      status: "PROCESSING" as const,
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      billingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      orderItems: [
        { productId: createdProducts[2].id, quantity: 1, price: 3499 }
      ]
    },
    {
      userId: createdUsers[1].id,
      totalAmount: 3999, // $39.99
      status: "PENDING" as const,
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      billingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      orderItems: [
        { productId: createdProducts[3].id, quantity: 1, price: 3999 }
      ]
    },
    {
      userId: createdUsers[0].id,
      totalAmount: 1999, // $19.99
      status: "DELIVERED" as const,
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      billingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      orderItems: [
        { productId: createdProducts[4].id, quantity: 1, price: 1999 }
      ]
    },
    {
      userId: createdUsers[1].id,
      totalAmount: 2499, // $24.99
      status: "SHIPPED" as const,
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      billingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      orderItems: [
        { productId: createdProducts[5].id, quantity: 1, price: 2499 }
      ]
    },
    {
      userId: createdUsers[0].id,
      totalAmount: 4499, // $44.99
      status: "PROCESSING" as const,
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      billingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      orderItems: [
        { productId: createdProducts[6].id, quantity: 1, price: 4499 }
      ]
    },
    {
      userId: createdUsers[1].id,
      totalAmount: 2799, // $27.99
      status: "PENDING" as const,
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      billingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      orderItems: [
        { productId: createdProducts[7].id, quantity: 1, price: 2799 }
      ]
    },
    {
      userId: createdUsers[0].id,
      totalAmount: 8999, // $89.99
      status: "DELIVERED" as const,
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      billingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      orderItems: [
        { productId: createdProducts[8].id, quantity: 1, price: 8999 }
      ]
    },
    {
      userId: createdUsers[1].id,
      totalAmount: 5499, // $54.99
      status: "SHIPPED" as const,
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      billingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      orderItems: [
        { productId: createdProducts[9].id, quantity: 1, price: 5499 }
      ]
    },
  ]

  console.log('📦 Creating orders...')
  for (const order of orders) {
    const { orderItems, ...orderData } = order
    const createdOrder = await prisma.order.create({
      data: {
        ...orderData,
        orderItems: {
          create: orderItems
        }
      }
    })
    console.log(`✅ Created order: ${createdOrder.id} - $${(createdOrder.totalAmount / 100).toFixed(2)}`)
  }

  console.log('🎉 Database seeding completed!')
  console.log(`📊 Created ${createdProducts.length} products`)
  console.log(`📋 Created ${createdPlans.length} subscription plans`)
  console.log(`👥 Created ${createdUsers.length} users`)
  console.log(`📦 Created ${orders.length} orders`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 