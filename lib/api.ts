import { ProjectSchema, Project } from "@/validation/project";

export async function getProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  const json = await res.json();

  return ProjectSchema.array().parse(json);
}
export async function getTasks() {
  const res = await fetch("http://localhost:3001/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}