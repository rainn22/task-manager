"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

import { getProjects } from "@/lib/api/project";
import { getTasks } from "@/lib/api/task";
import { getMembers } from "@/lib/api/member";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { AnimatedProgress } from "@/components/project/Progress";

export default function ProjectsPage() {
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
  } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });


  if (projectsLoading || tasksLoading || membersLoading) {
    return <Skeleton className="h-32 w-full " />;
  }

  if (
    projectsError ||
    tasksError ||
    membersError ||
    !projects ||
    !tasks ||
    !members
  ) {
    return (
      <p className="p-6 text-red-500">
        Failed to load projects
      </p>
    );
  }

  // 🔹 Build lookup maps
  const tasksByProjectId = new Map<string, typeof tasks[number][]>();
  const membersById = new Map(members.map((m) => [m.id, m]));

  for (const task of tasks) {
    const list = tasksByProjectId.get(task.projectId) ?? [];
    list.push(task);
    tasksByProjectId.set(task.projectId, list);
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold">Projects</h1>

        <Link
          href="/projects/new"
          className="inline-flex justify-center px-4 py-2
                     bg-blue-600 text-white rounded-md text-sm
                     hover:bg-blue-700 transition"
        >
          New Project
        </Link>
      </div>

      <ul className="space-y-4">
        {projects.map((project) => {
          const projectTasks = tasksByProjectId.get(project.id) ?? [];

          const totalTasks = projectTasks.length;
          const inProgressTasks = projectTasks.filter(
            (t) => t.status === "in-progress"
          ).length;

          const progress =
            totalTasks === 0
              ? 0
              : Math.round((inProgressTasks / totalTasks) * 100);

          const projectMembers =
            project.members
              ?.map((id) => membersById.get(id))
              .filter(
                (m): m is NonNullable<typeof m> => Boolean(m)
              ) ?? [];

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

                <p className="font-light text-sm text-gray-500">
                  {project.description}
                </p>

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
