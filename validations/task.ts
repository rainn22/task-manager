import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  projectId: z.string(),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
  subtasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean()
  })).optional(),
  comments: z.array(z.object({
    id: z.string(),
    author: z.string(),
    content: z.string(),
    createdAt: z.string()
  })).optional(),
});

export type Task = z.infer<typeof TaskSchema>;
