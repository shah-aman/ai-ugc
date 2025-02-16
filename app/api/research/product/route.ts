import { NextRequest, NextResponse } from "next/server";
import { researchProduct } from "./services";
import { getSupabase } from "@/supabase/utils";

export async function POST(request: NextRequest) {
  try {
    const { productLink, productDescription } = await request.json();

    if (!productLink || !productDescription) {
      return NextResponse.json(
        { error: "Product link and description are required" },
        { status: 400 },
      );
    }

    const supabase = getSupabase();
    
    const { data: existingRecord } = await supabase
      .from("research")
      .select()
      .eq('product_link', productLink)
      .not('product_research', 'is', null)
      .single();

    if (existingRecord?.product_research) {
      return NextResponse.json({
        id: existingRecord.id,
        summary: existingRecord.product_research.summary,
        citations: existingRecord.product_research.citations,
      });
    }

    // If no existing data, proceed with research
    const { summary, citations, error } = 
      await researchProduct(productDescription);

    if (error) {
      return NextResponse.json(
        { error: `Research failed: ${error}` },
        { status: 500 },
      );
    }

    const { data: researchRecord, error: supabaseError } = await supabase
      .from("research")
      .upsert(
        {
          product_link: productLink,
          product_research: {
            summary,
            citations,
          },
          // Initialize other fields as null since they'll be filled later
          customer_intent: null,
          customer_profile: null,
        },
        { 
          onConflict: 'product_link',
          ignoreDuplicates: false 
        }
      )
      .select()
      .single();

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return NextResponse.json(
        { error: "Failed to save research data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: researchRecord.id,
      summary,
      citations,
    });
  } catch (error) {
    console.error("Error in product research route:", error);
    return NextResponse.json(
      { 
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 },
    );
  }
}
