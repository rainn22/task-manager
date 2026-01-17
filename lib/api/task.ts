import { CreateTask, Task, TaskSchema } from "@/validations/task";

const API_URL = "http://localhost:3001";

export async function getTasksByProjectId(projectId: string): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks?projectId=${projectId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch project tasks");
  }
  const json = await res.json();
  return TaskSchema.array().parse(json);
}

export async function getTaskById(id: string): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }
  const json = await res.json();
  return TaskSchema.parse(json);
}

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const json = await res.json();
  return TaskSchema.array().parse(json);
}

export async function createTask(data: CreateTask): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }
  const json = await res.json();
  return TaskSchema.parse(json);
}
