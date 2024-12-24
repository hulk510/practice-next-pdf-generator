import { z } from "zod";

export const formDataSchema = z.object({
  inheritanceRights: z.boolean(),
  usageLevel1: z.number().min(1).max(4),
  usageLevel2: z.number().min(1).max(4),
  usageLevel3: z.number().min(1).max(4),
  usageLevel4: z.number().min(1).max(4),
  freeDescription: z.string(),
  contactInfo: z.string(),
});

export type FormData = z.infer<typeof formDataSchema>;
