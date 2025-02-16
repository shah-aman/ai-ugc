import z from "zod";

export const productSchema = z.object({
  name: z.string(),
  price: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  specifications: z.record(z.string()),
  brand: z.string(),
  tags: z.array(z.string()),
  category: z.string(),
  inStock: z.optional(z.boolean()),
  top3ImageUrls: z.array(z.string()),
  rating: z
    .object({
      score: z.number(),
      count: z.number(),
    })
    .optional(),
});

export type ProductInfo = z.infer<typeof productSchema>;
