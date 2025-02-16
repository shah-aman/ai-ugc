import { researchAreas } from "./prompts";
import {
  ConsolidatedDataSchema,
  ResearchResult,
  ConsolidatedResearch,
  ResearchData,
  KeyFeaturesDataSchema,
  MarketAnalysisDataSchema,
  CompetitiveAnalysisDataSchema,
  PainPointsDataSchema,
} from "./types";
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanJsonResponse(content: string): string {
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return content.trim();
}

async function extractStructuredData<T extends z.ZodTypeAny>(
  schema: T,
  text: string
): Promise<z.infer<T>> {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Extract structured data based on the schema." },
      { role: "user", content: text },
    ],
    response_format: zodResponseFormat(schema, "structured_data"),
  });

  return completion.choices[0].message.parsed;
}

async function performSpecializedResearch(
  area: (typeof researchAreas)[0],
  product_description: string,
): Promise<ResearchResult> {
  try {
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
            role: "system",
            content: `You are a specialized research agent that MUST ALWAYS respond with valid JSON only.
IMPORTANT FORMATTING RULES:
1. Return ONLY raw JSON - no code blocks, no markdown, no backticks
2. Do not wrap the JSON in \`\`\`json or any other formatting
3. Do not include any text before or after the JSON
4. The response should start with { and end with }
5. Ensure the JSON is properly formatted and valid`,
          },
          {
            role: "user",
            content: `Research this product: ${product_description}\n\n${area.prompt}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: "text" },
      }),
    });

    const perplexityData = await response.json();
    const cleanedContent = cleanJsonResponse(perplexityData.choices[0].message.content);

    const validatedData = await extractStructuredData(
      area.name === "keyFeatures" ? KeyFeaturesDataSchema :
      area.name === "marketAnalysis" ? MarketAnalysisDataSchema :
      area.name === "competitiveAnalysis" ? CompetitiveAnalysisDataSchema :
      PainPointsDataSchema,
      cleanedContent
    );

    return {
      data: {
        type: area.name,
        data: validatedData,
      } as ResearchData,
      citations: perplexityData.citations || [],
    };
  } catch (error) {
    console.error("Research error:", error);
    throw error;
  }
}

export async function researchProduct(
  product_description: string,
): Promise<ConsolidatedResearch> {
  try {
    if (!PERPLEXITY_API_KEY) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }

    const researchPromises = researchAreas.map((area) =>
      performSpecializedResearch(area, product_description),
    );

    const researchResults = await Promise.all(researchPromises);

    const keyFeatures = researchResults.find(
      (r): r is ResearchResult & { data: KeyFeaturesResearch } =>
        r.data.type === "keyFeatures",
    );
    const marketAnalysis = researchResults.find(
      (r): r is ResearchResult & { data: MarketAnalysisResearch } =>
        r.data.type === "marketAnalysis",
    );
    const competitiveAnalysis = researchResults.find(
      (r): r is ResearchResult & { data: CompetitiveAnalysisResearch } =>
        r.data.type === "competitiveAnalysis",
    );
    const painPoints = researchResults.find(
      (r): r is ResearchResult & { data: PainPointsResearch } =>
        r.data.type === "painPoints",
    );

    if (
      !keyFeatures ||
      !marketAnalysis ||
      !competitiveAnalysis ||
      !painPoints
    ) {
      throw new Error("Missing required research data");
    }

    const allCitations = researchResults.flatMap((result) => result.citations);
    const uniqueCitations = [...new Set(allCitations)];

    const consolidatedData = ConsolidatedDataSchema.parse({
      productSummary: {
        overview: `Comprehensive analysis of ${product_description}`,
        keyInsights: [],
        marketOpportunity: marketAnalysis.data.data.primaryMarket.marketSize,
        competitivePosition:
          competitiveAnalysis.data.data.marketPosition.uniqueAdvantages.join(
            ". ",
          ),
        valueProposition: keyFeatures.data.data.features
          .map((f) => f.description)
          .join(". "),
      },
      detailedAnalysis: {
        features: keyFeatures.data.data,
        market: marketAnalysis.data.data,
        competition: competitiveAnalysis.data.data,
        painPoints: painPoints.data.data,
      },
      recommendations: {
        marketingAngles: [
          ...keyFeatures.data.data.innovations,
          ...competitiveAnalysis.data.data.marketPosition.uniqueAdvantages,
        ],
        targetAudience: marketAnalysis.data.data.userPersonas.map(
          (p) => p.type,
        ),
        contentStrategy: {
          keyMessages: [
            ...keyFeatures.data.data.features.map((f) => f.name),
            ...painPoints.data.data.painPoints.map((p) => p.solution),
          ],
          suggestedTopics: marketAnalysis.data.data.useCases.map(
            (uc) => uc.scenario,
          ),
        },
      },
      citations: uniqueCitations,
    });

    return {
      summary: consolidatedData,
      citations: uniqueCitations,
    };
  } catch (error) {
    console.error("Research error:", error);
    return {
      summary: {
        productSummary: {
          overview: "",
          keyInsights: [],
          marketOpportunity: "",
          competitivePosition: "",
          valueProposition: "",
        },
        detailedAnalysis: {
          features: {
            features: [],
            specifications: {},
            innovations: [],
            buildQuality: { materials: [], durability: "" },
          },
          market: {
            primaryMarket: {
              demographics: [],
              psychographics: [],
              marketSize: "",
            },
            secondaryMarkets: [],
            userPersonas: [],
            useCases: [],
          },
          competition: {
            directCompetitors: [],
            indirectCompetitors: [],
            marketPosition: {
              uniqueAdvantages: [],
              challenges: [],
              opportunities: [],
            },
          },
          painPoints: {
            painPoints: [],
            satisfactionMetrics: {
              overallRating: 0,
              keyMetrics: {},
            },
            improvementAreas: [],
          },
        },
        recommendations: {
          marketingAngles: [],
          targetAudience: [],
          contentStrategy: {
            keyMessages: [],
            suggestedTopics: [],
          },
        },
        citations: [],
      },
      citations: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

type KeyFeaturesResearch = Extract<ResearchData, { type: "keyFeatures" }>;
type MarketAnalysisResearch = Extract<ResearchData, { type: "marketAnalysis" }>;
type CompetitiveAnalysisResearch = Extract<
  ResearchData,
  { type: "competitiveAnalysis" }
>;
type PainPointsResearch = Extract<ResearchData, { type: "painPoints" }>;
