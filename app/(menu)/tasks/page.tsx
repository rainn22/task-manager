"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className=" w-full bg-gray-100">
      {/* Full width container (edge-to-edge) */}
      <div className="w-full py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-700">Tasks</h1>
            <p className="text-gray-400 mt-1">{tasks.length} total tasks</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow transition"
          >
            + New Task
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={`px-5 py-2 rounded-lg text-base font-medium border transition focus:outline-none focus:ring-2 focus:ring-gray-300
                ${status === tab.value ? "bg-gray-300 text-gray-700" : "bg-gray-100 text-gray-500"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="shadow-none border border-gray-200 bg-gray-50">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
              </div>
            ) : isError ? (
              <div className="text-red-400 p-8 text-center text-lg bg-gray-50 rounded-xl border">
                Failed to load tasks.
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-gray-400 p-8 text-center text-lg">No tasks found.</div>
            ) : (
              <ul>
                {filteredTasks.map((task) => {
                  const isDone = task.status === "completed";
                  return (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 px-6 py-4 border-b last:border-b-0 group hover:bg-gray-100 transition"
                    >
                      {/* Checkbox => updates db.json via PATCH */}
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => {
                          toggleDoneMutation.mutate({
                            id: task.id,
                            patch: { status: isDone ? "to do" : "completed" },
                          });
                        }}
                        className="accent-gray-400 w-4 h-4 mt-1"
                      />

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-medium text-gray-700 ${
                              isDone ? "line-through text-gray-400" : ""
                            }`}
                          >
                            {task.title}
                          </span>

                          {task.projectName ? (
                            <span className="text-xs text-gray-400">{task.projectName}</span>
                          ) : null}

                          <span
                            className={`text-xs px-2 py-0.5 rounded font-semibold capitalize
                              ${
                                task.status === "completed"
                                  ? "bg-gray-200 text-gray-500"
                                  : task.status === "in progress"
                                  ? "bg-gray-200 text-gray-500"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                          >
                            {task.status === "completed"
                              ? "Done"
                              : task.status === "in progress"
                              ? "In Progress"
                              : "To Do"}
                          </span>
                        </div>

                        {task.description ? (
                          <div className={`text-sm text-gray-500 ${isDone ? "line-through" : ""}`}>
                            {task.description}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Modal for new task */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 w-full max-w-md shadow-xl">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Create New Task</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createTaskMutation.mutate(newTask);
                }}
                className="flex flex-col gap-4"
              >
                <input
                  type="text"
                  placeholder="Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white"
                  required
                />

                <textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask((t) => ({ ...t, description: e.target.value }))}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white"
                  rows={3}
                />

                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={createTaskMutation.status === "pending"}
                    className="bg-gray-300 hover:bg-gray-400 disabled:opacity-60 text-gray-700 px-4 py-2 rounded font-semibold"
                  >
                    {createTaskMutation.status === "pending" ? "Creating..." : "Create"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-100 text-gray-500 px-4 py-2 rounded font-semibold border border-gray-300"
                  >
                    Cancel
                  </button>
                </div>

                {createTaskMutation.isError && (
                  <div className="text-red-400 text-sm">Failed to create task.</div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}