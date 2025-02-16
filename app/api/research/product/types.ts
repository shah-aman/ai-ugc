import { z } from "zod";

export const FeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  technicalDetails: z.array(z.string()),
});

export const BuildQualitySchema = z.object({
  materials: z.array(z.string()),
  durability: z.string(),
});

export const PrimaryMarketSchema = z.object({
  demographics: z.array(z.string()),
  psychographics: z.array(z.string()),
  marketSize: z.string(),
});

export const SecondaryMarketSchema = z.object({
  segment: z.string(),
  opportunity: z.string(),
});

export const UserPersonaSchema = z.object({
  type: z.string(),
  description: z.string(),
  needs: z.array(z.string()),
});

export const UseCaseSchema = z.object({
  scenario: z.string(),
  benefits: z.array(z.string()),
});

export const DirectCompetitorSchema = z.object({
  name: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  pricePoint: z.string(),
});

export const IndirectCompetitorSchema = z.object({
  name: z.string(),
  threatLevel: z.string(),
  differentiators: z.array(z.string()),
});

export const MarketPositionSchema = z.object({
  uniqueAdvantages: z.array(z.string()),
  challenges: z.array(z.string()),
  opportunities: z.array(z.string()),
});

export const PainPointSchema = z.object({
  problem: z.string(),
  solution: z.string(),
  effectiveness: z.string(),
  userFeedback: z.string(),
});

export const SatisfactionMetricsSchema = z.object({
  overallRating: z.number(),
  keyMetrics: z.object({}).catchall(z.number()),
});

export const ImprovementAreaSchema = z.object({
  area: z.string(),
  suggestion: z.string(),
});

export const KeyFeaturesDataSchema = z.object({
  features: z.array(FeatureSchema),
  specifications: z.object({}).catchall(z.union([z.string(), z.number()])),
  innovations: z.array(z.string()),
  buildQuality: BuildQualitySchema,
});

export const MarketAnalysisDataSchema = z.object({
  primaryMarket: PrimaryMarketSchema,
  secondaryMarkets: z.array(SecondaryMarketSchema),
  userPersonas: z.array(UserPersonaSchema),
  useCases: z.array(UseCaseSchema),
});

export const CompetitiveAnalysisDataSchema = z.object({
  directCompetitors: z.array(DirectCompetitorSchema),
  indirectCompetitors: z.array(IndirectCompetitorSchema),
  marketPosition: MarketPositionSchema,
});

export const PainPointsDataSchema = z.object({
  painPoints: z.array(PainPointSchema),
  satisfactionMetrics: SatisfactionMetricsSchema,
  improvementAreas: z.array(ImprovementAreaSchema),
});

export const ResearchDataSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("keyFeatures"), data: KeyFeaturesDataSchema }),
  z.object({
    type: z.literal("marketAnalysis"),
    data: MarketAnalysisDataSchema,
  }),
  z.object({
    type: z.literal("competitiveAnalysis"),
    data: CompetitiveAnalysisDataSchema,
  }),
  z.object({ type: z.literal("painPoints"), data: PainPointsDataSchema }),
]);

export const ProductSummarySchema = z.object({
  overview: z.string(),
  keyInsights: z.array(z.string()),
  marketOpportunity: z.string(),
  competitivePosition: z.string(),
  valueProposition: z.string(),
});

export const ContentStrategySchema = z.object({
  keyMessages: z.array(z.string()),
  suggestedTopics: z.array(z.string()),
});

export const RecommendationsSchema = z.object({
  marketingAngles: z.array(z.string()),
  targetAudience: z.array(z.string()),
  contentStrategy: ContentStrategySchema,
});

export const ConsolidatedDataSchema = z.object({
  productSummary: ProductSummarySchema,
  detailedAnalysis: z.object({
    features: KeyFeaturesDataSchema,
    market: MarketAnalysisDataSchema,
    competition: CompetitiveAnalysisDataSchema,
    painPoints: PainPointsDataSchema,
  }),
  recommendations: RecommendationsSchema,
  citations: z.array(z.string()),
});

export type ResearchData = z.infer<typeof ResearchDataSchema>;
export type ConsolidatedData = z.infer<typeof ConsolidatedDataSchema>;

export type ResearchResult = {
  data: ResearchData;
  citations: string[];
};

export type ConsolidatedResearch = {
  summary: ConsolidatedData;
  citations: string[];
  error?: string;
};
