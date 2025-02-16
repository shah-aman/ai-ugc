import { NextRequest, NextResponse } from "next/server";
import { researchProduct } from "./services";
import { getSupabase } from "@/supabase/utils";
export async function POST(request: NextRequest) {
  try {
    const {
      product_link: productLink,
      product_description: productDescription,
    } = await request.json();

    if (!productDescription) {
      return NextResponse.json(
        { error: "Product description is required" },
        { status: 400 },
      );
    }

    const { summary, citations, error } =
      await researchProduct(productDescription);

    if (error) {
      return NextResponse.json(
        { error: `Research failed: ${error}` },
        { status: 500 },
      );
    }

    const supabase = getSupabase();
    const { error: updateError } = await supabase
      .from("research")
      .insert({
        product_link: productLink,
        product_research: {
          summary,
          citations,
        },
      })
      .select();

    return NextResponse.json({ summary, citations, error: updateError });
  } catch (error) {
    console.error("Error in product research route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
