import { NextResponse } from "next/server";
import { generateScript } from "./services";

export async function POST(request: Request) {
  try {
    const { customer_intent, product_research, influencer_research } =
      await request.json();

    if (!customer_intent || !product_research || !influencer_research) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const script = await generateScript(
      customer_intent,
      product_research,
      influencer_research
    );

    return NextResponse.json({ script });
  } catch (error) {
    console.error("Error generating script:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
