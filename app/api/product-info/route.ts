import { NextResponse } from "next/server";
import FirecrawlApp, { ScrapeResponse } from "@mendable/firecrawl-js";
import { Groq } from "groq-sdk";
import { productSchema } from "./schema";

if (!process.env.GROQ_API_KEY) {
  throw Error("GROQ_API_KEY is not set in environment variables");
}
if (!process.env.FIRECRAWL_API_KEY) {
  throw Error("FIRECRAWL_API_KEY is not set in environment variables");
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "Product URL is required" },
        { status: 400 },
      );
    }

    console.log("Initializing Firecrawl with URL:", url);

    const app = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY || "",
    });

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    try {
      const scrapeResult = (await app.scrapeUrl(url, {
        formats: ["markdown"],
      })) as ScrapeResponse;

      console.log("Scrape result status:", scrapeResult.success);

      if (!scrapeResult.success) {
        throw new Error(`Failed to scrape: ${scrapeResult.error}`);
      }

      const markdown = (scrapeResult.markdown || "").slice(0, 8000);

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              'Extract product information concisely. For images, specifically look for <img> tags within elements with classes like "imgTagWrapper", "a-dynamic-image", or similar product gallery classes.',
          },
          {
            role: "user",
            content: `Extract key product information from: ${markdown}. For images, focus on URLs from <img> tags that:
            - Are within div elements with class="imgTagWrapper"
            - Have class="a-dynamic-image"
            - Have data-old-hires attributes (these often contain high-res versions)
            - Are part of the main product image grid/gallery
            Ignore any images outside these main product image containers.`,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        max_tokens: 1024,
        tools: [
          {
            type: "function",
            function: {
              name: "extract_product_info",
              description:
                "Extract structured product information from the content",
              parameters: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Product name",
                  },
                  price: {
                    type: "string",
                    description: "Current price as string",
                  },
                  description: {
                    type: "string",
                    description: "Product description (keep it concise)",
                  },
                  features: {
                    type: "array",
                    items: { type: "string" },
                    description:
                      "Key feature bullet points (limit to main features)",
                  },
                  specifications: {
                    type: "object",
                    additionalProperties: { type: "string" },
                    description: "Key technical specifications",
                  },
                  brand: {
                    type: "string",
                    description: "Brand name",
                  },
                  category: {
                    type: "string",
                    description:
                      "Product category (keep it concise; max 2-3 words)",
                  },
                  inStock: {
                    type: "boolean",
                    description: "Indicator of whether the item is in stock",
                  },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                    description:
                      "Key tags/categories that apply to the product",
                  },
                  top3ImageUrls: {
                    type: "array",
                    items: { type: "string" },
                    description:
                      "Extract exactly 3 product image URLs from img tags within imgTagWrapper divs or with a-dynamic-image class. Prefer URLs from data-old-hires attributes when available as they are high-resolution. Only include images from the main product gallery section.",
                  },
                  rating: {
                    type: "object",
                    properties: {
                      score: { type: "number" },
                      count: { type: "number" },
                    },
                    required: ["score", "count"],
                    description: "Rating information",
                  },
                },
                required: [
                  "name",
                  "price",
                  "description",
                  "features",
                  "category",
                  "tags",
                  "specifications",
                  "brand",
                  "top3ImageUrls",
                ],
              },
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "extract_product_info" },
        },
      });

      const toolCall = completion.choices[0].message.tool_calls?.[0];

      if (!toolCall) {
        throw new Error("No tool call received from LLM");
      }

      let extractedInfo = JSON.parse(toolCall.function.arguments);

      extractedInfo = {
        ...extractedInfo,
        specifications: extractedInfo.specifications || {},
        features: extractedInfo.features || [],
        top3ImageUrls: extractedInfo.top3ImageUrls || [],
        category: extractedInfo.category ?? "",
        tags: extractedInfo.tags ?? [],
        description: extractedInfo.description || "",
        brand: extractedInfo.brand || "Unknown",
        price: extractedInfo.price || "N/A",
        name: extractedInfo.name || "Unknown Product",
      };

      // Validate the data against our schema
      const validatedData = productSchema.parse(extractedInfo);

      return NextResponse.json(validatedData);
    } catch (scrapeError) {
      console.error(
        "Processing error details:",
        JSON.stringify(scrapeError, null, 2),
      );
      return NextResponse.json(
        {
          error: "Processing failed",
          details:
            scrapeError instanceof Error
              ? scrapeError.message
              : String(scrapeError),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Request processing error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
