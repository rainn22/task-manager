"use client";

import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  status: string;
  projectName?: string;
};

export default function DashboardPage() {
  const { data: tasks = [], isLoading, isError } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in progress").length;
  const overdue = tasks.filter((t) => t.status === "overdue").length;

  return (
    <div className="p-10 min-h-screen w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back!</p>
          </div>
          <Link
            href="/tasks/new"
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
          >
            + New Task
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Tasks", value: total, color: "bg-blue-100 text-blue-800" },
            { label: "Completed", value: completed, color: "bg-green-100 text-green-800" },
            { label: "In Progress", value: inProgress, color: "bg-yellow-100 text-yellow-800" },
            { label: "Overdue", value: overdue, color: "bg-red-100 text-red-800" },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-600">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-20 rounded" />
                ) : (
                  <span className={`text-4xl font-bold ${stat.color}`}>{stat.value}</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tasks */}
        <Card className="shadow-sm max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-24 w-full rounded" />
            ) : isError ? (
              <div className="text-red-500">Failed to load tasks.</div>
            ) : tasks.length === 0 ? (
              <div className="text-gray-400">No tasks found.</div>
            ) : (
              <ul>
                {tasks.slice(0, 5).map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center py-3 border-b last:border-b-0"
                  >
                    <div>
                      <Link
                        href={`/tasks/${task.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {task.title}
                      </Link>
                      <span className="ml-2 text-xs text-gray-400">{task.projectName}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : task.status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }