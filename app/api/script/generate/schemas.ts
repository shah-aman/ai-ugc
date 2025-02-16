import { z } from "zod";

export const extractStructuredScriptSchema = z.object({
  script: z.array(
    z.object({
      roll_type: z.enum(["A-roll", "B-roll-product", "B-roll-generic"]),
      content: z.string(),
      description: z
        .string()
        .describe(
          "For A-roll: Description of the speaker's emotion, tone, and delivery. " +
            "For B-roll-product: Detailed visual description showing the actual product in use, its features, or results. Include specific details about lighting, composition, and focus that highlight the product effectively." +
            "For B-roll-generic: Generic scene with format '[camera movement]: [establishing scene]. [additional details]'"
        ),
    })
  ),
});

export type ExtractStructuredScriptSchema = z.infer<
  typeof extractStructuredScriptSchema
>;
