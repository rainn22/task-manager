import { getProjects } from "@/lib/api/project";
import { getTasks } from "@/lib/api/task";
import { getMembers } from "@/lib/api/member";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { AnimatedProgress } from "@/components/project/Progress";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const tasks = await getTasks();
  const members = await getMembers();


  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold">Projects</h1>

        <Link
          href="/projects/new"
          className="inline-flex justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
        >
          New Project
        </Link>
      </div>

      <ul className="space-y-4">
        {projects.map((project) => {
          const projectTasks = tasks.filter(
            (task) => task.projectId === project.id
          );

          const totalTasks = projectTasks.length;
          const inProgressTasks = projectTasks.filter(
            (task) => task.status === "in-progress"
          ).length;

          const progress =
            totalTasks === 0
              ? 0
              : Math.round((inProgressTasks / totalTasks) * 100);

          const projectMembers = members.filter((member) =>
            project.members?.includes(member.id)
          );

          return (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="block rounded-lg border p-4 space-y-3
                           hover:bg-gray-50 hover:shadow-sm transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="font-medium">{project.name}</p>
                  <span className="text-xs text-gray-500">
                    
                    {inProgressTasks}/{totalTasks} in progress
                  </span>
                </div>
                <div><h5 className="font-light text-sm text-gray-500">{project.description}</h5></div>


                <AnimatedProgress value={progress} />

                <div className="flex items-center gap-2 flex-wrap">
                  {projectMembers.map((member) => {
                    const firstLetter =
                      member.name?.trim().charAt(0).toUpperCase() ?? "?";

                    return (
                      <Avatar
                        key={member.id}
                        className="h-7 w-7 rounded-full border bg-white
                                   hover:scale-105 transition"
                      >
                        <AvatarFallback
                          className="flex h-full w-full items-center justify-center
                                     rounded-full bg-gray-200 text-xs font-semibold text-gray-700"
                        >
                          {firstLetter}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}

                  {projectMembers.length === 0 && (
                    <span className="text-xs text-gray-400">
                      No members assigned
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
