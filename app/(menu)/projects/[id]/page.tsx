import { notFound } from "next/navigation";
import { getProjects } from "@/lib/api";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const projects = await getProjects();
  const project = projects.find((p) => p.id === params.id);

  if (!project) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{project.name}</h1>
    </div>
  );
}
