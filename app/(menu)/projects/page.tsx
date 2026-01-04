import Link from "next/link";
import { getProjects } from "@/lib/api";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Projects</h1>

        <Link
          href="/projects/new"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          New Project
        </Link>
      </div>

      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.id}`}
              className="block p-3 bg-white rounded hover:shadow"
            >
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
