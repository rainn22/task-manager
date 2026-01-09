import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  tasksTotal: z.number().optional(),
  tasksCompleted: z.number().optional(),
  dueDate: z.string().optional(),
  members: z.array(z.string()).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
