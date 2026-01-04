import { ProjectSchema, Project } from "@/validation/project";

export async function getProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  const json = await res.json();

  return ProjectSchema.array().parse(json);
}
