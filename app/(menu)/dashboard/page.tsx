"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDueDate } from "@/utils/date";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskRow } from "@/components/dashboard/TaskRow";
import { Project } from "@/validations/project";
import { Task } from "@/validations/task";
import { getTasks } from "@/lib/api/task";
import { getProjects } from "@/lib/api/project";
import { getMembers } from "@/lib/api/member";

function getProjectName(projects: Project[], id: string) {
  const project = projects.find((p) => p.id === id);
  return project ? project.name : "";
}

function getStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const overdue = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done",
  ).length;
  return { total, completed, inProgress, overdue };
}

function getRecentTasks(tasks: any[], count = 5) {
  return [...tasks]
    .filter((t) => t.dueDate)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
    .slice(0, count);
}

export default function Dashboard() {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  if (
    tasksQuery.isLoading ||
    projectsQuery.isLoading ||
    membersQuery.isLoading
  ) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (tasksQuery.isError || projectsQuery.isError || membersQuery.isError) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-red-600">Error</h1>
        <Button onClick={() => queryClient.invalidateQueries()}>Retry</Button>
      </div>
    );
  }

  const tasks = tasksQuery.data!;
  const projects = projectsQuery.data!;
  const members = membersQuery.data!;

  const stats = getStats(tasks);
  const recentTasks = getRecentTasks(tasks);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        Dashboard
      </h1>
      <p className="text-lg text-zinc-500 mb-8">
        Welcome back, {members[0]?.name}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Tasks" value={stats.total} change="+12%" />
        <StatCard title="Completed" value={stats.completed} change="+8%" />
        <StatCard title="In Progress" value={stats.inProgress} change="+5%" />
        <StatCard title="Overdue" value={stats.overdue} change="-2%" />
      </div>

      <Card className="rounded-lg shadow p-6 bg-white dark:bg-zinc-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
          <Button variant="link" className="text-blue-600 p-0 h-auto">
            View all &rarr;
          </Button>
        </div>
        <ul>
          {recentTasks.map((task: Task) => (
            <TaskRow
              key={task.id}
              id={task.id}
              checked={task.status === "done"}
              title={task.title}
              project={getProjectName(projects, task.projectId)}
              status={task.status}
              due={formatDueDate(task.dueDate)}
            />
          ))}
        </ul>
      </Card>
    </div>
  );
}
