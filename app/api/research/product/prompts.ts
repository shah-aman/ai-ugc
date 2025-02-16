interface ResearchArea {
  name: string;
  description: string;
  prompt: string;
}

const researchAreas: ResearchArea[] = [
  {
    name: "keyFeatures",
    description: "Key Features & Technical Specifications",
    prompt: `Analyze the product's key features and technical specifications in detail.
Focus on:
1. Core functionality and capabilities
2. Technical specifications and performance metrics
3. Design and build quality
4. Innovative or unique features
5. Integration capabilities
6. Performance benchmarks (if applicable)

Format your response as JSON:
{
  "features": [
    { "name": string, "description": string, "technicalDetails": string[] }
  ],
  "specifications": { [key: string]: string | number },
  "innovations": string[],
  "buildQuality": { "materials": string[], "durability": string }
}`,
  },
  {
    name: "marketAnalysis",
    description: "Target Market & Use Cases",
    prompt: `Conduct a deep analysis of the target market and use cases.
Focus on:
1. Primary target demographics
2. Secondary market opportunities
3. User personas
4. Common use cases
5. Market size and potential
6. Industry trends affecting adoption

Format your response as JSON:
{
  "primaryMarket": {
    "demographics": string[],
    "psychographics": string[],
    "marketSize": string
  },
  "secondaryMarkets": [
    { "segment": string, "opportunity": string }
  ],
  "userPersonas": [
    { "type": string, "description": string, "needs": string[] }
  ],
  "useCases": [
    { "scenario": string, "benefits": string[] }
  ]
}`,
  },
  {
    name: "competitiveAnalysis",
    description: "Competitor Analysis & Market Position",
    prompt: `Perform a detailed competitive analysis.
Focus on:
1. Direct competitors
2. Indirect competitors
3. Competitive advantages
4. Market positioning
5. Price comparison
6. Feature comparison

Format your response as JSON:
{
  "directCompetitors": [
    { 
      "name": string,
      "strengths": string[],
      "weaknesses": string[],
      "pricePoint": string
    }
  ],
  "indirectCompetitors": [
    {
      "name": string,
      "threatLevel": string,
      "differentiators": string[]
    }
  ],
  "marketPosition": {
    "uniqueAdvantages": string[],
    "challenges": string[],
    "opportunities": string[]
  }
}`,
  },
  {
    name: "painPoints",
    description: "Pain Points & Solutions",
    prompt: `Analyze customer pain points and how the product addresses them.
Focus on:
1. Common customer problems
2. How the product solves each issue
3. Customer satisfaction metrics
4. Areas for improvement
5. User feedback analysis

The satisfaction metrics are all numbers out of 5.

Format your response as JSON:
{
  "painPoints": [
    {
      "problem": string,
      "solution": string,
      "effectiveness": string,
      "userFeedback": string
    }
  ],
  "satisfactionMetrics": {
    "overallRating": number,
    "keyMetrics": { [key: string]: number }
  },
  "improvementAreas": [
    { "area": string, "suggestion": string }
  ]
}`,
  },
];

const consolidationPrompt = `
Analyze and consolidate all research findings into a comprehensive product analysis.
Use the provided research data to create a cohesive narrative that connects all aspects:
- Key Features & Technical Specifications
- Market Analysis
- Competitive Landscape
- Pain Points & Solutions

Format your response as JSON:
{
  "productSummary": {
    "overview": string,
    "keyInsights": string[],
    "marketOpportunity": string,
    "competitivePosition": string,
    "valueProposition": string
  },
  "detailedAnalysis": {
    "features": object,
    "market": object,
    "competition": object,
    "painPoints": object
  },
  "recommendations": {
    "marketingAngles": string[],
    "targetAudience": string[],
    "contentStrategy": {
      "keyMessages": string[],
      "suggestedTopics": string[]
    }
  },
  "citations": string[]
}`;

export { researchAreas, consolidationPrompt };
