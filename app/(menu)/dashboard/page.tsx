"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to get project name by id
function getProjectName(projects: any[], id: string) {
  const project = projects.find((p) => p.id === id);
  return project ? project.name : "";
}

// Helper to format due date
function formatDueDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
    return "Today";
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  )
    return "Tomorrow";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Helper to get dashboard stats
function getStats(tasks: any[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const overdue = tasks.filter(
    (t) => new Date(t.dueDate) < new Date() && t.status !== "done"
  ).length;
  return { total, completed, inProgress, overdue };
}

// Helper to get recent tasks (sorted by due date)
function getRecentTasks(tasks: any[], count = 5) {
  return [...tasks]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, count);
}

// React Query fetch function
async function fetchDBData() {
  const res = await fetch("/db.json");
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboard-db"],
    queryFn: fetchDBData,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="text-lg text-zinc-500 mb-8">Welcome back, John</p>
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-red-700 dark:text-red-400">
          Error
        </h1>
        <p className="text-red-500 mt-2">
          {(error as Error).message || "Failed to load dashboard."}
        </p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["dashboard-db"] })}>
          Retry
        </Button>
      </div>
    );
  }

  const stats = getStats(data.tasks);
  const recentTasks = getRecentTasks(data.tasks);

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        Dashboard
      </h1>
      <p className="text-lg text-zinc-500 mb-8">Welcome back, John</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          change="+12%"
         
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          change="+8%"
        
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          change="+5%"
         
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          change="-2%"
         
        />
      </div>

      {/* Recent Tasks */}
      <Card className="rounded-lg shadow p-6 bg-white dark:bg-zinc-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
          <Button variant="link" className="text-blue-600 p-0 h-auto">
            View all &rarr;
          </Button>
        </div>
        <ul>
          {recentTasks.map((task: any) => (
            <TaskRow
              key={task.id}
              checked={task.status === "done"}
              title={task.title}
              project={getProjectName(data.projects, task.projectId)}
              status={task.status}
              due={formatDueDate(task.dueDate)}
            />
          ))}
        </ul>
      </Card>
    </div>
  );
}

// --- UI Components ---

function StatCard({ title, value, change, icon }: any) {
  return (
    <Card className="rounded-lg shadow p-6 flex flex-col gap-2 bg-white dark:bg-zinc-900">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">{title}</span>
        {icon}
      </div>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-green-500 text-sm">{change} from last week</span>
    </Card>
  );
}

function TaskRow({
  checked,
  title,
  project,
  status,
  due,
}: {
  checked: boolean;
  title: string;
  project: string;
  status: "done" | "in-progress" | "todo";
  due: string;
}) {
  return (
    <li className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="accent-black"
        />
        <div>
          <span
            className={`font-medium ${
              checked ? "line-through text-zinc-400" : ""
            }`}
          >
            {title}
          </span>
          <span className="block text-xs text-zinc-400">{project}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        <DueBadge due={due} />
      </div>
    </li>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "done")
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        Done
      </Badge>
    );
  if (status === "in-progress")
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
        In Progress
      </Badge>
    );
  return (
    <Badge variant="secondary">
      To Do
    </Badge>
  );
}

function DueBadge({ due }: { due: string }) {
  let color = "bg-zinc-200 text-zinc-700";
  if (due === "Today") color = "bg-red-100 text-red-700";
  if (due === "Tomorrow") color = "bg-yellow-100 text-yellow-700";
  if (due === "Jan 10") color = "bg-blue-100 text-blue-700";
  return (
    <Badge className={`text-xs ${color}`}>{due}</Badge>
  );
}