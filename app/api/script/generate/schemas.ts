import { z } from "zod";

export const extractStructuredScriptSchema = z.object({
  script: z.array(
    z.object({
      roll_type: z.enum(["A-roll", "B-roll"]),
      content: z.string(),
    })
  ),
});

export type ExtractStructuredScriptSchema = z.infer<
  typeof extractStructuredScriptSchema
>;
