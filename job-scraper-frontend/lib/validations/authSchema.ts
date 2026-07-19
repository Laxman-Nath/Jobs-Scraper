import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  preferredTitles: z.string().min(1, "Enter at least one job title you're interested in."),
  skills: z.string().optional(),
  preferredLocations: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;