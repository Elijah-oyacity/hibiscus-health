import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Learn About Hibiscus | Hibiscus Health",
  description: "Educational resources about hibiscus and its benefits for blood pressure and heart health.",
}

export default function LearnPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4 text-rose-900">Learn About Hibiscus & Heart Health</h1>
      <p className="text-lg mb-8 text-muted-foreground">
        Discover the science behind hibiscus and how it can support healthy blood pressure levels.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
          <Image src="https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395623/hvtlwkt0gzb0apkhj2sr.jpg" alt="Hibiscus plant with flowers" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-rose-900">The Hibiscus Plant</h2>
          <p className="mb-4 text-muted-foreground">
            Hibiscus sabdariffa, commonly known as roselle, is a flowering plant native to tropical regions. For
            centuries, it has been used in traditional medicine across various cultures for its potential health
            benefits.
          </p>
          <p className="mb-4 text-muted-foreground">
            The deep red calyces (sepals) of the hibiscus flower are rich in bioactive compounds, including
            anthocyanins, flavonoids, and organic acids, which contribute to its health-promoting properties.
          </p>
          <Button asChild variant="outline" className="self-start border-rose-700 text-rose-700 hover:bg-rose-50">
            <Link href="#">
              Learn More About Hibiscus <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8 text-rose-900">Educational Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Blood Pressure Basics</CardTitle>
            <CardDescription>Understanding blood pressure and why it matters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[200px] rounded-md overflow-hidden mb-4">
              <Image src="https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png" alt="Blood pressure measurement" fill className="object-cover" />
            </div>
            <p className="text-muted-foreground">
              Learn about what blood pressure is, how it's measured, and why maintaining healthy levels is crucial for
              your overall health.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="text-rose-700 hover:text-rose-800 hover:bg-rose-50">
              <Link href="#">
                Read Article <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hibiscus & Heart Health</CardTitle>
            <CardDescription>The science behind hibiscus benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[200px] rounded-md overflow-hidden mb-4">
              <Image src="https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png" alt="Heart health concept" fill className="object-cover" />
            </div>
            <p className="text-muted-foreground">
              Explore the scientific research on how hibiscus supports cardiovascular health and helps maintain healthy
              blood pressure levels.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="text-rose-700 hover:text-rose-800 hover:bg-rose-50">
              <Link href="#">
                Read Article <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lifestyle Factors</CardTitle>
            <CardDescription>Complementary approaches to heart health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[200px] rounded-md overflow-hidden mb-4">
              <Image
                src="https://res.cloudinary.com/elijjaaahhhh/image/upload/v1747395956/kmusmgvtnomcjs2rn6ib.png"
                alt="Healthy lifestyle choices"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-muted-foreground">
              Discover how diet, exercise, stress management, and other lifestyle factors can work alongside hibiscus
              supplements.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="text-rose-700 hover:text-rose-800 hover:bg-rose-50">
              <Link href="#">
                Read Article <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-rose-50 rounded-lg p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-rose-900">Have Questions?</h2>
          <p className="mb-6 text-muted-foreground">
            Our team of health experts is here to help. Browse our frequently asked questions or contact us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-rose-700 hover:bg-rose-800">
              <Link href="#">View FAQ</Link>
            </Button>
            <Button asChild variant="outline" className="border-rose-700 text-rose-700 hover:bg-rose-100">
              <Link href="#">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
