import { NextRequest, NextResponse } from "next/server";
import { researchProduct } from "./services";

export async function POST(request: NextRequest) {
  try {
    const { product_description } = await request.json();

    if (!product_description) {
      return NextResponse.json(
        { error: "Product description is required" },
        { status: 400 }
      );
    }

    const { summary, citations, error } = await researchProduct(product_description);

    if (error) {
      return NextResponse.json(
        { error: `Research failed: ${error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary, citations });
  } catch (error) {
    console.error("Error in product research route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
