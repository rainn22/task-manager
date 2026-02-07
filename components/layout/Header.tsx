'use client';

import Link from 'next/link';
import { Bell, Plus, SquarePen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useHeaderMeta } from '@/hooks/useHeaderMeta';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { deleteTask } from '@/lib/api/task';
import ConfirmModal from '@/components/ui/ConfirmModal';

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
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const { title, subtitle } = useHeaderMeta();
  const [showConfirm, setShowConfirm] = useState(false);

  const isDashboard = pathname === '/dashboard';
  const isTasksList = pathname === '/tasks';
  const isTaskNew = pathname === '/tasks/new';
  const isTaskDetail = pathname.startsWith('/tasks/') && !isTaskNew;

  const isProjectsList = pathname === '/projects';
  const isProjectDetail = pathname.startsWith('/projects/') && !isProjectsList;

  // Use params for /tasks/[id]
  const taskId = isTaskDetail ? params?.id : undefined;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!taskId) throw new Error('Missing task id');
      await deleteTask(taskId);
    },
    onSuccess: () => {
      setShowConfirm(false);
      router.push('/tasks');
      router.refresh();
    },
    onError: (err) => {
      console.error('Delete failed:', err);
      setShowConfirm(false);
    },
  });

  const deleting = deleteMutation.isPending; // React Query v5

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-4">
      <div className="flex items-center">
        <SidebarTrigger className="md:hidden" />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold leading-tight">{title}</h1>
          {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
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
              {deleting ? 'Deleting...' : 'Delete'}
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
