import { Task, TaskSchema } from "@/validations/task";

const API_URL = "http://localhost:3001";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const json = await res.json();
  return TaskSchema.array().parse(json);
}

export async function getTaskById(id: string): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }
  const json = await res.json();
  return TaskSchema.parse(json);
}

