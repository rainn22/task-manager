"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Project = { id: string; name: string };
type Member = { id: string; name: string };

type TaskStatus = "todo" | "in-progress" | "done";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  projectId?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  comments?: any[];
  attachments?: any[];
  assignees?: string[];
};

type DBData = {
  projects: Project[];
  tasks: Task[];
  members?: Member[];
};

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

// Fetch function for React Query
async function fetchDBData(): Promise<DBData> {
  const res = await fetch("/db.json");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export default function TaskPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const queryClient = useQueryClient();

  // React Query fetching
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<DBData>({
    queryKey: ["tasks-db"],
    queryFn: fetchDBData,
  });

  // Simulate mutation for toggling done (local only)
  const mutation = useMutation({
    mutationFn: ({
      taskId,
      checked,
    }: {
      taskId: string;
      checked: boolean;
    }) => {
      // Simulate PATCH request (replace with real API if needed)
      queryClient.setQueryData(["tasks-db"], (oldData: DBData | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          tasks: oldData.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: checked ? CONFIG.DONE_VALUE : CONFIG.TODO_VALUE,
                }
              : t
          ),
        };
      });
      return Promise.resolve();
    },
  });

  const projects = data?.projects ?? [];
  const members = data?.members ?? [];
  const tasks = data?.tasks ?? [];

  const projectNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projects) map.set(p.id, p.name);
    return map;
  }, [projects]);

  // Filter and search logic
  const filteredTasks = tasks.filter((task) => {
    const status = normalizeStatus(task.status);
    const matchesFilter = filter === "all" ? true : status === filter;
    const matchesSearch =
      search.trim() === "" ||
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  // Loading state
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

  // Error state
  if (isError) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-red-700 dark:text-red-400">
          Error
        </h1>
        <p className="text-red-500 mt-2">
          {(error as Error).message || "Failed to load tasks."}
        </p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["tasks-db"] })}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        Tasks
      </h1>
      <p className="text-zinc-500 mb-6">{filteredTasks.length} tasks shown</p>

      {/* Filters and Search */}
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

      {/* Tasks List */}
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
                onCheckedChange={(next) =>
                  mutation.mutate({ taskId: task.id, checked: next })
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

function TaskRow({
  id,
  checked,
  onCheckedChange,
  title,
  description,
  status,
  project,
  comments,
  attachments,
  flagged,
  due,
  initialsList,
  maxInitials,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (isChecked: boolean) => void;
  title: string;
  description?: string;
  status: TaskStatus;
  project: string;
  comments: number;
  attachments: number;
  flagged: boolean;
  due: string;
  initialsList: string[];
  maxInitials: number;
}) {
  const shown = initialsList.slice(0, maxInitials);
  const remaining = Math.max(0, initialsList.length - shown.length);

  return (
    <li className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div className="flex items-center gap-3 w-1/2 min-w-0">
        <Input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="accent-black w-4 h-4"
        />
        <div className="min-w-0">
          <span
            className={`font-medium text-base ${
              checked
                ? "line-through text-zinc-400"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {title}
          </span>
          {description ? (
            <span className="block text-xs text-zinc-400 truncate">
              {description}
            </span>
          ) : null}
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center gap-2 w-1/2 justify-end">
        <ProjectBadge project={project} />
        <IconBadge label="💬" value={comments} />
        <IconBadge label="📎" value={attachments} />
        {flagged && <IconBadge label="🚩" />}
        {due && <IconBadge label="📅" value={due} />}
        <div className="flex items-center gap-1 ml-2">
          {shown.map((ini, idx) => (
            <AssigneeCircle key={`${id}-${ini}-${idx}`} text={ini} />
          ))}
          {remaining > 0 ? (
            <span className="h-7 px-2 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center">
              +{remaining}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  if (status === "done") {
    return (
      <Badge className="ml-2 bg-green-100 text-green-700 border-green-200">
        Done
      </Badge>
    );
  }
  if (status === "in-progress") {
    return (
      <Badge className="ml-2 bg-orange-100 text-orange-700 border-orange-200">
        In Progress
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="ml-2">
      To Do
    </Badge>
  );
}

function ProjectBadge({ project }: { project: string }) {
  return (
    <Badge variant="outline" className="px-2 py-1">
      {project}
    </Badge>
  );
}

function IconBadge({ label, value }: { label: string; value?: string | number }) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
      <span>{label}</span>
      {value !== undefined && <span>{value}</span>}
    </Badge>
  );
}

function AssigneeCircle({ text }: { text: string }) {
  return (
    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-violet-500 text-white text-[10px] font-bold">
      {text}
    </span>
  );
}