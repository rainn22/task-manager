"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getTaskById } from "@/lib/api/task";
import { getMembers } from "@/lib/api/member";
import { getProjectById } from "@/lib/api/project";
import TaskBreadcrumb from "@/components/task/breadcrumb";
import TaskSubtasks from "@/components/task/subtask";
import TaskComments from "@/components/task/comment";
import TaskDetails from "@/components/task/detail";
import TaskHeader from "@/components/task/header";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: task, isLoading, isError } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });

  const { data: project } = useQuery({
    queryKey: ["project", task?.projectId],
    queryFn: () => getProjectById(task!.projectId),
    enabled: !!task?.projectId,
  });

  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  if (isLoading) return <Skeleton className="h-32 w-full" />;
  if (isError || !task)
    return <p className="text-red-500">Failed to load task</p>;

  return (
    <div className="md:px-6 space-y-6">
      <TaskBreadcrumb title={task.title} />
      <TaskHeader task={task} />
      <TaskSubtasks subtasks={task.subtasks ?? []} />
      <TaskComments comments={task.comments ?? []} />
      <TaskDetails
        task={task}
        members={members ?? []}
        project={project}
      />
    </div>
  );
}
