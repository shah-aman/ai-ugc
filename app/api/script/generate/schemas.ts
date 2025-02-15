import { z } from "zod";

export const extractStructuredScriptSchema = z.object({
  script: z.array(
    z.object({
      roll_type: z.enum(["A-roll", "B-roll"]),
      content: z.string(),
      description: z
        .string()
        .describe(
          "For A-roll: Description of the speaker's emotion, tone, and delivery. " +
            "For B-roll: Detailed visual description of what should be shown, suitable for AI video generation."
        ),
    })
  ),
});

export type ExtractStructuredScriptSchema = z.infer<
  typeof extractStructuredScriptSchema
>;
