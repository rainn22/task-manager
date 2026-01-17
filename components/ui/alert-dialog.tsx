"use client";

import Link from "next/link";
import { Bell, Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useHeaderMeta } from "@/hooks/useHeaderMeta";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteTask } from "@/lib/api/task";

function AddTaskButton() {
  return (
    <Button asChild>
      <Link href="/tasks/new">
        <Plus className="mr-2 h-4 w-4" />
        New Task
      </Link>
    </Button>
  );
}

function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onCancel}
      />

      {/* Panel */}
      <div className="relative w-[92vw] max-w-sm rounded-xl border bg-white p-6 shadow-xl">
        <h2 id="confirm-title" className="text-lg font-semibold">
          {title}
        </h2>
        <p id="confirm-desc" className="mt-2 text-sm text-zinc-600">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md bg-zinc-200 px-4 py-2 text-sm hover:bg-zinc-300 disabled:opacity-60"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const { title, subtitle } = useHeaderMeta();
  const [showConfirm, setShowConfirm] = useState(false);

  const isDashboard = pathname === "/dashboard";
  const isTasksList = pathname === "/tasks";
  const isTaskNew = pathname === "/tasks/new";
  const isTaskDetail = pathname.startsWith("/tasks/") && !isTaskNew;

  const isProjectsList = pathname === "/projects";
  const isProjectDetail = pathname.startsWith("/projects/") && !isProjectsList;

  // Use params for /tasks/[id]
  const taskId = isTaskDetail ? params?.id : undefined;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!taskId) throw new Error("Missing task id");
      await deleteTask(taskId);
    },
    onSuccess: () => {
      setShowConfirm(false);
      router.push("/tasks");
      router.refresh();
    },
    onError: (err) => {
      console.error("Delete failed:", err);
      setShowConfirm(false);
    },
  });

  const deleting = deleteMutation.isPending; // ✅ v5

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-4">
      <div className="flex items-center">
        <SidebarTrigger className="md:hidden" />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold leading-tight">{title}</h1>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" type="button">
          <Bell className="h-4 w-4" />
        </Button>

        {(isDashboard || isTasksList) && <AddTaskButton />}

        {isTaskDetail && taskId && (
          <>
            <Button asChild variant="outline">
              <Link href={`/tasks/${taskId}/edit`}>
                <SquarePen className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>

            <Button
              variant="destructive"
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        )}

        {isProjectsList && (
          <Button type="button">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}

        {isProjectDetail && <AddTaskButton />}
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        loading={deleting}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </header>
  );
}
