import { NextResponse } from "next/server";
import { generateScript } from "./services";
import { getSupabase } from "@/supabase/utils";

export type RequestBody = {
  productLink: string;
  influencerId: string;

  customerIntent: string;
  productResearch: string;
  influencerResearch: string;
};

export async function POST(request: Request) {
  try {
    const {
      customerIntent,
      productResearch,
      influencerResearch,
      productLink,
      influencerId,
    }: RequestBody = await request.json();

    if (
      customerIntent === undefined ||
      productResearch === undefined ||
      influencerResearch === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = getSupabase();

    // Check for existing script with same product and influencer
    const { data: existingScript, error: fetchError } = await supabase
      .from("scripts")
      .select("*")
      .eq("product_link", productLink)
      .eq("influencer_id", influencerId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking for existing script:", fetchError);
      return NextResponse.json(
        { error: "Failed to check for existing script" },
        { status: 500 },
      );
    }

    // If we found an existing script, return it
    if (existingScript) {
      console.log("Found existing script for:", {
        productLink,
        influencerId,
      });
      return NextResponse.json(existingScript);
    }

    // No existing script found, generate a new one
    console.log("Generating new script for:", {
      productLink,
      influencerId,
    });
    const script = await generateScript(
      customerIntent,
      productResearch,
      influencerResearch,
    );

    const fullScript = script.script
      .map((script) => script.content)
      .join("\n");

    // Store the new script
    const { data, error } = await supabase
      .from("scripts")
      .upsert({
        influencer_id: influencerId,
        product_link: productLink,
        structured_script: script.script,
        full_script: fullScript,
      })
      .select();

    if (error !== null) {
      throw error;
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error generating script:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 },
    );
  }
}
