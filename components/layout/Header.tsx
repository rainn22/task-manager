"use client";

import Link from "next/link";
import { Bell, Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useHeaderMeta } from "@/hooks/useHeaderMeta";

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

export default function Header() {
  const pathname = usePathname();
  const { title, subtitle } = useHeaderMeta();

  const isDashboard = pathname === "/dashboard";
  const isTasksList = pathname === "/tasks";
  const isTaskDetail =
    pathname.startsWith("/tasks/") && pathname !== "/tasks/new";
  const isProjectsList = pathname === "/projects";
  const isProjectDetail = pathname.startsWith("/projects/");

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
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>

        {(isDashboard || isTasksList) && <AddTaskButton />}

        {isTaskDetail && (
          <>
            <Button variant="outline">
              <SquarePen className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        )}

        {isProjectsList && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}

        {isProjectDetail && <AddTaskButton />}
      </div>
    </header>
  );
}
