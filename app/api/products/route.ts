import { NextResponse } from "next/server"

// Mock data
const products = [
  {
    id: "PROD001",
    name: "Hibiscus Tablets (30 count)",
    description: "One month supply of our premium hibiscus tablets for blood pressure support.",
    longDescription:
      "Our Hibiscus Tablets are formulated with premium hibiscus extract, standardized to contain the optimal concentration of anthocyanins and other beneficial compounds. Each tablet provides 500mg of hibiscus extract, carefully processed to preserve its natural properties.\n\nHibiscus has been used for centuries in traditional medicine and modern research suggests it may help maintain healthy blood pressure levels already within normal range. Our tablets are manufactured in a GMP-certified facility and undergo rigorous testing for purity and potency.",
    price: 29.99,
    image: "/placeholder-aek36.png",
    features: [
      "500mg of premium hibiscus extract per tablet",
      "30-day supply (1 tablet daily)",
      "Standardized for consistent potency",
      "No artificial colors or preservatives",
      "Gluten-free and vegan-friendly",
      "Made in a GMP-certified facility",
    ],
    usage:
      "Take one tablet daily with water, preferably with a meal. For best results, use consistently as part of a healthy lifestyle that includes a balanced diet and regular exercise.",
    ingredients:
      "Hibiscus sabdariffa extract (flower), Microcrystalline cellulose, Vegetable capsule (hypromellose), Rice flour, Magnesium stearate (vegetable source).",
    stock: 150,
    active: true,
  },
  {
    id: "PROD002",
    name: "Hibiscus Tablets (90 count)",
    description: "Three month supply of our premium hibiscus tablets for blood pressure support.",
    longDescription:
      "Our Hibiscus Tablets are formulated with premium hibiscus extract, standardized to contain the optimal concentration of anthocyanins and other beneficial compounds. Each tablet provides 500mg of hibiscus extract, carefully processed to preserve its natural properties.\n\nHibiscus has been used for centuries in traditional medicine and modern research suggests it may help maintain healthy blood pressure levels already within normal range. Our tablets are manufactured in a GMP-certified facility and undergo rigorous testing for purity and potency.\n\nThis 90-count bottle provides a convenient three-month supply for those committed to their health regimen.",
    price: 79.99,
    image: "/placeholder-f17mz.png",
    features: [
      "500mg of premium hibiscus extract per tablet",
      "90-day supply (1 tablet daily)",
      "Standardized for consistent potency",
      "No artificial colors or preservatives",
      "Gluten-free and vegan-friendly",
      "Made in a GMP-certified facility",
    ],
    usage:
      "Take one tablet daily with water, preferably with a meal. For best results, use consistently as part of a healthy lifestyle that includes a balanced diet and regular exercise.",
    ingredients:
      "Hibiscus sabdariffa extract (flower), Microcrystalline cellulose, Vegetable capsule (hypromellose), Rice flour, Magnesium stearate (vegetable source).",
    stock: 75,
    active: true,
  },
  {
    id: "PROD003",
    name: "Hibiscus Extract (2oz)",
    description: "Concentrated hibiscus extract in liquid form for maximum absorption.",
    longDescription:
      "Our Hibiscus Extract is a concentrated liquid formula designed for maximum absorption and convenience. Each 2oz bottle contains premium hibiscus extract in an easy-to-use dropper format.\n\nThe liquid extract allows for faster absorption compared to tablets, making it ideal for those who want quick results. Our extract is alcohol-free and contains no artificial colors, flavors, or preservatives.\n\nHibiscus has been used for centuries in traditional medicine and modern research suggests it may help maintain healthy blood pressure levels already within normal range.",
    price: 34.99,
    image: "/placeholder-b0dgo.png",
    features: [
      "Concentrated liquid extract",
      "Easy to add to water or juice",
      "Rapid absorption",
      "No artificial colors or preservatives",
      "Alcohol-free",
      "Made in a GMP-certified facility",
    ],
    usage:
      "Take 1 dropper (approximately 1ml) daily, added to water or juice. For best results, use consistently as part of a healthy lifestyle that includes a balanced diet and regular exercise.",
    ingredients: "Hibiscus sabdariffa extract (flower), Vegetable glycerin, Purified water, Natural flavors.",
    stock: 100,
    active: true,
  },
  {
    id: "PROD004",
    name: "Hibiscus & Hawthorn Complex",
    description: "Advanced formula combining hibiscus with hawthorn for comprehensive heart health support.",
    longDescription:
      "Our Hibiscus & Hawthorn Complex combines two powerful botanicals known for their cardiovascular benefits. This advanced formula provides comprehensive support for heart health and healthy blood pressure maintenance.\n\nHibiscus helps maintain healthy blood pressure levels already within normal range, while hawthorn has been traditionally used to support overall cardiovascular function. Together, they create a synergistic effect for optimal heart health support.\n\nEach tablet contains standardized extracts of both herbs to ensure consistent potency and effectiveness.",
    price: 39.99,
    image: "/placeholder-sekc1.png",
    features: [
      "Combination of hibiscus and hawthorn extracts",
      "Supports overall cardiovascular health",
      "30-day supply (1 tablet daily)",
      "Standardized for consistent potency",
      "No artificial colors or preservatives",
      "Gluten-free and vegan-friendly",
    ],
    usage:
      "Take one tablet daily with water, preferably with a meal. For best results, use consistently as part of a healthy lifestyle that includes a balanced diet and regular exercise.",
    ingredients:
      "Hibiscus sabdariffa extract (flower), Hawthorn (Crataegus spp.) extract (leaf and flower), Microcrystalline cellulose, Vegetable capsule (hypromellose), Rice flour, Magnesium stearate (vegetable source).",
    stock: 50,
    active: true,
  },
  {
    id: "PROD005",
    name: "Hibiscus Tea (30 bags)",
    description: "Premium hibiscus tea bags for a delicious way to support healthy blood pressure.",
    longDescription:
      "Our Premium Hibiscus Tea provides a delicious and relaxing way to enjoy the benefits of hibiscus. Each tea bag contains pure, organic hibiscus flowers, carefully selected for optimal flavor and potency.\n\nHibiscus tea has been enjoyed for centuries in many cultures, both for its pleasant tart flavor and its potential health benefits. Modern research suggests that regularly consuming hibiscus tea may help maintain healthy blood pressure levels already within normal range.\n\nOur tea bags are biodegradable and contain no artificial flavors, colors, or preservatives.",
    price: 19.99,
    image: "/placeholder-bag4k.png",
    features: [
      "100% organic hibiscus flowers",
      "30 biodegradable tea bags",
      "Rich in antioxidants",
      "No artificial flavors or additives",
      "Pleasant tart flavor",
      "Can be enjoyed hot or cold",
    ],
    usage:
      "Steep one tea bag in 8oz of hot water for 5-7 minutes. Enjoy 1-2 cups daily. Can be sweetened with honey or served over ice for a refreshing cold beverage.",
    ingredients: "Organic Hibiscus sabdariffa flowers.",
    stock: 200,
    active: false,
  },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (id) {
    const product = products.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  }

  return NextResponse.json(products)
}
