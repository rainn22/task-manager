import { ProjectSchema, Project } from "@/validations/project";

const API_URL = "http://localhost:3001";

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/projects`);
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  const json = await res.json();
  return ProjectSchema.array().parse(json);
}
