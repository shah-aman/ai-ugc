import { NextResponse } from "next/server";
import { generateScript } from "./services";
import { getSupabase } from "@/supabase/utils";

type RequestBody = {
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

    if (!customerIntent || !productResearch || !influencerResearch) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { unstructuredScript, structuredScript } = await generateScript(
      customerIntent,
      productResearch,
      influencerResearch,
    );

    const fullScript = structuredScript.script
      .map((script) => script.content)
      .join("\n");

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("scripts")
      .upsert({
        influencer_id: influencerId,
        product_link: productLink,
        script_reasoning: unstructuredScript,
        full_script: fullScript,
        structured_script: structuredScript.script,
      })
      .select();

    return NextResponse.json({ data, error });
  } catch (error) {
    console.error("Error generating script:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 },
    );
  }
}
