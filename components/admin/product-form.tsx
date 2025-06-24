"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"

const productFormSchema = z.object({
  name: z.string().min(1, {
    message: "Product name is required",
  }),
  description: z.string().min(1, {
    message: "Product description is required",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number",
  }),
  stock: z.coerce.number().int().nonnegative({
    message: "Stock must be a non-negative integer",
  }),
  active: z.boolean().default(true),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function ProductForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [newImage, setNewImage] = useState("")

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      active: true,
      features: [],
      images: [],
    },
  })

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true)

    // Include features and images in the data
    data.features = features
    data.images = images

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      toast({
        title: "Product created",
        description: "Your product has been created successfully.",
      })

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addFeature = () => {
    if (newFeature.trim() !== "") {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const addImage = () => {
    if (newImage.trim() !== "") {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Product description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" placeholder="29.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>Make this product visible on the store</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Features</FormLabel>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addFeature()
                        }
                      }}
                    />
                    <Button type="button" onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-2">
                        <span>{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <FormLabel>Images</FormLabel>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Image URL"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addImage()
                        }
                      }}
                    />
                    <Button type="button" onClick={addImage}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {images.map((image, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-2">
                        <span className="truncate">{image}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button type="submit" className="bg-hibiscus-600 hover:bg-hibiscus-700" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Product
        </Button>
      </form>
    </Form>
  )
}
