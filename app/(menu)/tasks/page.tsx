"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getTasks } from "@/lib/api/task";
import { getProjects } from "@/lib/api/project";
import { getMembers } from "@/lib/api/member";
import { Task, TaskStatus } from "@/validations/task";
import { Project } from "@/validations/project";
import { Member } from "@/validations/member";
import TaskRow from "@/components/task/TaskRow";

const CONFIG = {
  MAX_ASSIGNEES_NOT_DONE: 3,
  DONE_VALUE: "done" as TaskStatus,
  TODO_VALUE: "todo" as TaskStatus,
};

function normalizeStatus(status?: string): TaskStatus {
  const s = (status ?? "").toLowerCase().trim();
  if (s === "done" || s === "completed") return "done";
  if (s === "in progress" || s === "in-progress") return "in-progress";
  if (s === "to do" || s === "todo" || s === "to-do") return "todo";
  return "todo";
}

function getProjectName(projects: Project[], id?: string) {
  if (!id) return "General";
  const project = projects.find((p) => p.id === id);
  return project ? project.name : "General";
}

function formatDueDate(dateStr?: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getAssigneeInitialsList(members: Member[], ids: string[] = []) {
  return ids
    .map((id) => {
      const m = members.find((x) => x.id === id);
      if (!m?.name) return "";
      return m.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0]?.toUpperCase())
        .join("")
        .slice(0, 2);
    })
    .filter(Boolean);
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
];

export default function TaskPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

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

  const mutation = useMutation({
    mutationFn: async ({
      taskId,
      checked,
    }: {
      taskId: string;
      checked: boolean;
    }) => ({ taskId, checked }),
    onSuccess: ({ taskId, checked }) => {
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old
          ? old.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    status: checked ? CONFIG.DONE_VALUE : CONFIG.TODO_VALUE,
                  }
                : t
            )
          : old
      );
    },
  });

  const isLoading =
    tasksQuery.isLoading || projectsQuery.isLoading || membersQuery.isLoading;

  const isError =
    tasksQuery.isError || projectsQuery.isError || membersQuery.isError;

  const error = 
  tasksQuery.error || projectsQuery.error || membersQuery.error;


  const tasks = tasksQuery.data ?? [];
  const projects = projectsQuery.data ?? [];
  const members = membersQuery.data ?? [];

  const projectNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projects) map.set(p.id, p.name);
    return map;
  }, [projects]);

  const filteredTasks = tasks.filter((task) => {
    const status = normalizeStatus(task.status);
    const matchesFilter = filter === "all" ? true : status === filter;
    const matchesSearch =
      search.trim() === "" ||
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Tasks
        </h1>
        <p className="text-zinc-500 mt-2">Loading...</p>
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
          {(error as Error).message || "Failed to load tasks."}
        </p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["tasks"] })}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
<h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        Tasks
      </h1>
      <p className="text-zinc-500 mb-6">{filteredTasks.length} tasks shown</p>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              onClick={() => setFilter(f.value)}
              className="rounded-full text-sm font-medium"
            >
              {f.label}
            </Button>
          ))}
        </div>
        <Input
          type="text"
          placeholder="Search tasks..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="rounded-lg shadow p-4 bg-white dark:bg-zinc-900">
        <ul>
          {filteredTasks.map((task) => {
            const status = normalizeStatus(task.status);
            const checked = status === "done";
            const project =
              projectNameById.get(task.projectId ?? "") ??
              getProjectName(projects, task.projectId);
            const comments = task.comments?.length ?? 0;
            const attachments = task.attachments?.length ?? 0;
            const flagged = task.priority === "high";
            const due = formatDueDate(task.dueDate);
            const initialsList = getAssigneeInitialsList(
              members,
              task.assignees ?? []
            );

            return (
              <TaskRow
                key={task.id}
                id={task.id}
                checked={checked}
                onCheckedChange={() =>
                  mutation.mutate({ taskId: task.id, checked: !checked })
                }
                title={task.title}
                description={task.description}
                status={status}
                project={project}
                comments={comments}
                attachments={attachments}
                flagged={flagged}
                due={due}
                initialsList={initialsList}
                maxInitials={!checked ? CONFIG.MAX_ASSIGNEES_NOT_DONE : 99}
              />
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
