import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

export type Project = z.infer<typeof ProjectSchema>;
