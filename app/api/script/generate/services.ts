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
  influencerResearch: object,
): Promise<{
  unstructuredScript: string;
  structuredScript: ExtractStructuredScriptSchema;
}> {
  const openai = getOpenAI();

  const unstructuredResponse = await openai.chat.completions.create({
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
  });

  const unstructuredScript = unstructuredResponse.choices[0].message.content;

  if (!unstructuredScript) {
    throw new Error("No script generated");
  }

  console.log("Unstructured script:", unstructuredScript);

  const structuredResponse = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: extractStructuredScriptPrompt(unstructuredScript),
      },
    ],
    response_format: zodResponseFormat(extractStructuredScriptSchema, "script"),
  });

  const structuredScript = structuredResponse.choices[0].message.parsed;

  console.log("Structured script:", structuredScript);

  if (!structuredScript) {
    throw new Error("No structured script generated");
  }

  return {
    unstructuredScript,
    structuredScript,
  };
}
