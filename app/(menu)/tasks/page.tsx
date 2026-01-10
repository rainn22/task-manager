"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type TaskStatus = "to do" | "in progress" | "completed";

type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  projectName?: string;
};

const API_BASE = "http://localhost:3001";

const STATUS_TABS: { label: string; value: "all" | TaskStatus }[] = [
  { label: "All", value: "all" },
  { label: "To Do", value: "to do" },
  { label: "In Progress", value: "in progress" },
  { label: "Done", value: "completed" },
];

async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

async function createTaskApi(task: Pick<Task, "title" | "description">): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: task.title,
      description: task.description || "",
      status: "to do" as TaskStatus,
      projectName: "General",
    }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

async function updateTaskApi(params: { id: number; patch: Partial<Task> }): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params.patch),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export default function TasksPage() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, isError } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const [status, setStatus] = useState<"all" | TaskStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const createTaskMutation = useMutation({
    mutationFn: createTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setShowModal(false);
      setNewTask({ title: "", description: "" });
    },
  });

  const toggleDoneMutation = useMutation({
    mutationFn: updateTaskApi,
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previous = queryClient.getQueryData<Task[]>(["tasks"]) || [];
      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.map((t) => (t.id === id ? { ...t, ...patch } : t))
      );

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["tasks"], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const filteredTasks = useMemo(() => {
    if (status === "all") return tasks;
    return tasks.filter((t) => t.status === status);
  }, [tasks, status]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-10 py-6 bg-white border-b gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">{tasks.length} total tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
        >
          + New Task
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-3 px-10 py-4 bg-white border-b">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              status === tab.value
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Centered */}
      <div className="flex-1 px-10 py-8 flex flex-col">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg">
                {status === "all"
                  ? "All Tasks"
                  : `${STATUS_TABS.find((t) => t.value === status)?.label} Tasks`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-24 w-full rounded" />
              ) : isError ? (
                <div className="text-red-500">Failed to load tasks. Please try again.</div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-gray-400">No tasks found. Create your first task!</div>
              ) : (
                <ul>
                  {filteredTasks.map((task) => {
                    const isDone = task.status === "completed";
                    return (
                      <li
                        key={task.id}
                        className="flex items-start gap-3 py-4 border-b last:border-b-0"
                      >
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {
                            toggleDoneMutation.mutate({
                              id: task.id,
                              patch: { status: isDone ? "to do" : "completed" },
                            });
                          }}
                          className="mt-1 w-4 h-4 cursor-pointer"
                        />

                        {/* Task Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span
                                className={`font-medium text-gray-900 ${
                                  isDone ? "line-through text-gray-400" : ""
                                }`}
                              >
                                {task.title}
                              </span>
                              {task.projectName && (
                                <span className="ml-2 text-xs text-gray-400">{task.projectName}</span>
                              )}
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : task.status === "in progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                          {task.description && (
                            <div
                              className={`text-sm text-gray-500 mt-1 ${
                                isDone ? "line-through" : ""
                              }`}
                            >
                              {task.description}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for new task */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTask.title.trim()) {
                    e.preventDefault();
                    createTaskMutation.mutate(newTask);
                  }
                }}
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <textarea
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask((t) => ({ ...t, description: e.target.value }))}
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                rows={4}
              />
              <div className="flex gap-3 mt-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    createTaskMutation.mutate(newTask);
                  }}
                  disabled={createTaskMutation.status === "pending"}
                  className="flex-1 bg-black hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition"
                >
                  {createTaskMutation.status === "pending" ? "Creating..." : "Create Task"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
              {createTaskMutation.isError && (
                <div className="text-red-500 text-sm">
                  Failed to create task. Please try again.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}