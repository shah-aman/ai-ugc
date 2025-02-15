import { productResearchPrompt } from "./prompts";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

interface ProductResearchResponse {
  research: string;
  citations: string[];
  error?: string;
}

export async function researchProduct(
  product_description: string
): Promise<ProductResearchResponse> {
  try {
    if (!PERPLEXITY_API_KEY) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }

    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "user",
            content: productResearchPrompt(product_description),
          },
        ],
        temperature: 0.1, // Lower temperature for more focused research
        max_tokens: 1500, // Adjust based on needed response length
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    const research = data.choices[0].message.content;
    const citations = data.citations;

    if (!research) {
      throw new Error("No research content generated");
    }

    return { research, citations };
  } catch (error) {
    console.error("Error researching product:", error);
    return {
      research: "",
      citations: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
