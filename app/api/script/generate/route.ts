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

    const script = await generateScript(
      customerIntent,
      productResearch,
      influencerResearch,
    );

    const fullScript = script.script
      .map((script) => script.content)
      .join("\n");

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("scripts")
      .upsert({
        influencer_id: influencerId,
        product_link: productLink,
        structured_script: script.script,
        full_script: fullScript
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
