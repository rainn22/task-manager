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
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  projectId: z.string().min(1, "Project is required"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in-progress", "done"]),
  dueDate: z.string().min(1, "Due date is required"),
  assignees: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  subtasks: z.array(SubtaskSchema).optional(),
  comments: z.array(CommentSchema).optional(),
  attachments: z.array(AttachmentSchema).optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskStatus = Task["status"];

export const CreateTaskSchema = TaskSchema.pick({
  title: true,
  description: true,
  projectId: true,
  priority: true,
  dueDate: true,
  status: true,
  assignees: true,
  attachments: true,
});

export type CreateTask = z.infer<typeof CreateTaskSchema>;
