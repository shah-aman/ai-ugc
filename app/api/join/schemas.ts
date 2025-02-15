import { z } from "zod";

export const BRollTimestampSchema = z.object({
  timestamps: z.array(
    z.object({
      index: z.number(),
      start: z.number(),
      end: z.number(),
      content: z.string(),
    })
  ),
});

export type BRollTimestampSchema = z.infer<typeof BRollTimestampSchema>;
