import { getOpenAI } from "@/lib/ai";
import { extractStructuredScriptPrompt, generateScriptPrompt } from "./prompts";
import {
  ExtractStructuredScriptSchema,
  extractStructuredScriptSchema,
} from "./schemas";
import { zodResponseFormat } from "openai/helpers/zod";

export async function generateScript(
  customerIntent: string,
  productResearch: string,
  influencerResearch: string,
): Promise<ExtractStructuredScriptSchema> {
  const openai = getOpenAI();

  const response = await openai.beta.chat.completions.parse({
    model: "o3-mini",
    messages: [
      {
        role: "user",
        content: generateScriptPrompt(
          customerIntent,
          productResearch,
          influencerResearch,
        ),
      },
    ],
    response_format: zodResponseFormat(extractStructuredScriptSchema, "script"),
  });

  const script = response.choices[0].message.parsed;

  if (!script) {
    throw new Error("No script generated");
  }

  console.log("Script:", script);

  if (!script) {
    throw new Error("No structured script generated");
  }

  return script;
}
