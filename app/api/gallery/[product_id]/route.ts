import { NextResponse } from "next/server";
import { getSupabase } from "@/supabase/utils";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ product_id: string }> }
) {
    const resolvedParams = await params;
    const supabase = getSupabase();
    
    try {
        // Fetch product info
        const { data: productInfo } = await supabase
            .from("product_info")
            .select("*")
            .eq("product_id", resolvedParams.product_id)
            .single();

        // Fetch market research
        const { data: marketResearch } = await supabase
            .from("market_research")
            .select("*")
            .eq("product_id", resolvedParams.product_id)
            .single();

        // Fetch b-roll clips
        const { data: bRollClips } = await supabase
            .from("b_roll")
            .select("*")
            .eq("product_id", resolvedParams.product_id);

        return NextResponse.json({
            productInfo,
            marketResearch,
            bRollClips: bRollClips || []
        });
    } catch (error) {
        console.error("Error fetching product data:", error);
        return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
    }
} 