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
