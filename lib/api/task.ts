import { Task, TaskSchema, CreateTask } from "@/validations/task";

const API_URL = "http://localhost:3001";



export async function getTaskById(id: string): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`);
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

export async function updateTask(id: string, data: CreateTask): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update task");
  }
  const json = await res.json();
  return TaskSchema.parse(json);
}

export async function patchTask(id: string, data: Partial<CreateTask>): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to patch task");
  }
  const json = await res.json();
  return TaskSchema.parse(json);
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete task");
  }
}
