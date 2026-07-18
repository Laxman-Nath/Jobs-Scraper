import { z } from "zod";

export const sourceSchema = z.object({
  companyName: z.string().min(1, "Company name is required."),
  url: z.string().min(1, "URL is required.").url("Enter a valid URL."),
  sourceType: z.enum(["llm_extract", "greenhouse", "lever"], {
    message: "Select a source type.",
  }),
});

export type SourceFormValues = z.infer<typeof sourceSchema>;