import { z } from "zod";

export const SubtaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

export type Subtask = z.infer<typeof SubtaskSchema>;

export const CommentSchema = z.object({
  id: z.string(),
  author: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export type Comment = z.infer<typeof CommentSchema>;


export const AttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
});

export type Attachment = z.infer<typeof AttachmentSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  projectId: z.string(),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assignees: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),

  subtasks: z.array(SubtaskSchema).optional(),
  comments: z.array(CommentSchema).optional(),
  attachments: z.array(AttachmentSchema).optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskStatus = Task["status"];
