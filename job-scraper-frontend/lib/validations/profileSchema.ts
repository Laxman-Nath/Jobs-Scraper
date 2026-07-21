import { z } from "zod";

export const profileUpdateSchema = z.object({
  preferredTitles: z.string().optional(),
  skills: z.string().optional(),
  preferredLocations: z.string().optional(),
  mutedCompanies: z.string().optional(),
  emailNotificationsEnabled: z.boolean(),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;