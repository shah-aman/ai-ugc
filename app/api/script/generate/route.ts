import { NextResponse } from "next/server";
import { generateScript } from "./services";
import { getSupabase } from "@/supabase/utils";

type RequestBody = {
    product_link: string;
    influencer_id: string;

    customer_intent: string;
    product_research: string;
    influencer_research: string;
};

export async function POST(request: Request) {
    try {
        const {
            customer_intent,
            product_research,
            influencer_research,
            product_link,
            influencer_id,
        }: RequestBody = await request.json();

        if (!customer_intent || !product_research || !influencer_research) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const {
            unstructuredScript: script_reasoning,
            structuredScript: structured_script,
        } = await generateScript(
            customer_intent,
            product_research,
            influencer_research,
        );

        const full_script = structured_script.script.map((script) =>
            script.content
        ).join("\n");

        const supabase = getSupabase();
        const { data, error } = await supabase
            .from("scripts")
            .upsert({
                influencer_id,
                product_link,
                script_reasoning,
                full_script,
                structured_script,
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
