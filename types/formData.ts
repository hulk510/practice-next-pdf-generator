import { z } from "zod";

export const formDataSchema = z.object({
  inheritanceRights: z.boolean(),
  usageLevel1: z.number().min(1).max(4),
  usageLevel2: z.number().min(1).max(4),
  usageLevel3: z.number().min(1).max(4),
  usageLevel4: z.number().min(1).max(4),
  freeDescriptions: z.array(z.object({ content: z.string() })),
  contactInfos: z.array(z.object({ info: z.string() })),
});

export type FormData = z.infer<typeof formDataSchema>;
